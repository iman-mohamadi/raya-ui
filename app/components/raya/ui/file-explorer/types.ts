import type { Component, HTMLAttributes } from 'vue'
import type { FileExplorerMessages } from './messages'

export type FileExplorerItemType = 'file' | 'folder'

/**
 * What the user may do with an item. Every flag defaults to `true`; set one to
 * `false` to hide or disable the matching actions. For folders, `write` governs
 * creating, uploading, pasting and dropping into them.
 *
 * This only shapes the UI — enforce permissions on your server as well.
 */
export interface FileExplorerPermissions {
  read?: boolean
  write?: boolean
  delete?: boolean
  rename?: boolean
  move?: boolean
  copy?: boolean
  download?: boolean
  share?: boolean
}

export type FileExplorerPermission = keyof FileExplorerPermissions

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
  /**
   * A folder's contents. Omit it or pass `[]` for an empty folder. Ignored on files.
   * With `onLoadChildren`, `undefined` means "not loaded yet".
   */
  children?: FileExplorerItem<TData>[]
  /** With lazy loading: `false` marks an unloaded folder as known to be empty. */
  hasChildren?: boolean
  /** More children can be loaded with `onLoadMore`. */
  hasMore?: boolean
  /** Opaque pagination cursor handed back to `onLoadMore`. */
  cursor?: unknown
  /** Size in bytes. */
  size?: number
  createdAt?: Date | string
  modifiedAt?: Date | string
  accessedAt?: Date | string
  owner?: string
  /** Overrides the extension parsed from `name` when resolving the default icon. */
  extension?: string
  mimeType?: string
  /** Subtitle on explorer cards. Defaults to the file type, e.g. "Vue component". */
  description?: string
  /** A few lines of text shown on the explorer card, e.g. the start of a source file. */
  preview?: string
  /** Image URL shown on the explorer card instead of `preview`. */
  thumbnail?: string
  permissions?: FileExplorerPermissions
  /** The item is in the trash: it offers Restore and Delete permanently instead. */
  trashed?: boolean
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

export type FileExplorerFileCategory =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'code'
  | 'text'
  | 'font'
  | '3d'
  | 'executable'
  | 'unknown'

// --- Operations -----------------------------------------------------------------

export type FileExplorerOperation =
  | 'upload'
  | 'download'
  | 'create'
  | 'rename'
  | 'delete'
  | 'trash'
  | 'restore'
  | 'move'
  | 'copy'
  | 'duplicate'
  | 'share'
  | 'load'
  | 'search'
  | 'refresh'
  | 'other'

export type FileExplorerOperationStatus = 'pending' | 'running' | 'success' | 'error' | 'canceled'

/**
 * A long-running operation shown in the explorer's operations panel and on the
 * items it affects. The explorer creates these for handlers that return a
 * promise; you can also pass your own through the `operations` prop.
 */
export interface FileExplorerOperationState {
  id: string
  type: FileExplorerOperation
  status: FileExplorerOperationStatus
  /** 0–100. Omit for an indeterminate progress bar. */
  progress?: number
  /** Replaces the default label, e.g. "Uploading report.pdf". */
  label?: string
  /** Items that show this operation's progress or error inline. */
  itemIds?: string[]
  error?: string
  cancelable?: boolean
  retryable?: boolean
  undoable?: boolean
}

export interface FileExplorerOperationFailure<TData = unknown> {
  source: FileExplorerItem<TData> | File
  error: string
}

/** What a handler may return (or resolve to) to steer the UI afterwards. */
export interface FileExplorerOperationResult<TData = unknown> {
  /** Ids to select and focus once they appear in `items`, e.g. a created folder. */
  select?: string[]
  /** Id to start renaming once it appears in `items`, e.g. "New folder". */
  rename?: string
  /** Offers Undo (and Ctrl/Cmd+Z). What it returns can itself carry an `undo`, which becomes Redo. */
  undo?: () => FileExplorerHandlerResult<TData>
  /** Success message, e.g. "Moved 3 items to Archive". */
  message?: string
  /** Partial failure: these sources failed. Retry runs the handler again with only them. */
  failed?: FileExplorerOperationFailure<TData>[]
}

export type FileExplorerHandlerResult<TData = unknown> =
  | void
  | FileExplorerOperationResult<TData>
  | Promise<void | FileExplorerOperationResult<TData>>

/** Passed as the last argument to every handler. */
export interface FileExplorerOperationContext<TData = unknown> {
  /** Aborted when the user cancels the operation. */
  signal: AbortSignal
  /** Reports progress (0–100) to the operations panel. */
  progress: (percent: number) => void
  /** Asks the user how to resolve conflicts your server reported. `null` means cancel. */
  resolveConflicts: (conflicts: FileExplorerConflict<TData>[]) => Promise<FileExplorerConflictResolution<TData>[] | null>
}

// --- Conflicts --------------------------------------------------------------------

export type FileExplorerConflictReason = 'exists' | 'invalid-name' | 'permission' | 'unknown'

export interface FileExplorerConflict<TData = unknown> {
  /** Name of the incoming item. */
  name: string
  /** The item being copied or moved, or the file being uploaded. */
  source: FileExplorerItem<TData> | File
  /** The existing item it collides with. */
  destination: FileExplorerItem<TData> | null
  /** The folder receiving it, `null` for the root. */
  target: FileExplorerItem<TData> | null
  reason: FileExplorerConflictReason
  /** Shown instead of the default explanation. */
  message?: string
}

export type FileExplorerConflictAction = 'replace' | 'keep-both' | 'skip'

export interface FileExplorerConflictResolution<TData = unknown> {
  conflict: FileExplorerConflict<TData>
  action: FileExplorerConflictAction
  /** For `keep-both`: a free name, e.g. "report (1).pdf". */
  name?: string
}

// --- Events -----------------------------------------------------------------------

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
  /** How name clashes in `target` were resolved. Skipped items are not in `items`. */
  conflicts?: FileExplorerConflictResolution<TData>[]
}

/** Payload of actions on a set of items: download, duplicate, share, trash, … */
export interface FileExplorerItemsEvent<TData = unknown> {
  items: FileExplorerItem<TData>[]
}

export type FileExplorerDownloadEvent<TData = unknown> = FileExplorerItemsEvent<TData>
export type FileExplorerDeleteEvent<TData = unknown> = FileExplorerItemsEvent<TData>
export type FileExplorerCopyEvent<TData = unknown> = FileExplorerItemsEvent<TData>

export type FileExplorerClipboardOperation = 'copy' | 'cut'

export interface FileExplorerClipboard<TData = unknown> {
  operation: FileExplorerClipboardOperation
  items: FileExplorerItem<TData>[]
}

export interface FileExplorerPasteEvent<TData = unknown> {
  items: FileExplorerItem<TData>[]
  /** The destination folder, or `null` for the root. */
  target: FileExplorerItem<TData> | null
  operation: FileExplorerClipboardOperation
  /** How name clashes were resolved. Skipped items are not in `items`. */
  conflicts: FileExplorerConflictResolution<TData>[]
}

export interface FileExplorerPreviewEvent<TData = unknown> {
  item: FileExplorerItem<TData>
}

export interface FileExplorerFolderEvent<TData = unknown> {
  /** The folder, `null` for the root. */
  folder: FileExplorerItem<TData> | null
}

export interface FileExplorerLoadMoreEvent<TData = unknown> extends FileExplorerFolderEvent<TData> {
  /** The folder's `cursor`, or the listing's. */
  cursor: unknown
}

export interface FileExplorerSearchEvent<TData = unknown> extends FileExplorerFolderEvent<TData> {
  /** Trimmed query. Empty when the search was cleared. */
  query: string
}

export interface FileExplorerUploadContext<TData = unknown> extends FileExplorerOperationContext<TData> {
  /** Path of each file relative to the dropped or picked folder, `''` for loose files. Same order as `files`. */
  relativePaths: string[]
  /** How name clashes in the destination were resolved. Skipped files are not in `files`. */
  conflicts: FileExplorerConflictResolution<TData>[]
}

// --- Slots --------------------------------------------------------------------------

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

/** Scope of the `#context-menu` slot of `FileTree` and `FileExplorer`. */
export interface FileExplorerContextMenuSlotProps<TData = unknown> {
  /** The item that was right-clicked, or `null` for the empty area. */
  item: FileExplorerItem<TData> | null
  /** Starts renaming `item` inline once the menu has closed. Needs `onRename`. */
  rename: () => void
  /**
   * Deletes `item` — or the whole selection when `item` is part of it — after
   * the confirmation dialog. Needs `onDelete`.
   */
  remove: () => void
  /**
   * Runs `action` once the menu has closed. Use it for your own entries that
   * open a dialog or move focus: an open menu keeps focus trapped until then.
   */
  defer: (action: () => void) => void
}

/** Validates a new name. Return an error message to refuse it. */
export type FileExplorerNameValidator<TData = unknown> = (name: string, item: FileExplorerItem<TData>) => string | undefined

export interface FileTreeSlots<TData = unknown> extends FileTreeNodeSlots<TData> {
  /** Menu entries shown on right-click. `item` is `null` when the empty area was clicked. */
  'context-menu'?: (props: FileExplorerContextMenuSlotProps<TData>) => unknown
  empty?: (props: { query: string }) => unknown
  loading?: (props: Record<string, never>) => unknown
  /** Body of the delete confirmation dialog. */
  'delete-description'?: (props: { items: FileExplorerItem<TData>[] }) => unknown
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
  /** Reading direction. Defaults to Reka's `ConfigProvider`, then the page. */
  dir?: 'ltr' | 'rtl'
  /** Overrides user-facing strings. */
  messages?: Partial<FileExplorerMessages>
  /** Called with the new name after an inline rename (F2 or the context menu). Enables renaming. */
  onRename?: (item: FileExplorerItem<TData>, name: string, context?: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Extra checks for new names. Empty names and duplicates in the same folder are always refused. */
  validateName?: FileExplorerNameValidator<TData>
  /** Called with the selection on Delete, or from the context menu. Enables deleting. */
  onDelete?: (items: FileExplorerItem<TData>[], context?: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Asks for confirmation in a dialog before calling `onDelete`. */
  confirmDelete?: boolean
  /**
   * Loads a folder whose `children` is `undefined` when it is expanded. Update
   * `items` with the children; a rejected promise shows an error with Retry.
   */
  onLoadChildren?: (folder: FileExplorerItem<TData>, context: FileExplorerOperationContext<TData>) => unknown
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

export type FileExplorerColumnKey = 'name' | 'modified' | 'created' | 'accessed' | 'type' | 'size' | 'owner' | 'permissions'
/** A built-in column key, or the `key` of a custom column. */
export type FileExplorerSortKey = FileExplorerColumnKey | (string & {})

export interface FileExplorerSort {
  key: FileExplorerSortKey
  direction: 'asc' | 'desc'
}

/** A column of the details view. Built-in keys only need `key`. */
export interface FileExplorerColumn<TData = unknown> {
  key: FileExplorerSortKey
  label?: string
  /** CSS grid track, e.g. `"8rem"` or `"minmax(0, 1fr)"`. */
  width?: string
  align?: 'start' | 'end'
  /** Defaults to `true` when the column has a value to sort by. */
  sortable?: boolean
  /** Value to sort by (and to display, unless `format` is given). */
  value?: (item: FileExplorerItem<TData>) => string | number | Date | undefined
  format?: (item: FileExplorerItem<TData>) => string
  /** Keep the column on narrow explorers. Name and size always stay. */
  pinned?: boolean
}

/** A flat set of items shown instead of the open folder: search results, Recent, Starred, Trash… */
export interface FileExplorerListing<TData = unknown> {
  items: FileExplorerItem<TData>[]
  /** Shown in place of the breadcrumbs. Defaults to the active location's label. */
  label?: string
  hasMore?: boolean
  cursor?: unknown
  /** The listing is the trash: offers Empty trash. */
  trash?: boolean
}

/** An entry in the sidebar, above the directory tree. */
export interface FileExplorerLocation {
  id: string
  label: string
  icon?: Component
  /**
   * Makes the entry a shortcut to a folder (`null` is the root). Without it,
   * selecting the entry sets `v-model:location` and you provide a `listing`.
   */
  folder?: string | null
  badge?: string | number
  /** Accepts drops that move items to the trash. */
  trash?: boolean
  disabled?: boolean
}

export interface FileExplorerLocationSection {
  id?: string
  label?: string
  locations: FileExplorerLocation[]
}

export type FileExplorerActionId =
  | 'open'
  | 'preview'
  | 'download'
  | 'new-folder'
  | 'new-file'
  | 'upload'
  | 'upload-folder'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'duplicate'
  | 'rename'
  | 'trash'
  | 'delete'
  | 'restore'
  | 'delete-permanently'
  | 'empty-trash'
  | 'share'
  | 'copy-link'
  | 'favorite'
  | 'unfavorite'
  | 'properties'
  | 'refresh'

/** A resolved action: what the toolbar, menus, shortcuts and status bar show. */
export interface FileExplorerAction {
  id: FileExplorerActionId
  label: string
  icon: Component
  /** Display form of the keyboard shortcut, e.g. "⌘C" or "Ctrl+C". */
  shortcut?: string
  group: 'open' | 'new' | 'clipboard' | 'organize' | 'share' | 'trash' | 'info'
  destructive?: boolean
  disabled: boolean
  run: () => void
}

type Handler<TEvent, TData> = (event: TEvent, context: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>

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
  /** Copied or cut items. Bind with `v-model:clipboard` to share it between explorers. */
  clipboard?: FileExplorerClipboard<TData> | null
  /** Active sidebar location without a folder. Bind with `v-model:location`. */
  location?: string | null
  /** Items shown instead of the open folder (search results, Recent, Trash…). */
  listing?: FileExplorerListing<TData> | null
  /** Sidebar sections above the directory tree. */
  locations?: FileExplorerLocationSection[]
  /** Your own operations (e.g. per-file upload progress), shown next to the explorer's. */
  operations?: FileExplorerOperationState[]
  /** Details view columns. Defaults to name, modified, type and size. */
  columns?: (FileExplorerColumnKey | FileExplorerColumn<TData>)[]
  /** Starred item ids. */
  favorites?: string[]
  /** Ctrl/Cmd-click, Shift-click, Shift+Arrow and Ctrl/Cmd+A. */
  multiple?: boolean
  /** Drag items onto folders, the directory tree or the breadcrumbs. Listen to `move`. */
  draggable?: boolean
  /** Shows the directory tree when the explorer is wide enough. */
  sidebar?: boolean
  loading?: boolean
  disabled?: boolean
  /** Hides every action that changes data. */
  readonly?: boolean
  /** Label of the root in the breadcrumbs. */
  rootLabel?: string
  /** `accept` attribute of the upload picker, also enforced for dropped files. */
  accept?: string
  /** Largest accepted upload, in bytes. */
  maxFileSize?: number
  /** Adds "Upload folder" (where the browser supports it) and accepts dropped folders. */
  directoryUpload?: boolean
  /** Filter with `onSearch` on your server instead of by name in the open folder. */
  remoteSearch?: boolean
  /** Delay before `onSearch` runs, in ms. */
  searchDebounce?: number
  /** Icon for tree nodes and details rows. Cards use colored type tiles. */
  getIcon?: FileExplorerIconResolver<TData>
  /** Accessible name of the item list. */
  label?: string
  /** Reading direction. Defaults to Reka's `ConfigProvider`, then the page. */
  dir?: 'ltr' | 'rtl'
  /** Overrides user-facing strings. */
  messages?: Partial<FileExplorerMessages>
  class?: HTMLAttributes['class']

  // Handlers: listening to one enables its action. Any of them may return a
  // promise, which the explorer tracks as an operation.

  /**
   * Called with picked or dropped files and the destination folder. Providing it
   * shows the Upload button and the drop tile, and accepts files dropped from the desktop.
   */
  onUpload?: (files: File[], folder: FileExplorerItem<TData> | null, context: FileExplorerUploadContext<TData>) => FileExplorerHandlerResult<TData>
  /** Called by New folder. Return `{ rename: id }` to put the new folder in rename mode. */
  onCreateFolder?: (parent: FileExplorerItem<TData> | null, context: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Called by New file. */
  onCreateFile?: (parent: FileExplorerItem<TData> | null, context: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Called with the new name after an inline rename (F2 or the context menu). Enables renaming. */
  onRename?: (item: FileExplorerItem<TData>, name: string, context: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Extra checks for new names. Empty names and duplicates in the same folder are always refused. */
  validateName?: FileExplorerNameValidator<TData>
  /** Called with the items to delete, after confirmation. */
  onDelete?: (items: FileExplorerItem<TData>[], context: FileExplorerOperationContext<TData>) => FileExplorerHandlerResult<TData>
  /** Asks for confirmation in a dialog before deleting. */
  confirmDelete?: boolean
  /** Items were dropped on a folder, or on a breadcrumb (`target: null` is the root). */
  onMove?: Handler<FileExplorerMoveEvent<TData>, TData>
  /** Items from the clipboard were pasted. Enables Copy, Cut and Paste. */
  onPaste?: Handler<FileExplorerPasteEvent<TData>, TData>
  onDuplicate?: Handler<FileExplorerItemsEvent<TData>, TData>
  onDownload?: Handler<FileExplorerDownloadEvent<TData>, TData>
  /** Quick look (Space), distinct from opening. */
  onPreview?: Handler<FileExplorerPreviewEvent<TData>, TData>
  onRefresh?: Handler<FileExplorerFolderEvent<TData>, TData>
  onProperties?: Handler<FileExplorerItemsEvent<TData>, TData>
  onShare?: Handler<FileExplorerItemsEvent<TData>, TData>
  onCopyLink?: Handler<FileExplorerItemsEvent<TData>, TData>
  onTrash?: Handler<FileExplorerItemsEvent<TData>, TData>
  onRestore?: Handler<FileExplorerItemsEvent<TData>, TData>
  onDeletePermanently?: Handler<FileExplorerItemsEvent<TData>, TData>
  onEmptyTrash?: Handler<FileExplorerFolderEvent<TData>, TData>
  onFavorite?: Handler<FileExplorerItemsEvent<TData>, TData>
  onUnfavorite?: Handler<FileExplorerItemsEvent<TData>, TData>
  /** Loads a folder whose `children` is `undefined` when it is opened or expanded. */
  onLoadChildren?: (folder: FileExplorerItem<TData>, context: FileExplorerOperationContext<TData>) => unknown
  /** Loads the next page of a folder (or listing) with `hasMore`. */
  onLoadMore?: Handler<FileExplorerLoadMoreEvent<TData>, TData>
  /** With `remoteSearch`: runs the query; show the results through `listing`. */
  onSearch?: Handler<FileExplorerSearchEvent<TData>, TData>
}

export interface FileExplorerEmits<TData = unknown> {
  'update:folder': [id: string | null]
  'update:selected': [value: string[]]
  'update:view': [value: FileExplorerView]
  'update:search': [value: string]
  'update:sort': [value: FileExplorerSort]
  'update:clipboard': [value: FileExplorerClipboard<TData> | null]
  'update:location': [value: string | null]
  /** A file was opened with a double-click, Enter or the status bar. */
  open: [item: FileExplorerItem<TData>]
  /** Items were put on the clipboard. */
  copy: [event: FileExplorerCopyEvent<TData>]
  cut: [event: FileExplorerItemsEvent<TData>]
  /** Cancel was pressed on one of your `operations`. The explorer cancels its own. */
  'cancel-operation': [operation: FileExplorerOperationState]
  /** Retry was pressed on one of your `operations`. The explorer retries its own. */
  'retry-operation': [operation: FileExplorerOperationState]
  'dismiss-operation': [operation: FileExplorerOperationState]
  /** One of the explorer's operations failed. */
  'operation-error': [operation: FileExplorerOperationState]
}

export interface FileExplorerMenuSlotProps<TData = unknown> extends FileExplorerContextMenuSlotProps<TData> {
  /** The actions available for `item` (or the empty area), in menu order. */
  actions: FileExplorerAction[]
}

export interface FileExplorerSlots<TData = unknown> {
  /** Replaces the preview area of a card. */
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
  /** Replaces the built-in context menu for items, the empty area and the directory tree. */
  'context-menu'?: (props: FileExplorerMenuSlotProps<TData>) => unknown
  /** Body of the delete confirmation dialog. */
  'delete-description'?: (props: { items: FileExplorerItem<TData>[] }) => unknown
  empty?: (props: { query: string }) => unknown
  /** A details view cell. Built-in cells render when the slot renders nothing for them. */
  cell?: (props: { item: FileExplorerItem<TData>, column: FileExplorerColumn<TData> }) => unknown
  /** Extra toolbar buttons, before the built-in actions. */
  'toolbar-actions'?: (props: Record<string, never>) => unknown
  /** Actions at the end of the status bar. Defaults to Open, Preview and Download. */
  'status-actions'?: (props: { items: FileExplorerItem<TData>[], actions: FileExplorerAction[] }) => unknown
}
