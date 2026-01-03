import {defineStore} from 'pinia'
import {Book, Package, Image as ImageIcon} from 'lucide-vue-next'

export const useNavigationStore = defineStore('navigation', () => {
    const navGroups = [
        {
            title: 'Core Components',
            icon: Package,
            items: [
                {
                    label: 'Animated Background',
                    to: '/docs/components/animated-background',
                    description: 'Dynamic background elements that react to interaction.'
                },
                {
                    label: 'Animated Input',
                    to: '/docs/components/animated-input',
                    description: 'Input fields with smooth focus and validation animations.'
                },
                {
                    label: 'Animated Tabs',
                    to: '/docs/components/animated-tabs',
                    description: 'Tabs with smooth sliding indicators and transitions.'
                },
                {
                    label: 'Bar Visualizer',
                    to: '/docs/components/bar-visualizer',
                    description: 'Audio-reactive bar visualization components.'
                },
                {
                    label: 'Code Block',
                    to: '/docs/components/code-block',
                    description: 'Syntax highlighting with copy functionality and theme support.'
                },
                {
                    label: 'Encrypted Text',
                    to: '/docs/components/encrypted-text',
                    description: 'Text that reveals itself with a matrix-like scrambling effect.'
                },
                {
                    label: 'Flip Clock',
                    to: '/docs/components/flip-clock',
                    description: 'A retro-style mechanical flip clock with real-time and countdown modes.'
                },
                {
                    label: 'Floating Dock',
                    to: '/docs/components/floating-dock',
                    description: 'MacOS-style floating dock for navigation links.'
                },
                {
                    label: 'Liquid Glass',
                    to: '/docs/components/liquid-glass',
                    description: 'Glassmorphism effects with liquid distortions.'
                },
                {
                    label: 'Magnetic',
                    to: '/docs/components/magnetic',
                    description: 'A magnetic effect for elements that allows them to be attracted to the mouse cursor.'
                },
                {
                    label: 'Morphing Text',
                    to: '/docs/components/morphing-text',
                    description: 'Text that morphs smoothly between different states.'
                },
                {
                    label: 'Partition Bar',
                    to: '/docs/components/partition-bar',
                    description: 'A proportional bar chart component for visualizing distributed data values.'
                },
                {
                    label: 'Pixelated Button',
                    to: '/docs/components/pixelated-button',
                    description: 'Retro-style buttons with pixelated interactions.'
                },
                {
                    label: 'Raya Button',
                    to: '/docs/components/raya-button',
                    description: 'The signature button component of the design system.'
                },
                {
                    label: 'Scroll Spy',
                    to: '/docs/components/scroll-spy',
                    description: 'Automatically highlights navigation items based on scroll position.'
                },
                {
                    label: 'Tree',
                    to: '/docs/components/tree',
                    description: 'Hierarchical tree view for file structures or nested data.'
                },
                {
                    label: 'Wheel Picker',
                    to: '/docs/components/wheel-picker',
                    description: 'iOS-style scrollable wheel picker for selecting values.'
                },
            ]
        },
        {
            title: 'Backgrounds',
            icon: ImageIcon,
            items: [
                {
                    label: 'Ambient Grid',
                    to: '/docs/backgrounds/ambient-grid',
                    description: 'Subtle grid background with ambient lighting effects.'
                },
                {
                    label: 'Background Beams',
                    to: '/docs/backgrounds/background-beams',
                    description: 'Moving beams of light for a cinematic background feel.'
                },
                {
                    label: 'Dotted Glow',
                    to: '/docs/backgrounds/dotted-glow-background',
                    description: 'A matrix of dots that glow on hover or animation.'
                },
                {
                    label: 'Gravity Stars',
                    to: '/docs/backgrounds/gravity-stars',
                    description: 'Stars that react to mouse movement and gravity.'
                },
                {
                    label: 'Ripple Effect',
                    to: '/docs/backgrounds/background-ripple-effect',
                    description: 'Water-like ripple effects triggered by interaction.'
                },
                {
                    label: 'Snow Effect',
                    to: '/docs/backgrounds/snow-effect',
                    description: 'Configurable snow falling animation.'
                },
            ]
        },
        {
            title: 'Guide',
            icon: Book,
            items: [
                {label: 'Installation', to: '/docs/installation', description: 'How to install and configure Raya UI.'},
                {
                    label: 'Introduction',
                    to: '/docs/introduction',
                    description: 'Introduction to the design system and philosophy.'
                },
            ]
        }
    ]

    // Derived constants
    const sortedNavGroups = [...navGroups]
        .sort((a, b) => {
            if (a.title === 'Guide') return -1
            if (b.title === 'Guide') return 1
            return a.title.localeCompare(b.title)
        })
        .map(group => ({
            ...group,
            items: [...group.items].sort((a, b) =>
                a.label.localeCompare(b.label)
            )
        }))

    const flatNavItems = sortedNavGroups.flatMap(group => group.items)

    return {
        navGroups,
        sortedNavGroups,
        flatNavItems
    }
})