import type { Component, HTMLAttributes } from 'vue'

export type FileExplorerItemType = 'file' | 'folder'

/**
 * A node in the tree. Folders hold their children; files never need `children`.
 *
 * `TData` types the optional `data` field, so application metadata travels with
 * the node and comes back fully typed in slots and events.
 */
export interface FileExplorerItem<TData = unknown> {
  /** Stable, unique identifier. Selection, expansion and rendering keys all use it — never the name. */
  id: string
  name: string
  type: FileExplorerItemType
  /** A folder's contents. Omit it or pass `[]` for an empty folder. Ignored on files. */
  children?: FileExplorerItem<TData>[]
  /** Size in bytes. */
  size?: number
  modifiedAt?: Date | string
  /** Overrides the extension parsed from `name` when resolving the default icon. */
  extension?: string
  mimeType?: string
  /** Subtitle on explorer cards. Defaults to the file type, e.g. "Vue component". */
  description?: string
  /** A few lines of text shown on the explorer card, e.g. the start of a source file. */
  preview?: string
  /** Image URL shown on the explorer card instead of `preview`. */
  thumbnail?: string
  disabled?: boolean
  /** Arbitrary application data. */
  data?: TData
}

/** Interaction state of a rendered item, passed to slots and the icon resolver. */
export interface FileExplorerItemState {
  /** Zero-based nesting depth. Root items are `0`. */
  depth: number
  expanded: boolean
  selected: boolean
  disabled: boolean
}

export type FileExplorerIconResolver<TData = unknown> = (
  item: FileExplorerItem<TData>,
  state: FileExplorerItemState,
) => Component | undefined

export type FileTreeSize = 'sm' | 'md'

export interface FileExplorerSelectEvent<TData = unknown> {
  /** The item the user interacted with. */
  item: FileExplorerItem<TData>
  /** The full selection after the interaction. */
  selected: string[]
  originalEvent: Event
}

export interface FileExplorerMoveEvent<TData = unknown> {
  /** The dragged items. Items nested inside another dragged folder are left out. */
  items: FileExplorerItem<TData>[]
  /** The destination folder, or `null` for the root. */
  target: FileExplorerItem<TData> | null
}

export interface FileExplorerItemSlotProps<TData = unknown> extends FileExplorerItemState {
  item: FileExplorerItem<TData>
}

export interface FileExplorerLabelSlotProps<TData = unknown> extends FileExplorerItemSlotProps<TData> {
  /** The active search query, trimmed. Empty when not searching. */
  query: string
}

export interface FileTreeNodeSlots<TData = unknown> {
  /** Replaces the icon and label of every item. The chevron, indentation and row stay in place. */
  item?: (props: FileExplorerItemSlotProps<TData>) => unknown
  icon?: (props: FileExplorerItemSlotProps<TData>) => unknown
  label?: (props: FileExplorerLabelSlotProps<TData>) => unknown
  /** Trailing content, pushed to the end of the row. */
  actions?: (props: FileExplorerItemSlotProps<TData>) => unknown
}

export interface FileTreeSlots<TData = unknown> extends FileTreeNodeSlots<TData> {
  /** Menu entries shown on right-click. `item` is `null` when the empty area was clicked. */
  'context-menu'?: (props: { item: FileExplorerItem<TData> | null }) => unknown
  empty?: (props: { query: string }) => unknown
  loading?: (props: Record<string, never>) => unknown
}

export interface FileTreeProps<TData = unknown> {
  items?: FileExplorerItem<TData>[]
  /** Selected ids. Bind with `v-model:selected`. Always an array, even without `multiple`. */
  selected?: string[]
  /** Initial selection when `selected` is not bound. */
  defaultSelected?: string[]
  /** Expanded folder ids. Bind with `v-model:expanded`. */
  expanded?: string[]
  /** Initially expanded folder ids when `expanded` is not bound. */
  defaultExpanded?: string[]
  /** Filter query. Bind with `v-model:search`, or let `searchable` manage it. */
  search?: string
  /** Allows Ctrl/Cmd-click, Shift-click, Shift+Arrow and Ctrl/Cmd+A to select several items. */
  multiple?: boolean
  /** Renders a search field above the tree. */
  searchable?: boolean
  searchPlaceholder?: string
  /** Replaces the tree with skeleton rows (or the `loading` slot). */
  loading?: boolean
  disabled?: boolean
  /** Enables drag and drop. Listen to `move` to apply the change. */
  draggable?: boolean
  /** Picks the icon for an item. Return `undefined` to fall back to the default icon. */
  getIcon?: FileExplorerIconResolver<TData>
  size?: FileTreeSize
  /** Draws indent guides next to nested items. */
  guides?: boolean
  /** Hides files, like the navigation pane of a desktop file manager. */
  foldersOnly?: boolean
  /** Clicking a folder row opens or closes it. When `false`, only the chevron and arrow keys do. */
  expandOnClick?: boolean
  /** Accessible name of the tree. */
  label?: string
  class?: HTMLAttributes['class']
}

export interface FileTreeEmits<TData = unknown> {
  'update:selected': [value: string[]]
  'update:expanded': [value: string[]]
  'update:search': [value: string]
  /** The user selected an item with the pointer or keyboard. */
  select: [event: FileExplorerSelectEvent<TData>]
  /** A file was activated with Enter or a double-click. */
  open: [item: FileExplorerItem<TData>]
  /** Items were dropped on a folder (or the root). Only with `draggable`. */
  move: [event: FileExplorerMoveEvent<TData>]
}

// --- FileExplorer ---------------------------------------------------------------

export type FileExplorerView = 'grid' | 'list'
export type FileExplorerSortKey = 'name' | 'modified' | 'type' | 'size'

export interface FileExplorerSort {
  key: FileExplorerSortKey
  direction: 'asc' | 'desc'
}

export interface FileExplorerProps<TData = unknown> {
  items?: FileExplorerItem<TData>[]
  /** Id of the open folder, `null` for the root. Bind with `v-model:folder`. */
  folder?: string | null
  defaultFolder?: string | null
  /** Selected ids in the open folder. Bind with `v-model:selected`. */
  selected?: string[]
  defaultSelected?: string[]
  /** Bind with `v-model:view`. */
  view?: FileExplorerView
  defaultView?: FileExplorerView
  /** Filters the open folder by name. Bind with `v-model:search`. */
  search?: string
  /** Bind with `v-model:sort`. Folders always come first. */
  sort?: FileExplorerSort
  /** Ctrl/Cmd-click, Shift-click, Shift+Arrow and Ctrl/Cmd+A. */
  multiple?: boolean
  /** Drag items onto folders, the directory tree or the breadcrumbs. Listen to `move`. */
  draggable?: boolean
  /** Shows the directory tree when the explorer is wide enough. */
  sidebar?: boolean
  loading?: boolean
  disabled?: boolean
  /** Label of the root in the breadcrumbs. */
  rootLabel?: string
  /** `accept` attribute of the upload picker. */
  accept?: string
  /** Icon for tree nodes and details rows. Cards use colored type tiles. */
  getIcon?: FileExplorerIconResolver<TData>
  /** Accessible name of the item list. */
  label?: string
  class?: HTMLAttributes['class']
  /**
   * Called with picked or dropped files and the destination folder. Providing it
   * shows the Upload button and the drop tile, and accepts files dropped from the desktop.
   */
  onUpload?: (files: File[], folder: FileExplorerItem<TData> | null) => void
  /** Called by the New Folder button, which only appears when this is provided. */
  onCreateFolder?: (parent: FileExplorerItem<TData> | null) => void
  /** Called with the selection when the Delete key is pressed. */
  onDelete?: (items: FileExplorerItem<TData>[]) => void
}

export interface FileExplorerEmits<TData = unknown> {
  'update:folder': [id: string | null]
  'update:selected': [value: string[]]
  'update:view': [value: FileExplorerView]
  'update:search': [value: string]
  'update:sort': [value: FileExplorerSort]
  /** A file was opened with a double-click, Enter or the status bar. */
  open: [item: FileExplorerItem<TData>]
  /** Items were dropped on a folder, or on a breadcrumb (`target: null` is the root). */
  move: [event: FileExplorerMoveEvent<TData>]
}

export interface FileExplorerSlots<TData = unknown> {
  /** Replaces the preview area of a card. */
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
  /** Menu entries for right-clicks on items, the empty area and the directory tree. */
  'context-menu'?: (props: { item: FileExplorerItem<TData> | null }) => unknown
  empty?: (props: { query: string }) => unknown
  /** Extra toolbar buttons, before New Folder and Upload. */
  'toolbar-actions'?: (props: Record<string, never>) => unknown
  /** Actions at the end of the status bar. Defaults to an Open button for a single file. */
  'status-actions'?: (props: { items: FileExplorerItem<TData>[] }) => unknown
}
