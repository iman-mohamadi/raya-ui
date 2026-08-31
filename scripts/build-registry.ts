import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type {
  ComponentConfig,
  Registry,
  RegistryFileType,
  RegistryItem,
  RegistryItemFile,
} from "../registry/schema";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT_DIR, "app/components/raya/ui");
/** Served at /r/<name>.json — the path the shadcn-vue CLI and docs assume. */
const OUTPUT_DIR = path.join(ROOT_DIR, "public/r");
const SOURCE_MANIFEST = path.join(ROOT_DIR, "registry.json");

const REGISTRY_SCHEMA = "https://shadcn-vue.com/schema/registry.json";
const REGISTRY_ITEM_SCHEMA = "https://shadcn-vue.com/schema/registry-item.json";

const REGISTRY_NAME = "raya-ui";
const REGISTRY_HOMEPAGE = "https://raya-ui.com";

/** Files that live in a component folder but must never ship. */
const IGNORED = new Set(["config.json"]);

/**
 * Only these types take a `target`. For everything else the CLI resolves the
 * destination from the consumer's `components.json` aliases, so hardcoding one
 * would override their project layout.
 */
const TYPES_REQUIRING_TARGET = new Set(["registry:file", "registry:page"]);

function readConfig(componentPath: string): ComponentConfig {
  const configPath = path.join(componentPath, "config.json");
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8")) as ComponentConfig;
  } catch (error) {
    console.warn(`⚠️  Invalid config.json for ${path.basename(componentPath)}:`, error);
    return {};
  }
}

function toPascalCase(str: string) {
  return str
    .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/** Default `index.ts` when a component folder doesn't provide one. */
function generateIndexContent(name: string, files: string[]): string {
  if (name === "wheel-picker") {
    return `export { default as WheelPicker } from './WheelPicker.vue'\nexport { default as WheelPickerWrapper } from './WheelPickerWrapper.vue'\nexport type { WheelPickerOption } from './WheelPicker.vue'\n`;
  }
  if (name === "bar-visualizer") {
    return `export { default as BarVisualizer } from './BarVisualizer.vue'\nexport type { AgentState } from './BarVisualizer.vue'\n`;
  }
  if (name === "animated-tabs") {
    return `export { default as AnimatedTabs } from './AnimatedTabs.vue'\nexport type { TabItem } from './AnimatedTabs.vue'\n`;
  }
  const pascalName = toPascalCase(name);
  const mainFile = files.find((f) => f === `${pascalName}.vue`) || files.find((f) => f.endsWith(".vue"));
  return mainFile
    ? `export { default as ${pascalName} } from './${mainFile}'\n`
    : `// Warning: Could not auto-generate export for ${name}\n`;
}

/** Resolve the file list a component ships: explicit config list, else auto-scan. */
function resolveFileNames(componentName: string, config: ComponentConfig): string[] {
  const componentPath = path.join(COMPONENTS_DIR, componentName);
  const declared = config.files?.length
    ? config.files
    : fs.readdirSync(componentPath).filter((f) => !IGNORED.has(f) && !f.startsWith("."));

  const resolved = declared.filter((fileName) => {
    if (fs.existsSync(path.join(componentPath, fileName))) return true;
    if (fileName !== "index.ts") console.warn(`⚠️  File missing: ${fileName} in ${componentName}`);
    return false;
  });

  // A config `files` list can legitimately omit the barrel; ship the real one
  // rather than letting the generated fallback shadow it.
  if (!resolved.includes("index.ts") && fs.existsSync(path.join(componentPath, "index.ts"))) {
    resolved.push("index.ts");
  }

  return resolved;
}

/**
 * The type stamped on each file entry. `registry:font` is valid at item root
 * but not on a file, so it falls back to the default.
 */
function fileTypeFor(componentName: string, config: ComponentConfig): RegistryFileType {
  if (!config.type) return "registry:ui";
  if (config.type === "registry:font") {
    console.warn(`⚠️  ${componentName}: "registry:font" is not a valid file type; using "registry:ui".`);
    return "registry:ui";
  }
  return config.type;
}

/** Fields shared by the built item and the source manifest entry. */
function itemMetadata(componentName: string, config: ComponentConfig) {
  return {
    name: componentName,
    type: config.type || ("registry:ui" as const),
    ...(config.title ? { title: config.title } : {}),
    ...(config.description ? { description: config.description } : {}),
    dependencies: config.dependencies || [],
    ...(config.devDependencies ? { devDependencies: config.devDependencies } : {}),
    registryDependencies: config.registryDependencies || [],
    ...(config.cssVars ? { cssVars: config.cssVars } : {}),
    ...(config.css ? { css: config.css } : {}),
    ...(config.docs ? { docs: config.docs } : {}),
    ...(config.categories ? { categories: config.categories } : {}),
    ...(config.meta ? { meta: config.meta } : {}),
  };
}

/** The distributable item: file contents inlined so one fetch installs it. */
function buildComponent(componentName: string, config: ComponentConfig): RegistryItem {
  const componentPath = path.join(COMPONENTS_DIR, componentName);
  const fileNames = resolveFileNames(componentName, config);
  const type = fileTypeFor(componentName, config);

  const files: RegistryItemFile[] = fileNames.map((fileName) => ({
    path: `${componentName}/${fileName}`,
    content: fs.readFileSync(path.join(componentPath, fileName), "utf-8"),
    type,
    ...(TYPES_REQUIRING_TARGET.has(type)
      ? { target: `components/ui/${componentName}/${fileName}` }
      : {}),
  }));

  // Generate a default index.ts if the folder didn't provide one.
  if (!files.some((f) => f.path.endsWith("index.ts"))) {
    files.push({
      path: `${componentName}/index.ts`,
      content: generateIndexContent(componentName, fileNames),
      type,
      ...(TYPES_REQUIRING_TARGET.has(type)
        ? { target: `components/ui/${componentName}/index.ts` }
        : {}),
    });
  }

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    ...itemMetadata(componentName, config),
    files,
  };
}

/**
 * The source-manifest entry: repo-relative paths, no inlined content. This is
 * what `shadcn-vue add owner/repo/<name>` reads from the repo root.
 */
function sourceItem(componentName: string, config: ComponentConfig): RegistryItem {
  const fileNames = resolveFileNames(componentName, config);
  const type = fileTypeFor(componentName, config);

  return {
    ...itemMetadata(componentName, config),
    files: fileNames.map((fileName) => ({
      path: `app/components/raya/ui/${componentName}/${fileName}`,
      type,
      ...(TYPES_REQUIRING_TARGET.has(type)
        ? { target: `components/ui/${componentName}/${fileName}` }
        : {}),
    })),
  };
}

function build() {
  // Start from a clean output dir so removed components don't leave stale JSON.
  if (fs.existsSync(OUTPUT_DIR)) {
    for (const f of fs.readdirSync(OUTPUT_DIR)) {
      if (f.endsWith(".json")) fs.unlinkSync(path.join(OUTPUT_DIR, f));
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const componentFolders = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((f) => fs.statSync(path.join(COMPONENTS_DIR, f)).isDirectory())
    .sort((a, b) => a.localeCompare(b));

  console.log(`Found ${componentFolders.length} components to process...`);

  const sourceItems: RegistryItem[] = [];

  for (const componentName of componentFolders) {
    const config = readConfig(path.join(COMPONENTS_DIR, componentName));
    const item = buildComponent(componentName, config);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${componentName}.json`), JSON.stringify(item, null, 2));
    sourceItems.push(sourceItem(componentName, config));
    console.log(`✅ Registry built: ${componentName}`);
  }

  const manifest: Registry = {
    $schema: REGISTRY_SCHEMA,
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items: sourceItems,
  };

  // Root manifest (source paths) — read by `shadcn-vue add owner/repo/<name>`.
  fs.writeFileSync(SOURCE_MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  // Same manifest served over HTTP as the registry index.
  fs.writeFileSync(path.join(OUTPUT_DIR, "registry.json"), JSON.stringify(manifest, null, 2));

  console.log(`\n📦 Registry index written with ${sourceItems.length} items.`);
}

build();
