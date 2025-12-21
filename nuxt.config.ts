import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json'

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ['./app/assets/css/main.css'],

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

    modules: ["shadcn-nuxt", "@vueuse/nuxt", '@nuxtjs/sitemap', '@nuxt/image', '@vueuse/motion/nuxt'],

    // --- SEO Configuration ---
    app: {
        head: {
            titleTemplate: '%s - Raya UI', // Example: "Installation - Raya UI"
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