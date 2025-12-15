import { type VariantProps, cva } from 'class-variance-authority'

export { default as RayaButton } from './RayaButton.vue'

export const rayaButtonVariants = cva(
    // Base classes (mimicking the 'base' array)
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-1.5',
    {
        variants: {
            color: {
                primary: '',
                neutral: '',
                destructive: '',
            },
            variant: {
                solid: '',
                outline: '',
                soft: '',
                subtle: '',
                ghost: '',
                link: '',
            },
            size: {
                xs: 'h-7 px-2 text-xs [&_svg]:size-3.5',
                sm: 'h-8 px-3 text-xs [&_svg]:size-4',
                md: 'h-9 px-4 text-sm [&_svg]:size-4',
                lg: 'h-10 px-5 text-sm [&_svg]:size-5',
                xl: 'h-11 px-6 text-base [&_svg]:size-5',
                icon: 'h-9 w-9 p-0', // Kept for compatibility
            },
            block: {
                true: 'w-full',
            },
            square: {
                true: 'p-0 aspect-square', // Forces square aspect ratio
            },
        },
        compoundVariants: [
            /* =======================
               PRIMARY COLOR VARIANTS
            ======================= */
            {
                color: 'primary',
                variant: 'solid',
                class: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            },
            {
                color: 'primary',
                variant: 'outline',
                class: 'border border-primary/20 bg-background text-primary shadow-sm hover:bg-primary/10 hover:text-primary-dark',
            },
            {
                color: 'primary',
                variant: 'soft',
                class: 'bg-primary/10 text-primary hover:bg-primary/20',
            },
            {
                color: 'primary',
                variant: 'subtle',
                class: 'bg-primary/5 text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/10',
            },
            {
                color: 'primary',
                variant: 'ghost',
                class: 'text-primary hover:bg-primary/10',
            },
            {
                color: 'primary',
                variant: 'link',
                class: 'text-primary underline-offset-4 hover:underline decoration-primary',
            },

            /* =======================
               NEUTRAL COLOR VARIANTS
            ======================= */
            // Neutral Solid -> Acts like "Inverted" (Black button on white mode)
            {
                color: 'neutral',
                variant: 'solid',
                class: 'bg-foreground text-background hover:bg-foreground/90',
            },
            // Neutral Outline -> Standard border button
            {
                color: 'neutral',
                variant: 'outline',
                class: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
            },
            // Neutral Soft -> Secondary grey button
            {
                color: 'neutral',
                variant: 'soft',
                class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            },
            // Neutral Subtle -> Very light border
            {
                color: 'neutral',
                variant: 'subtle',
                class: 'bg-secondary/40 text-secondary-foreground ring-1 ring-inset ring-border hover:bg-secondary/60',
            },
            // Neutral Ghost -> Standard ghost
            {
                color: 'neutral',
                variant: 'ghost',
                class: 'hover:bg-accent hover:text-accent-foreground',
            },
            // Neutral Link -> Muted link
            {
                color: 'neutral',
                variant: 'link',
                class: 'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline',
            },

            /* =======================
               DESTRUCTIVE VARIANTS
            ======================= */
            {
                color: 'destructive',
                variant: 'solid',
                class: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
            },
            {
                color: 'destructive',
                variant: 'outline',
                class: 'border border-destructive/50 text-destructive hover:bg-destructive/10',
            },
            {
                color: 'destructive',
                variant: 'soft',
                class: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
            },
            {
                color: 'destructive',
                variant: 'ghost',
                class: 'text-destructive hover:bg-destructive/10',
            },
        ],
        defaultVariants: {
            color: 'primary',
            variant: 'solid',
            size: 'md',
        },
    },
)

export type RayaButtonVariants = VariantProps<typeof rayaButtonVariants>