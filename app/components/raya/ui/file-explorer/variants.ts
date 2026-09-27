import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The row is a `group/row`, so slot content can react to it (`group-hover/row:…`).
 * A row's leading padding is `depth × --file-explorer-indent`. Override the
 * indent on the root, e.g. `class="[--file-explorer-indent:1.25rem]"`.
 */
export const fileExplorerRowVariants = cva(
  [
    'group/row flex w-full min-w-0 cursor-pointer select-none items-center gap-1.5 rounded-md pe-2 text-foreground/85',
    'ps-[calc(var(--file-explorer-depth)_*_var(--file-explorer-indent)_+_0.25rem)]',
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

export const fileExplorerIconVariants = cva('shrink-0 text-muted-foreground', {
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

export type FileExplorerRowVariants = VariantProps<typeof fileExplorerRowVariants>
