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
    const chapters = ref<ChapterConfig[]>([
        {
            id: 'hero',
            name: 'Hero',
            progressRange: [0, 0.15],
            colorPalette: { background: '#050505', fog: '#050505', particles: '#00E5FF', ambient: '#ffffff' }
        },
        {
            id: 'philosophy',
            name: 'Philosophy',
            progressRange: [0.15, 0.35],
            // Adjusted away from yellow to maintain premium cinematic aesthetic
            colorPalette: { background: '#070510', fog: '#070510', particles: '#6a0dad', ambient: '#bbbbcc' }
        },
        {
            id: 'universe',
            name: 'Universe',
            progressRange: [0.35, 1.0],
            colorPalette: { background: '#000000', fog: '#000000', particles: '#00aaff', ambient: '#888888' }
        }
    ])

    const currentChapter = ref<ChapterConfig>(chapters.value[0])

    const updateChapterByProgress = (progress: number) => {
        const active = chapters.value.find(c => progress >= c.progressRange[0] && progress <= c.progressRange[1])
        const nextChapter = active || chapters.value[0]
        if (nextChapter.id !== currentChapter.value.id) {
            currentChapter.value = nextChapter
        }
    }

    return { chapters, currentChapter, updateChapterByProgress }
}