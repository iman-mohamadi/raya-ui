import { Vector3 } from 'three'

/**
 * Generates an elegant, futuristic crystal monolith shape.
 * Particles are densely packed along the edges and faces to create an architectural, glass-like structure.
 */
export function generateMonolithShape(particleCount: number): Float32Array {
    const positions = new Float32Array(particleCount * 3)

    // Monolith dimensions (Golden ratio proportions)
    const width = 2.0
    const height = 8.0
    const depth = 2.0

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Distribute particles heavily on the outer shell for an architectural feel
        // with a hollow, mysterious center
        const isEdge = Math.random() > 0.7

        let x = (Math.random() - 0.5) * width
        let y = (Math.random() - 0.5) * height
        let z = (Math.random() - 0.5) * depth

        if (isEdge) {
            // Snap to faces to create sharp, crystal-like edges
            const face = Math.floor(Math.random() * 4)
            if (face === 0) x = width / 2
            if (face === 1) x = -width / 2
            if (face === 2) z = depth / 2
            if (face === 3) z = -depth / 2
        } else {
            // Internal core energy particles
            x *= 0.5
            y *= 0.8
            z *= 0.5
        }

        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
    }

    return positions
}