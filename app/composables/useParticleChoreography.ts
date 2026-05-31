import { ref } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useParticleChoreography = () => {
    const PARTICLE_COUNT = 300000;

    // The 10 narrative shapes
    const geometries = {
        hero: generateMonolith(PARTICLE_COUNT),      // 1. Monolith
        evolution: generateWave(PARTICLE_COUNT),     // 2. Wave Field
        worlds: generateClusters(PARTICLE_COUNT),    // 3. Ecosystems
        philosophy: generateLens(PARTICLE_COUNT),    // 4. Giant Eye/Lens
        engine: generateReactor(PARTICLE_COUNT),     // 5. Futuristic Reactor
        universe: generateStars(PARTICLE_COUNT),     // 6. Constellations
        flow: generateCursor(PARTICLE_COUNT),        // 7. Blinking Cursor
        proof: generateRealities(PARTICLE_COUNT),    // 8. Light Sources
        galaxy: generateNetwork(PARTICLE_COUNT),     // 9. Open Source Galaxy
        finale: generateMonument(PARTICLE_COUNT)     // 10. The Artifact
    }

    // The uniforms that the single GPU shader will read
    const globalUniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 }, // Animates 0 -> 1 during a transition
        uMorphState: { value: 0 }, // 0 = hero->evo, 1 = evo->worlds, etc.
        uColorBase: { value: new THREE.Color('#00E5FF') },
        uColorGlow: { value: new THREE.Color('#FFFFFF') }
    }

    // Array of your section DOM classes in exact order
    const sections = [
        '.scene-hero', '.scene-evolution', '.scene-worlds',
        '.scene-philosophy', '.scene-engine', '.scene-universe',
        '.scene-flow', '.scene-proof', '.scene-galaxy', '.scene-finale'
    ]

    const initScrollChoreography = (shaderMaterial: THREE.ShaderMaterial, geometry: THREE.BufferGeometry) => {
        // Array of the generated position buffers
        const states = Object.values(geometries)

        // Initially set buffer 0 (Hero) and target buffer 1 (Evolution)
        geometry.setAttribute('position', new THREE.BufferAttribute(states[0], 3))
        geometry.setAttribute('positionTarget', new THREE.BufferAttribute(states[1], 3))

        sections.forEach((sectionClass, index) => {
            if (index === sections.length - 1) return // Last section has no "next"

            ScrollTrigger.create({
                trigger: sectionClass,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2, // Cinematic, heavy delay
                onEnter: () => {
                    // When entering a section, prep the buffers for the NEXT morph
                    geometry.setAttribute('position', new THREE.BufferAttribute(states[index], 3))
                    geometry.setAttribute('positionTarget', new THREE.BufferAttribute(states[index + 1], 3))
                    globalUniforms.uMorphState.value = index
                },
                onEnterBack: () => {
                    // Reverse scroll handling
                    geometry.setAttribute('position', new THREE.BufferAttribute(states[index], 3))
                    geometry.setAttribute('positionTarget', new THREE.BufferAttribute(states[index + 1], 3))
                    globalUniforms.uMorphState.value = index
                },
                onUpdate: (self) => {
                    // Drive the shader interpolation natively via GPU
                    globalUniforms.uProgress.value = self.progress

                    // You can also drive color changes here based on the scene
                    // e.g., if (index === 6) // White environment transition
                }
            })
        })
    }

    return { PARTICLE_COUNT, globalUniforms, initScrollChoreography }
}

// --- Geometry Generators (Math representations of your narrative) ---
function generateMonolith(count: number) { /* Crystal logic */ return new Float32Array(count * 3) }
function generateWave(count: number) { /* Fluid wave logic */ return new Float32Array(count * 3) }
function generateClusters(count: number) { /* ... */ return new Float32Array(count * 3) }
// ... (implement specific mathematical shapes for all 10 states)