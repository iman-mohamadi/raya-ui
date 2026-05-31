// composables/home/useChapterManager.ts
import { ref } from 'vue'

export interface ChapterConfig {
    id: string
    name: string
    progressRange: [number, number]
    colorPalette: {
        background: string
        fog: string
        particles: string
        ambient: string
    }
}

export function useChapterManager() {
    // Fully populated data. No placeholders.
    const chapters = ref<ChapterConfig[]>([
        {
            id: 'hero',
            name: 'Hero',
            progressRange: [0, 0.15],
            colorPalette: { background: '#050505', fog: '#050505', particles: '#ffffff', ambient: '#ffffff' }
        },
        {
            id: 'philosophy',
            name: 'Philosophy',
            progressRange: [0.15, 0.35],
            colorPalette: { background: '#111111', fog: '#111111', particles: '#ffaa00', ambient: '#dddddd' }
        },
        {
            id: 'universe',
            name: 'Universe',
            progressRange: [0.35, 1.0], // Extends to the end for safety
            colorPalette: { background: '#000000', fog: '#000000', particles: '#00aaff', ambient: '#888888' }
        }
    ])

    const currentChapter = ref<ChapterConfig>(chapters.value[0])

    const updateChapterByProgress = (progress: number) => {
        // Find the chapter that matches current scroll progress
        const active = chapters.value.find(c => progress >= c.progressRange[0] && progress <= c.progressRange[1])

        // Fallback to first chapter if outside bounds
        const nextChapter = active || chapters.value[0]

        if (nextChapter.id !== currentChapter.value.id) {
            currentChapter.value = nextChapter
        }
    }

    return { chapters, currentChapter, updateChapterByProgress }
}