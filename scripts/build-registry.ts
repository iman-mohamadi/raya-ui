import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type {
  ComponentConfig,
  RegistryItem,
  RegistryItemFile,
} from "../registry/schema";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, "../app/components/raya/ui");
const OUTPUT_DIR = path.join(__dirname, "../public/registry");
const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

/** Files that live in a component folder but must never ship. */
const IGNORED = new Set(["config.json"]);

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

function buildComponent(componentName: string): RegistryItem {
  const componentPath = path.join(COMPONENTS_DIR, componentName);
  const config = readConfig(componentPath);

  // Determine which files to ship: explicit config list, else auto-scan.
  let componentFiles = config.files?.length
    ? config.files
    : fs.readdirSync(componentPath).filter((f) => !IGNORED.has(f) && !f.startsWith("."));

  const files: RegistryItemFile[] = [];
  for (const fileName of componentFiles) {
    const filePath = path.join(componentPath, fileName);
    if (!fs.existsSync(filePath)) {
      if (fileName !== "index.ts") console.warn(`⚠️  File missing: ${fileName} in ${componentName}`);
      continue;
    }
    files.push({
      path: `${componentName}/${fileName}`,
      content: fs.readFileSync(filePath, "utf-8"),
      type: config.type || "registry:ui",
      // Where the file lands in the consumer's project (standard shadcn ui dir).
      target: `components/ui/${componentName}/${fileName}`,
    });
  }

  // Generate a default index.ts if the folder didn't provide one.
  if (!files.some((f) => f.path.endsWith("index.ts"))) {
    const content = generateIndexContent(componentName, componentFiles);
    files.push({
      path: `${componentName}/index.ts`,
      content,
      type: config.type || "registry:ui",
      target: `components/ui/${componentName}/index.ts`,
    });
  }

  const item: RegistryItem = {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: componentName,
    type: config.type || "registry:ui",
    ...(config.title ? { title: config.title } : {}),
    ...(config.description ? { description: config.description } : {}),
    dependencies: config.dependencies || [],
    registryDependencies: config.registryDependencies || [],
    files,
    ...(config.cssVars ? { cssVars: config.cssVars } : {}),
  };
  return item;
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
    .filter((f) => fs.statSync(path.join(COMPONENTS_DIR, f)).isDirectory());

  console.log(`Found ${componentFolders.length} components to process...`);

  const index: Array<Pick<RegistryItem, "name" | "type" | "title" | "description" | "dependencies" | "registryDependencies">> = [];

  for (const componentName of componentFolders) {
    const item = buildComponent(componentName);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${componentName}.json`), JSON.stringify(item, null, 2));
    index.push({
      name: item.name,
      type: item.type,
      ...(item.title ? { title: item.title } : {}),
      ...(item.description ? { description: item.description } : {}),
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
    });
    console.log(`✅ Registry built: ${componentName}`);
  }

  // Manifest of every item (useful for a registry index endpoint).
  index.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify({ name: "raya-ui", homepage: "https://raya-ui.com", items: index }, null, 2),
  );
  console.log(`\n📦 Registry index written with ${index.length} items.`);
}

build();
