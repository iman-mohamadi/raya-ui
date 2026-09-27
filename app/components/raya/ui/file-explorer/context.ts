import type { Ref } from 'vue'
import { createContext } from 'reka-ui'
import type { FileTreeSize } from './types'

/** One drag session. Shared by every drop target inside a `FileExplorer`. */
/** Inline rename, shared by tree nodes, cards and rows. */
export interface FileExplorerRenameContext {
  /** The item showing a rename input, if any. */
  renamingId: Readonly<Ref<string | null>>
  validateRename: (id: string, name: string) => string | undefined
  commitRename: (id: string, name: string) => void
  cancelRename: (id: string) => void
}

export interface FileExplorerDragDrop {
  draggingIds: Readonly<Ref<readonly string[]>>
  /** Folder currently under the pointer; `null` is the root, `undefined` is none. */
  dropTargetId: Readonly<Ref<string | null | undefined>>
  onDragStart: (id: string, event: DragEvent) => void
  onDragOver: (id: string | null, event: DragEvent) => void
  onDrop: (event: DragEvent) => void
  onDragEnd: () => void
  onDragLeave: (event: DragEvent) => void
}

/**
 * State shared from `FileTree` with every recursive node. It is id-based on
 * purpose: nodes receive their item as a prop, so nothing here depends on the
 * consumer's `data` type, and a node never needs a watcher of its own.
 */
export interface FileTreeContext extends FileExplorerRenameContext {
  /** Trimmed search query, used to highlight matches. */
  query: Readonly<Ref<string>>
  size: Readonly<Ref<FileTreeSize>>
  guides: Readonly<Ref<boolean>>
  draggable: Readonly<Ref<boolean>>
  dragDrop: FileExplorerDragDrop
  onItemSelect: (id: string, event: Event) => void
  onItemOpen: (id: string) => void
  onItemContextMenu: (id: string) => void
  foldersOnly: Readonly<Ref<boolean>>
  /** Whether clicking a folder row (not its chevron) also opens or closes it. */
  expandOnClick: Readonly<Ref<boolean>>
  extendSelection: (id: string) => void
  selectAll: () => void
  /** F2 on a node. */
  startRename: (id: string) => void
  /** Delete on a node. */
  deleteFrom: (id: string) => void
}

export const [injectFileTreeContext, provideFileTreeContext]
  = createContext<FileTreeContext>('FileTree')

/**
 * Lets a `FileTree` rendered inside a `FileExplorer` join the explorer's drag
 * session, so items can be dragged between the sidebar, the cards and the
 * breadcrumbs. A standalone tree runs its own.
 */
export const [injectSharedDragDrop, provideSharedDragDrop]
  = createContext<FileExplorerDragDrop>('FileExplorerDragDrop')

/** State shared from `FileExplorer` with its toolbar, cards, rows and status bar. */
export interface FileExplorerContext extends FileExplorerRenameContext {
  selected: Readonly<Ref<ReadonlySet<string>>>
  /** The item holding the roving tab stop in the content area. */
  focusedId: Readonly<Ref<string | null>>
  /** Ticks every minute, for "5m ago" labels. */
  now: Readonly<Ref<Date>>
  draggable: Readonly<Ref<boolean>>
  dragDrop: FileExplorerDragDrop
  onItemClick: (id: string, event: MouseEvent) => void
  /** Double-click or Enter: folders navigate, files emit `open`. */
  onItemOpen: (id: string) => void
  onItemContextMenu: (id: string) => void
}

export const [injectFileExplorerContext, provideFileExplorerContext]
  = createContext<FileExplorerContext>('FileExplorer')
