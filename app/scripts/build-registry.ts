import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const COMPONENTS_DIR = path.join(__dirname, "../components/ui");
const OUTPUT_DIR = path.join(__dirname, "../../public/registry");

// Interfaces
interface ComponentConfig {
    dependencies?: string[];
    files?: string[];
    type?: string;
}

interface RegistryItem {
    name: string;
    type: string;
    dependencies: string[];
    files: Array<{ path: string; content: string; type: string }>;
}

const build = () => {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 1. Read all directories in the components folder
    const componentFolders = fs.readdirSync(COMPONENTS_DIR).filter((file) => {
        return fs.statSync(path.join(COMPONENTS_DIR, file)).isDirectory();
    });

    console.log(`Found ${componentFolders.length} components to process...`);

    componentFolders.forEach((componentName) => {
        const componentPath = path.join(COMPONENTS_DIR, componentName);
        const configPath = path.join(componentPath, "config.json");

        let config: ComponentConfig = { dependencies: [], files: [] };

        // 2. Read config.json if it exists
        if (fs.existsSync(configPath)) {
            try {
                const configContent = fs.readFileSync(configPath, "utf-8");
                config = JSON.parse(configContent);
            } catch (error) {
                console.warn(`⚠️  Invalid config.json for ${componentName}:`, error);
            }
        }

        // 3. Determine files to include
        // If specific files aren't listed in config, auto-scan the directory
        let componentFiles = config.files;
        if (!componentFiles || componentFiles.length === 0) {
            componentFiles = fs.readdirSync(componentPath).filter(file => {
                // Exclude config.json and hidden files
                return file !== "config.json" && !file.startsWith(".");
            });
        }

        const fileList: Array<{ path: string; content: string; type: string }> = [];

        // 4. Read file contents
        componentFiles.forEach((fileName) => {
            const filePath = path.join(componentPath, fileName);

            // Skip if file doesn't exist (e.g. if config.json lists a missing file)
            if (!fs.existsSync(filePath)) {
                // If it's index.ts, we might be about to generate it, so ignore missing warning
                if (fileName !== 'index.ts') {
                    console.warn(`⚠️  File missing: ${fileName} in ${componentName}`);
                }
                return;
            }

            try {
                const content = fs.readFileSync(filePath, "utf-8");
                fileList.push({
                    path: `${componentName}/${fileName}`,
                    content: content,
                    type: "registry:ui",
                });
            } catch (error) {
                console.error(`❌ Error reading ${fileName} for ${componentName}:`, error);
                process.exit(1);
            }
        });

        // 5. Handle index.ts generation
        const hasIndex = fileList.some(f => f.path.endsWith('index.ts'));

        if (!hasIndex) {
            const indexContent = generateIndexContent(componentName, componentFiles);
            fileList.push({
                path: `${componentName}/index.ts`,
                content: indexContent,
                type: "registry:ui",
            });
        }

        // 6. Build Registry Item
        const registryItem: RegistryItem = {
            name: componentName,
            type: config.type || "registry:ui",
            dependencies: config.dependencies || [],
            files: fileList,
        };

        const outputPath = path.join(OUTPUT_DIR, `${componentName}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(registryItem, null, 2));
        console.log(`✅ Registry built: ${componentName}`);
    });
};

/**
 * Generates default content for index.ts based on component name
 */
function generateIndexContent(name: string, files: string[]): string {
    // Custom overrides for complex components
    if (name === "wheel-picker") {
        return `export { default as WheelPicker } from './WheelPicker.vue'\nexport { default as WheelPickerWrapper } from './WheelPickerWrapper.vue'\nexport type { WheelPickerOption } from './WheelPicker.vue'\n`;
    }
    if (name === "bar-visualizer") {
        return `export { default as BarVisualizer } from './BarVisualizer.vue'\nexport type { AgentState } from './BarVisualizer.vue'\n`;
    }
    if (name === "animated-tabs") {
        return `export { default as AnimatedTabs } from './AnimatedTabs.vue'\nexport type { TabItem } from './AnimatedTabs.vue'\n`;
    }

    // Default strategy: Find the main Vue file matching the PascalCase name
    const pascalName = toPascalCase(name);
    const mainFile = files.find(f => f === `${pascalName}.vue`) || files.find(f => f.endsWith('.vue'));

    if (mainFile) {
        return `export { default as ${pascalName} } from './${mainFile}'\n`;
    }

    return `// Warning: Could not auto-generate export for ${name}\n`;
}

function toPascalCase(str: string) {
    return str
        .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^[a-z]/, (c) => c.toUpperCase());
}

build();