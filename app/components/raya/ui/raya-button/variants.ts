import { type VariantProps, tv } from 'tailwind-variants'

/**
 * Port of the Nuxt UI v4 button theme.
 *
 * Two deliberate differences from upstream:
 *  1. Solid variants use `text-<color>-content` instead of a single global
 *     `text-inverted`. Nuxt UI can get away with one inverted text token because
 *     every brand color there is a 500/400 shade; this design system pairs each
 *     semantic color with its own foreground (`--primary-foreground`, …), so the
 *     pairing has to be per color. `neutral` still uses `text-inverted`.
 *  2. `leadingAvatarSize` returns a Tailwind size class rather than an Avatar
 *     component size token, since the avatar is rendered inline.
 *
 * Every other slot, variant and compound variant matches upstream 1:1.
 */
export const rayaButton = tv({
    slots: {
        base: [
            'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75',
            'transition-colors'
        ],
        label: 'truncate',
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0 rounded-full object-cover bg-elevated',
        leadingAvatarSize: '',
        trailingIcon: 'shrink-0'
    },
    variants: {
        fieldGroup: {
            horizontal: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]',
            vertical: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]'
        },
        color: {
            primary: '',
            secondary: '',
            success: '',
            info: '',
            warning: '',
            error: '',
            neutral: ''
        },
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: '',
            ghost: '',
            link: ''
        },
        size: {
            xs: {
                base: 'px-2 py-1 text-xs gap-1',
                leadingIcon: 'size-4',
                leadingAvatarSize: 'size-4',
                trailingIcon: 'size-4'
            },
            sm: {
                base: 'px-2.5 py-1.5 text-xs gap-1.5',
                leadingIcon: 'size-4',
                leadingAvatarSize: 'size-4',
                trailingIcon: 'size-4'
            },
            md: {
                base: 'px-2.5 py-1.5 text-sm gap-1.5',
                leadingIcon: 'size-5',
                leadingAvatarSize: 'size-5',
                trailingIcon: 'size-5'
            },
            lg: {
                base: 'px-3 py-2 text-sm gap-2',
                leadingIcon: 'size-5',
                leadingAvatarSize: 'size-5',
                trailingIcon: 'size-5'
            },
            xl: {
                base: 'px-3 py-2 text-base gap-2',
                leadingIcon: 'size-6',
                leadingAvatarSize: 'size-6',
                trailingIcon: 'size-6'
            }
        },
        block: {
            true: {
                base: 'w-full justify-center',
                trailingIcon: 'ms-auto'
            }
        },
        square: {
            true: ''
        },
        leading: {
            true: ''
        },
        trailing: {
            true: ''
        },
        loading: {
            true: ''
        },
        active: {
            true: {
                base: ''
            },
            false: {
                base: ''
            }
        }
    },
    compoundVariants: [
        // ----------------------------------------------------------------
        // SOLID
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'solid',
            class: 'text-primary-content bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary outline-primary/25 focus-visible:outline-3'
        },
        {
            color: 'secondary',
            variant: 'solid',
            class: 'text-secondary-content bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary outline-secondary/25 focus-visible:outline-3'
        },
        {
            color: 'success',
            variant: 'solid',
            class: 'text-success-content bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success outline-success/25 focus-visible:outline-3'
        },
        {
            color: 'info',
            variant: 'solid',
            class: 'text-info-content bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info outline-info/25 focus-visible:outline-3'
        },
        {
            color: 'warning',
            variant: 'solid',
            class: 'text-warning-content bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning outline-warning/25 focus-visible:outline-3'
        },
        {
            color: 'error',
            variant: 'solid',
            class: 'text-error-content bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error outline-error/25 focus-visible:outline-3'
        },
        {
            color: 'neutral',
            variant: 'solid',
            class: 'text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted outline-inverted/25 focus-visible:outline-3'
        },

        // ----------------------------------------------------------------
        // OUTLINE
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'outline',
            class: 'ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary'
        },
        {
            color: 'secondary',
            variant: 'outline',
            class: 'ring ring-inset ring-secondary/50 text-secondary-content hover:bg-secondary/50 active:bg-secondary/50 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary'
        },
        {
            color: 'success',
            variant: 'outline',
            class: 'ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-success/25 focus-visible:outline-3 focus-visible:ring-success'
        },
        {
            color: 'info',
            variant: 'outline',
            class: 'ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-info/25 focus-visible:outline-3 focus-visible:ring-info'
        },
        {
            color: 'warning',
            variant: 'outline',
            class: 'ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning'
        },
        {
            color: 'error',
            variant: 'outline',
            class: 'ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-error/25 focus-visible:outline-3 focus-visible:ring-error'
        },
        {
            color: 'neutral',
            variant: 'outline',
            class: 'ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted'
        },

        // ----------------------------------------------------------------
        // SOFT
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'soft',
            class: 'text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 outline-primary/25 focus-visible:outline-3 disabled:bg-primary/10 aria-disabled:bg-primary/10'
        },
        {
            color: 'secondary',
            variant: 'soft',
            class: 'text-secondary-content bg-secondary/50 hover:bg-secondary/75 active:bg-secondary/75 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/50 aria-disabled:bg-secondary/50'
        },
        {
            color: 'success',
            variant: 'soft',
            class: 'text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10'
        },
        {
            color: 'info',
            variant: 'soft',
            class: 'text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10'
        },
        {
            color: 'warning',
            variant: 'soft',
            class: 'text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10'
        },
        {
            color: 'error',
            variant: 'soft',
            class: 'text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10'
        },
        {
            color: 'neutral',
            variant: 'soft',
            class: 'text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated'
        },

        // ----------------------------------------------------------------
        // SUBTLE
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'subtle',
            class: 'text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary'
        },
        {
            color: 'secondary',
            variant: 'subtle',
            class: 'text-secondary-content ring ring-inset ring-secondary bg-secondary/50 hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary/50 aria-disabled:bg-secondary/50 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary'
        },
        {
            color: 'success',
            variant: 'subtle',
            class: 'text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success'
        },
        {
            color: 'info',
            variant: 'subtle',
            class: 'text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info'
        },
        {
            color: 'warning',
            variant: 'subtle',
            class: 'text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning'
        },
        {
            color: 'error',
            variant: 'subtle',
            class: 'text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error'
        },
        {
            color: 'neutral',
            variant: 'subtle',
            class: 'ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted'
        },

        // ----------------------------------------------------------------
        // GHOST
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'ghost',
            class: 'text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'secondary',
            variant: 'ghost',
            class: 'text-secondary-content hover:bg-secondary/50 active:bg-secondary/50 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'success',
            variant: 'ghost',
            class: 'text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'info',
            variant: 'ghost',
            class: 'text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'warning',
            variant: 'ghost',
            class: 'text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'error',
            variant: 'ghost',
            class: 'text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
        },
        {
            color: 'neutral',
            variant: 'ghost',
            class: 'text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent'
        },

        // ----------------------------------------------------------------
        // LINK
        // ----------------------------------------------------------------
        {
            color: 'primary',
            variant: 'link',
            class: 'text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3'
        },
        {
            color: 'secondary',
            variant: 'link',
            class: 'text-secondary-content hover:text-secondary-content/75 active:text-secondary-content/75 disabled:text-secondary-content aria-disabled:text-secondary-content outline-secondary/25 focus-visible:outline-3'
        },
        {
            color: 'success',
            variant: 'link',
            class: 'text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3'
        },
        {
            color: 'info',
            variant: 'link',
            class: 'text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3'
        },
        {
            color: 'warning',
            variant: 'link',
            class: 'text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3'
        },
        {
            color: 'error',
            variant: 'link',
            class: 'text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3'
        },
        {
            color: 'neutral',
            variant: 'link',
            class: 'text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3'
        },

        // ----------------------------------------------------------------
        // SQUARE (icon-only) padding
        // ----------------------------------------------------------------
        { size: 'xs', square: true, class: 'p-1' },
        { size: 'sm', square: true, class: 'p-1.5' },
        { size: 'md', square: true, class: 'p-1.5' },
        { size: 'lg', square: true, class: 'p-2' },
        { size: 'xl', square: true, class: 'p-2' },

        // ----------------------------------------------------------------
        // LOADING — spin whichever icon slot the loader occupies
        // ----------------------------------------------------------------
        {
            loading: true,
            leading: true,
            class: {
                leadingIcon: 'animate-spin'
            }
        },
        {
            loading: true,
            leading: false,
            trailing: true,
            class: {
                trailingIcon: 'animate-spin'
            }
        }
    ],
    defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
    }
})

/** Kept as an alias so existing `rayaButtonVariants` imports keep working. */
export const rayaButtonVariants = rayaButton

export type RayaButtonVariants = VariantProps<typeof rayaButton>
