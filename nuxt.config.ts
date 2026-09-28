import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ['./app/assets/css/main.css'],

    // Organize components into folders (app/, docs/, common/, raya/ui, …) without
    // Nuxt prefixing their auto-import names. Mirrors the inspira-ui convention.
    components: [
        // Ignore each component's index.ts barrel: without this, pathPrefix:false
        // registers both Foo.vue and index.ts under the same auto-import name and
        // Nuxt warns about the collision. Explicit `@/components/.../` imports still
        // resolve index.ts through normal module resolution.
        // Only `.vue` files are components; colocated `variants.ts`, `types.ts`,
        // composables, etc. would otherwise be registered as auto-import names too.
        { path: '~/components', pathPrefix: false, extensions: ['vue'], ignore: ['**/index.ts'] },
    ],

    // The File Explorer was renamed File Manager: keep old links working.
    routeRules: {
        '/docs/components/file-explorer': { redirect: { to: '/docs/components/file-manager', statusCode: 301 } },
    },

    runtimeConfig: {
        public: {
            version: pkg.version
        }
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    modules: [
        "shadcn-nuxt", "@vueuse/nuxt", '@nuxtjs/sitemap', '@nuxt/image', 'motion-v/nuxt', '@pinia/nuxt',
        // End-to-end test harnesses (e2e/harness) are routed in development, or in a
        // build made with E2E_HARNESS=1 for the performance tests (pnpm test:perf).
        (_options, nuxt) => {
            if (!nuxt.options.dev && !process.env.E2E_HARNESS) return
            nuxt.hook('pages:extend', (pages) => {
                pages.push({
                    name: 'e2e-file-manager',
                    path: '/__e2e/file-manager',
                    file: fileURLToPath(new URL('./e2e/harness/FileManagerHarness.vue', import.meta.url)),
                })
            })
        },
    ],

    app: {
        head: {
            titleTemplate: '%s - Raya UI',
            title: 'Raya UI',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'charset', content: 'utf-8' },
                { name: 'author', content: 'Iman Mohamadi' },
                { name: 'description', content: 'Beautifully designed Vue & Nuxt components built with Shadcn UI & Tailwind. Copy-paste, accessible, and open source.' },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: 'Raya UI - Vue & Nuxt Components' },
                { property: 'og:description', content: 'Copy-paste accessible components for your next Vue project.' },
                { property: 'og:image', content: 'https://raya-ui.com/og-image.png' },
                { property: 'og:url', content: 'https://raya-ui.com' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'Raya UI' },
                { name: 'twitter:description', content: 'Beautifully designed Vue & Nuxt components.' },
                { name: 'twitter:image', content: 'https://raya-ui.com/og-image.png' }
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
            ],
        },
        pageTransition: { name: 'page', mode: 'out-in' },
    },

    site: {
        url: 'https://raya-ui.com',
        name: 'Raya UI',
    },

    shadcn: {
        prefix: '',
        componentDir: '@/components/ui'
    }
});