import type { Ref, Slot } from 'vue'
import { createContext } from 'reka-ui'
import type { FileManagerMessages } from './messages'
import type { FileManagerOperationState, FileTreeSize } from './types'
import type { LoadState } from './useFileManagerLoader'

/** Inline rename, shared by tree nodes, cards and rows. */
export interface FileManagerRenameContext {
  /** The item showing a rename input, if any. */
  renamingId: Readonly<Ref<string | null>>
  validateRename: (id: string, name: string) => string | undefined
  commitRename: (id: string, name: string) => void
  cancelRename: (id: string) => void
  /**
   * Selector of the layer the rename input is drawn in. The input sits over the
   * item rather than inside it: an option or tree item must not contain
   * interactive elements.
   */
  renameLayer: string
}

/** One drag session. Shared by every drop target inside a `FileManager`. */
export interface FileManagerDragDrop {
  draggingIds: Readonly<Ref<readonly string[]>>
  /** Folder currently under the pointer; `null` is the root, `undefined` is none. */
  dropTargetId: Readonly<Ref<string | null | undefined>>
  /** Hovered folder that refuses the drop. */
  invalidTargetId: Readonly<Ref<string | null | undefined>>
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
export interface FileTreeContext extends FileManagerRenameContext {
  /** The tree's own slots, rendered by each node through SlotOutlet (see slot.ts). */
  slots: Readonly<{ item?: Slot, icon?: Slot, label?: Slot, actions?: Slot }>
  /** Trimmed search query, used to highlight matches. */
  query: Readonly<Ref<string>>
  size: Readonly<Ref<FileTreeSize>>
  guides: Readonly<Ref<boolean>>
  draggable: Readonly<Ref<boolean>>
  dragDrop: FileManagerDragDrop
  messages: Readonly<Ref<FileManagerMessages>>
  onItemSelect: (id: string, event: Event) => void
  onItemOpen: (id: string) => void
  onItemContextMenu: (id: string) => void
  foldersOnly: Readonly<Ref<boolean>>
  /** Children load on demand (`onLoadChildren`). */
  lazy: Readonly<Ref<boolean>>
  loadState: (id: string) => LoadState | undefined
  retryLoad: (id: string) => void
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
 * Lets a `FileTree` rendered inside a `FileManager` join the file manager's drag
 * session, so items can be dragged between the sidebar, the cards and the
 * breadcrumbs. A standalone tree runs its own.
 */
export const [injectSharedDragDrop, provideSharedDragDrop]
  = createContext<FileManagerDragDrop>('FileManagerDragDrop')

/** State shared from `FileManager` with its toolbar, cards, rows and status bar. */
export interface FileManagerContext extends FileManagerRenameContext {
  selected: Readonly<Ref<ReadonlySet<string>>>
  /** Items on the clipboard after Cut, shown dimmed. */
  cutIds: Readonly<Ref<ReadonlySet<string>>>
  favorites: Readonly<Ref<ReadonlySet<string>>>
  /** The running or failed operation shown on an item. */
  itemOperation: (id: string) => FileManagerOperationState | undefined
  /** The item holding the roving tab stop in the content area. */
  focusedId: Readonly<Ref<string | null>>
  /** Ticks every minute, for "5m ago" labels. */
  now: Readonly<Ref<Date>>
  multiple: Readonly<Ref<boolean>>
  draggable: Readonly<Ref<boolean>>
  dragDrop: FileManagerDragDrop
  /** The file manager's own slots, rendered by the items through SlotOutlet (see slot.ts). */
  slots: Readonly<{ preview?: Slot, empty?: Slot, cell?: Slot }>
  /** `dragDrop.draggingIds` as a set: every item checks it. */
  draggingIds: Readonly<Ref<ReadonlySet<string>>>
  messages: Readonly<Ref<FileManagerMessages>>
  onItemClick: (id: string, event: MouseEvent) => void
  /** Checkbox on a card or row: adds or removes the item without touching the rest. */
  onItemToggle: (id: string) => void
  /** Double-click or Enter: folders navigate, files emit `open`. */
  onItemOpen: (id: string) => void
  onItemContextMenu: (id: string) => void
}

export const [injectFileManagerContext, provideFileManagerContext]
  = createContext<FileManagerContext>('FileManager')
