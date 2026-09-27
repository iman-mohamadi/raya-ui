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
    'data-[drop-invalid]:bg-destructive/5 data-[drop-invalid]:ring-1 data-[drop-invalid]:ring-inset data-[drop-invalid]:ring-destructive/40',
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

/**
 * Column template shared by the details header and rows. The tracks come from
 * CSS variables set by the content area; narrow explorers keep pinned columns.
 */
export const fileExplorerColumns = 'grid gap-3 grid-cols-(--file-explorer-columns-narrow) @xl:grid-cols-(--file-explorer-columns)'

/** Popover surface of context and dropdown menus (shadcn-vue's menu styling). */
export const fileExplorerMenuContent = [
  'z-50 max-h-(--reka-context-menu-content-available-height) min-w-[11rem] overflow-x-hidden overflow-y-auto',
  'rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
].join(' ')

export const fileExplorerMenuItem = [
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden',
  'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  'data-[destructive]:text-destructive data-[destructive]:focus:bg-destructive/10 dark:data-[destructive]:focus:bg-destructive/20',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*=text-])]:text-muted-foreground',
].join(' ')
