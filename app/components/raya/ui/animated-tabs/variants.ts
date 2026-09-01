import { type VariantProps, tv } from 'tailwind-variants'

/**
 * Port of the Nuxt UI v4 tabs theme.
 *
 * Three deliberate differences from upstream:
 *  1. Active pill labels use `text-<color>-content` instead of a single global
 *     `text-inverted`, for the same reason as RayaButton: this design system
 *     pairs each semantic color with its own foreground. `neutral` keeps
 *     `text-inverted`, which is already correct on `bg-inverted`.
 *  2. `leadingAvatarSize` and `trailingBadgeSize` return Tailwind classes rather
 *     than Avatar/Badge component size tokens, since both are rendered inline.
 *  3. `trailingBadge` carries the neutral subtle badge styling inline.
 *
 * The `in-[[data-slot=list]:not(:has([data-slot=indicator]))]` selectors are the
 * upstream fallback for a list rendered without an indicator — kept verbatim so
 * the theme stays diffable against Nuxt UI.
 */
export const animatedTabs = tv({
    slots: {
        root: 'flex items-center gap-2',
        list: 'relative flex p-1 group',
        indicator: 'absolute transition-[translate,width] duration-200 ease-out motion-reduce:transition-none',
        trigger: [
            'group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75',
            'transition-colors'
        ],
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0 rounded-full object-cover bg-elevated',
        leadingAvatarSize: '',
        label: 'truncate',
        trailingBadge: 'shrink-0 inline-flex items-center justify-center rounded-full font-medium ring ring-inset ring-accented bg-elevated text-default',
        trailingBadgeSize: 'text-[10px]/4 px-1.5',
        content: 'w-full rounded-md focus-visible:outline-3'
    },
    variants: {
        color: {
            primary: { content: 'outline-primary/25' },
            secondary: { content: 'outline-secondary/25' },
            success: { content: 'outline-success/25' },
            info: { content: 'outline-info/25' },
            warning: { content: 'outline-warning/25' },
            error: { content: 'outline-error/25' },
            neutral: { content: 'outline-inverted/25' }
        },
        variant: {
            pill: {
                list: 'bg-elevated rounded-lg',
                trigger: [
                    'grow',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:content-[\'\'] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:inset-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:rounded-md in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:shadow-xs in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:-z-10 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:isolate'
                ],
                indicator: 'rounded-md shadow-xs'
            },
            link: {
                list: 'border-default',
                indicator: 'rounded-full',
                trigger: 'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:content-[\'\'] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:rounded-full'
            }
        },
        orientation: {
            horizontal: {
                root: 'flex-col',
                list: 'w-full',
                indicator: 'left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)',
                trigger: 'justify-center'
            },
            vertical: {
                list: 'flex-col',
                indicator: 'top-0 h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)'
            }
        },
        size: {
            xs: {
                trigger: 'px-2 py-1 text-xs gap-1',
                leadingIcon: 'size-4',
                leadingAvatarSize: 'size-4'
            },
            sm: {
                trigger: 'px-2.5 py-1.5 text-xs gap-1.5',
                leadingIcon: 'size-4',
                leadingAvatarSize: 'size-4'
            },
            md: {
                trigger: 'px-3 py-1.5 text-sm gap-1.5',
                leadingIcon: 'size-5',
                leadingAvatarSize: 'size-5'
            },
            lg: {
                trigger: 'px-3 py-2 text-sm gap-2',
                leadingIcon: 'size-5',
                leadingAvatarSize: 'size-5'
            },
            xl: {
                trigger: 'px-3 py-2 text-base gap-2',
                leadingIcon: 'size-6',
                leadingAvatarSize: 'size-6'
            }
        }
    },
    compoundVariants: [
        // ----------------------------------------------------------------
        // ORIENTATION × VARIANT
        // ----------------------------------------------------------------
        {
            orientation: 'horizontal',
            variant: 'pill',
            class: {
                indicator: 'inset-y-1'
            }
        },
        {
            orientation: 'horizontal',
            variant: 'link',
            class: {
                list: 'border-b -mb-px',
                indicator: '-bottom-px h-px',
                trigger: 'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:inset-x-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:-bottom-[calc(var(--spacing)+1px)] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:h-px'
            }
        },
        {
            orientation: 'vertical',
            variant: 'pill',
            class: {
                indicator: 'inset-x-1',
                list: 'items-center',
                trigger: 'w-full justify-center'
            }
        },
        {
            orientation: 'vertical',
            variant: 'link',
            class: {
                list: 'border-s -ms-px',
                indicator: '-start-px w-px',
                trigger: 'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:inset-y-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:-start-[calc(var(--spacing)+1px)] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:w-px'
            }
        },

        // ----------------------------------------------------------------
        // COLOR × PILL
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'pill',
            class: {
                indicator: 'bg-primary',
                trigger: [
                    'data-[state=active]:text-primary-content outline-primary/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-primary'
                ]
            }
        },
        {
            color: 'secondary',
            variant: 'pill',
            class: {
                indicator: 'bg-secondary',
                trigger: [
                    'data-[state=active]:text-secondary-content outline-secondary/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-secondary'
                ]
            }
        },
        {
            color: 'success',
            variant: 'pill',
            class: {
                indicator: 'bg-success',
                trigger: [
                    'data-[state=active]:text-success-content outline-success/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-success'
                ]
            }
        },
        {
            color: 'info',
            variant: 'pill',
            class: {
                indicator: 'bg-info',
                trigger: [
                    'data-[state=active]:text-info-content outline-info/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-info'
                ]
            }
        },
        {
            color: 'warning',
            variant: 'pill',
            class: {
                indicator: 'bg-warning',
                trigger: [
                    'data-[state=active]:text-warning-content outline-warning/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-warning'
                ]
            }
        },
        {
            color: 'error',
            variant: 'pill',
            class: {
                indicator: 'bg-error',
                trigger: [
                    'data-[state=active]:text-error-content outline-error/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-error'
                ]
            }
        },
        {
            color: 'neutral',
            variant: 'pill',
            class: {
                indicator: 'bg-inverted',
                trigger: [
                    'data-[state=active]:text-inverted outline-inverted/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-inverted'
                ]
            }
        },

        // ----------------------------------------------------------------
        // COLOR × LINK
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'link',
            class: {
                indicator: 'bg-primary',
                trigger: [
                    'data-[state=active]:text-primary outline-primary/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-primary'
                ]
            }
        },
        {
            color: 'secondary',
            variant: 'link',
            class: {
                indicator: 'bg-secondary',
                trigger: [
                    'data-[state=active]:text-secondary-content outline-secondary/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-secondary'
                ]
            }
        },
        {
            color: 'success',
            variant: 'link',
            class: {
                indicator: 'bg-success',
                trigger: [
                    'data-[state=active]:text-success outline-success/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-success'
                ]
            }
        },
        {
            color: 'info',
            variant: 'link',
            class: {
                indicator: 'bg-info',
                trigger: [
                    'data-[state=active]:text-info outline-info/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-info'
                ]
            }
        },
        {
            color: 'warning',
            variant: 'link',
            class: {
                indicator: 'bg-warning',
                trigger: [
                    'data-[state=active]:text-warning outline-warning/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-warning'
                ]
            }
        },
        {
            color: 'error',
            variant: 'link',
            class: {
                indicator: 'bg-error',
                trigger: [
                    'data-[state=active]:text-error outline-error/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-error'
                ]
            }
        },
        {
            color: 'neutral',
            variant: 'link',
            class: {
                indicator: 'bg-inverted',
                trigger: [
                    'data-[state=active]:text-highlighted outline-inverted/25 focus-visible:outline-3',
                    'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-inverted'
                ]
            }
        }
    ],
    defaultVariants: {
        color: 'primary',
        variant: 'pill',
        size: 'md'
    }
})

export type AnimatedTabsVariants = VariantProps<typeof animatedTabs>
