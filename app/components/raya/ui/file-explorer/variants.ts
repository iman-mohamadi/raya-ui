import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The row is a `group/row`, so slot content can react to it (`group-hover/row:…`).
 * A row's leading padding is `depth × --file-tree-indent`. Override the
 * indent on the root, e.g. `class="[--file-tree-indent:1.25rem]"`.
 */
export const fileTreeRowVariants = cva(
  [
    'group/row flex w-full min-w-0 cursor-pointer select-none items-center gap-1.5 rounded-md pe-2 text-foreground/85',
    'ps-[calc(var(--file-tree-depth)_*_var(--file-tree-indent)_+_0.25rem)]',
    'transition-colors duration-100 motion-reduce:transition-none',
    'hover:bg-accent/70 hover:text-foreground',
    'data-[selected]:bg-accent data-[selected]:text-foreground',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent',
    'data-[dragging]:opacity-50',
    'data-[drop-target]:bg-primary/10 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/40',
  ],
  {
    variants: {
      size: {
        sm: 'h-6 text-xs',
        md: 'h-7 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export const fileTreeIconVariants = cva('shrink-0 text-muted-foreground', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type FileTreeRowVariants = VariantProps<typeof fileTreeRowVariants>

/** Toolbar buttons of the explorer. Kept local so the component has no dependency on a Button. */
export const fileExplorerButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium outline-none',
    'transition-colors duration-100 motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        outline: 'border border-border bg-transparent text-foreground hover:bg-accent',
        solid: 'bg-foreground text-background hover:bg-foreground/90',
      },
      size: {
        sm: 'h-8 px-2.5',
        icon: 'size-7',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm',
    },
  },
)

/** Column template shared by the details header and rows. Narrow explorers keep only name and size. */
export const fileExplorerColumns = 'grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 @xl:grid-cols-[minmax(0,1fr)_6.5rem_9rem_5.5rem]'
