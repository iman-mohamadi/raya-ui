import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM modules (Nuxt uses ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const OUTPUT_DIR = path.join(__dirname, "../../public/registry");

// Define your components here.
// You can add more objects to this array later for new components.
const COMPONENTS = [
    {
        name: "wheel-picker",
        dependencies: ["@vueuse/core"],
        files: [
            "WheelPicker.vue",
            "WheelPickerWrapper.vue",
        ]
    },
    {
        name: "ambient-grid",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
            "AmbientGrid.vue"
        ]
    },
    {
        name: "liquid-glass",
        dependencies: [],
        files: [
            "LiquidGlass.vue"
        ]
    },
    {
        name: "code-block",
        dependencies: ["highlight.js", "lucide-vue-next", "clsx", "tailwind-merge"],
        files: [
            "CodeBlock.vue"
        ]
    },
    {
        name: "animated-tabs",
        dependencies: ["@vueuse/core", "clsx", "tailwind-merge"],
        files: ["AnimatedTabs.vue"]
    },
    {
        name: "bar-visualizer",
        dependencies: ["@vueuse/core", "clsx", "tailwind-merge"],
        files: [
            "BarVisualizer.vue"
        ]
    },
    {
        name: "tree",
        dependencies: [],
        files: [
            "Tree.vue"
        ]
    },
    {
        name: "dotted-glow-background",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
            "DottedGlowBackground.vue"
        ]
    },
    {
        name: "background-ripple-effect",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
            "BackgroundRippleEffect.vue"
        ]
    },
];

const build = () => {
    // 1. Create Output Directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 2. Loop through every component
    COMPONENTS.forEach((component) => {
        const componentDir = path.join(__dirname, `../components/ui/${component.name}`);
        const fileList = [];

        // Read each file defined in the config
        component.files.forEach((fileName) => {
            const filePath = path.join(componentDir, fileName);

            try {
                const content = fs.readFileSync(filePath, "utf-8");
                fileList.push({
                    path: `${component.name}/${fileName}`,
                    content: content,
                    type: "registry:ui",
                });
            } catch (error) {
                console.error(`❌ Error reading ${fileName} for ${component.name}:`, error);
                process.exit(1);
            }
        });

        // 3. Generate index.ts content dynamically
        // Note: This logic assumes a simple default export or specific patterns.
        // For components with types like BarVisualizer or WheelPicker, we might want custom index content
        // or a smarter generator. For now, we follow the previous pattern but check for types.

        let indexContent = '';

        if (component.name === "wheel-picker") {
            indexContent = `export { default as WheelPicker } from './WheelPicker.vue'
export { default as WheelPickerWrapper } from './WheelPickerWrapper.vue'
export type { WheelPickerOption } from './WheelPicker.vue'
`;
        } else if (component.name === "bar-visualizer") {
            indexContent = `export { default as BarVisualizer } from './BarVisualizer.vue'
export type { AgentState } from './BarVisualizer.vue'
`;
        } else if (component.name === "animated-tabs") {
            indexContent = `export { default as AnimatedTabs } from './AnimatedTabs.vue'
export type { TabItem } from './AnimatedTabs.vue'
`;
        } else {
            // Default generation
            indexContent = `export { default as ${toPascalCase(component.name)} } from './${component.files[0]}'
`;
        }

        fileList.push({
            path: `${component.name}/index.ts`,
            content: indexContent,
            type: "registry:ui",
        });

        // 4. Construct the Registry JSON item
        const registryItem = {
            name: component.name,
            type: "registry:ui",
            dependencies: component.dependencies,
            files: fileList,
        };

        // 5. Write the JSON file to public/registry/
        const outputPath = path.join(OUTPUT_DIR, `${component.name}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(registryItem, null, 2));

        console.log(`✅ Registry built: public/registry/${component.name}.json`);
    });
};

function toPascalCase(str: string) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

build();