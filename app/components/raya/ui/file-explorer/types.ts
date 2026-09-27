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

export type FileExplorerSize = 'sm' | 'md'

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

export interface FileExplorerNodeSlots<TData = unknown> {
  /** Replaces the icon and label of every item. The chevron, indentation and row stay in place. */
  item?: (props: FileExplorerItemSlotProps<TData>) => unknown
  icon?: (props: FileExplorerItemSlotProps<TData>) => unknown
  label?: (props: FileExplorerLabelSlotProps<TData>) => unknown
  /** Trailing content, pushed to the end of the row. */
  actions?: (props: FileExplorerItemSlotProps<TData>) => unknown
}

export interface FileExplorerSlots<TData = unknown> extends FileExplorerNodeSlots<TData> {
  /** Menu entries shown on right-click. `item` is `null` when the empty area was clicked. */
  'context-menu'?: (props: { item: FileExplorerItem<TData> | null }) => unknown
  empty?: (props: { query: string }) => unknown
  loading?: (props: Record<string, never>) => unknown
}

export interface FileExplorerProps<TData = unknown> {
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
  size?: FileExplorerSize
  /** Draws indent guides next to nested items. */
  guides?: boolean
  /** Accessible name of the tree. */
  label?: string
  class?: HTMLAttributes['class']
}

export interface FileExplorerEmits<TData = unknown> {
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
