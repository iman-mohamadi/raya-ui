import type { Component, HTMLAttributes } from 'vue'
import type { FileManagerMessages } from './messages'

export type FileManagerItemType = 'file' | 'folder'

/**
 * What the user may do with an item. Every flag defaults to `true`; set one to
 * `false` to hide or disable the matching actions. For folders, `write` governs
 * creating, uploading, pasting and dropping into them.
 *
 * This only shapes the UI — enforce permissions on your server as well.
 */
export interface FileManagerPermissions {
  read?: boolean
  write?: boolean
  delete?: boolean
  rename?: boolean
  move?: boolean
  copy?: boolean
  download?: boolean
  share?: boolean
}

export type FileManagerPermission = keyof FileManagerPermissions

/**
 * A node in the tree. Folders hold their children; files never need `children`.
 *
 * `TData` types the optional `data` field, so application metadata travels with
 * the node and comes back fully typed in slots and events.
 */
export interface FileManagerItem<TData = unknown> {
  /** Stable, unique identifier. Selection, expansion and rendering keys all use it — never the name. */
  id: string
  name: string
  type: FileManagerItemType
  /**
   * A folder's contents. Omit it or pass `[]` for an empty folder. Ignored on files.
   * With `onLoadChildren`, `undefined` means "not loaded yet".
   */
  children?: FileManagerItem<TData>[]
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
  /** Subtitle on file manager cards. Defaults to the file type, e.g. "Vue component". */
  description?: string
  /** A few lines of text shown on the file manager card, e.g. the start of a source file. */
  preview?: string
  /** Image URL shown on the file manager card instead of `preview`. */
  thumbnail?: string
  permissions?: FileManagerPermissions
  /** The item is in the trash: it offers Restore and Delete permanently instead. */
  trashed?: boolean
  disabled?: boolean
  /** Arbitrary application data. */
  data?: TData
}

/** Interaction state of a rendered item, passed to slots and the icon resolver. */
export interface FileManagerItemState {
  /** Zero-based nesting depth. Root items are `0`. */
  depth: number
  expanded: boolean
  selected: boolean
  disabled: boolean
}

export type FileManagerIconResolver<TData = unknown> = (
  item: FileManagerItem<TData>,
  state: FileManagerItemState,
) => Component | undefined

export type FileTreeSize = 'sm' | 'md'

export type FileManagerFileCategory =
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

export type FileManagerOperation =
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

export type FileManagerOperationStatus = 'pending' | 'running' | 'success' | 'error' | 'canceled'

/**
 * A long-running operation shown in the file manager's operations panel and on the
 * items it affects. The file manager creates these for handlers that return a
 * promise; you can also pass your own through the `operations` prop.
 */
export interface FileManagerOperationState {
  id: string
  type: FileManagerOperation
  status: FileManagerOperationStatus
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

export interface FileManagerOperationFailure<TData = unknown> {
  source: FileManagerItem<TData> | File
  error: string
}

/** What a handler may return (or resolve to) to steer the UI afterwards. */
export interface FileManagerOperationResult<TData = unknown> {
  /** Ids to select and focus once they appear in `items`, e.g. a created folder. */
  select?: string[]
  /** Id to start renaming once it appears in `items`, e.g. "New folder". */
  rename?: string
  /** Offers Undo (and Ctrl/Cmd+Z). What it returns can itself carry an `undo`, which becomes Redo. */
  undo?: () => FileManagerHandlerResult<TData>
  /** Success message, e.g. "Moved 3 items to Archive". */
  message?: string
  /** Partial failure: these sources failed. Retry runs the handler again with only them. */
  failed?: FileManagerOperationFailure<TData>[]
}

export type FileManagerHandlerResult<TData = unknown> =
  | void
  | FileManagerOperationResult<TData>
  | Promise<void | FileManagerOperationResult<TData>>

/** Passed as the last argument to every handler. */
export interface FileManagerOperationContext<TData = unknown> {
  /** Aborted when the user cancels the operation. */
  signal: AbortSignal
  /** Reports progress (0–100) to the operations panel. */
  progress: (percent: number) => void
  /** Asks the user how to resolve conflicts your server reported. `null` means cancel. */
  resolveConflicts: (conflicts: FileManagerConflict<TData>[]) => Promise<FileManagerConflictResolution<TData>[] | null>
}

// --- Conflicts --------------------------------------------------------------------

/** `into-itself`: a folder pasted into itself or one of its own subfolders. */
export type FileManagerConflictReason = 'exists' | 'invalid-name' | 'permission' | 'into-itself' | 'unknown'

export interface FileManagerConflict<TData = unknown> {
  /** Name of the incoming item. */
  name: string
  /** The item being copied or moved, or the file being uploaded. */
  source: FileManagerItem<TData> | File
  /** The existing item it collides with. */
  destination: FileManagerItem<TData> | null
  /** The folder receiving it, `null` for the root. */
  target: FileManagerItem<TData> | null
  reason: FileManagerConflictReason
  /** Shown instead of the default explanation. */
  message?: string
}

export type FileManagerConflictAction = 'replace' | 'keep-both' | 'skip'

export interface FileManagerConflictResolution<TData = unknown> {
  conflict: FileManagerConflict<TData>
  action: FileManagerConflictAction
  /** For `keep-both`: a free name, e.g. "report (1).pdf". */
  name?: string
}

// --- Events -----------------------------------------------------------------------

export interface FileManagerSelectEvent<TData = unknown> {
  /** The item the user interacted with. */
  item: FileManagerItem<TData>
  /** The full selection after the interaction. */
  selected: string[]
  originalEvent: Event
}

export interface FileManagerMoveEvent<TData = unknown> {
  /** The dragged items. Items nested inside another dragged folder are left out. */
  items: FileManagerItem<TData>[]
  /** The destination folder, or `null` for the root. */
  target: FileManagerItem<TData> | null
  /** How name clashes in `target` were resolved. Skipped items are not in `items`. */
  conflicts?: FileManagerConflictResolution<TData>[]
}

/** Payload of actions on a set of items: download, duplicate, share, trash, … */
export interface FileManagerItemsEvent<TData = unknown> {
  items: FileManagerItem<TData>[]
}

export type FileManagerDownloadEvent<TData = unknown> = FileManagerItemsEvent<TData>
export type FileManagerDeleteEvent<TData = unknown> = FileManagerItemsEvent<TData>
export type FileManagerCopyEvent<TData = unknown> = FileManagerItemsEvent<TData>

export type FileManagerClipboardOperation = 'copy' | 'cut'

export interface FileManagerClipboard<TData = unknown> {
  operation: FileManagerClipboardOperation
  items: FileManagerItem<TData>[]
}

export interface FileManagerPasteEvent<TData = unknown> {
  items: FileManagerItem<TData>[]
  /** The destination folder, or `null` for the root. */
  target: FileManagerItem<TData> | null
  operation: FileManagerClipboardOperation
  /** How name clashes were resolved. Skipped items are not in `items`. */
  conflicts: FileManagerConflictResolution<TData>[]
}

export interface FileManagerPreviewEvent<TData = unknown> {
  item: FileManagerItem<TData>
}

export interface FileManagerFolderEvent<TData = unknown> {
  /** The folder, `null` for the root. */
  folder: FileManagerItem<TData> | null
}

export interface FileManagerLoadMoreEvent<TData = unknown> extends FileManagerFolderEvent<TData> {
  /** The folder's `cursor`, or the listing's. */
  cursor: unknown
}

export interface FileManagerSearchEvent<TData = unknown> extends FileManagerFolderEvent<TData> {
  /** Trimmed query. Empty when the search was cleared. */
  query: string
}

export interface FileManagerUploadContext<TData = unknown> extends FileManagerOperationContext<TData> {
  /** Path of each file relative to the dropped or picked folder, `''` for loose files. Same order as `files`. */
  relativePaths: string[]
  /** How name clashes in the destination were resolved. Skipped files are not in `files`. */
  conflicts: FileManagerConflictResolution<TData>[]
}

// --- Slots --------------------------------------------------------------------------

export interface FileManagerItemSlotProps<TData = unknown> extends FileManagerItemState {
  item: FileManagerItem<TData>
}

export interface FileManagerLabelSlotProps<TData = unknown> extends FileManagerItemSlotProps<TData> {
  /** The active search query, trimmed. Empty when not searching. */
  query: string
}

export interface FileTreeNodeSlots<TData = unknown> {
  /** Replaces the icon and label of every item. The chevron, indentation and row stay in place. */
  item?: (props: FileManagerItemSlotProps<TData>) => unknown
  icon?: (props: FileManagerItemSlotProps<TData>) => unknown
  label?: (props: FileManagerLabelSlotProps<TData>) => unknown
  /** Trailing content, pushed to the end of the row. */
  actions?: (props: FileManagerItemSlotProps<TData>) => unknown
}

/** Scope of the `#context-menu` slot of `FileTree` and `FileManager`. */
export interface FileManagerContextMenuSlotProps<TData = unknown> {
  /** The item that was right-clicked, or `null` for the empty area. */
  item: FileManagerItem<TData> | null
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
export type FileManagerNameValidator<TData = unknown> = (name: string, item: FileManagerItem<TData>) => string | undefined

export interface FileTreeSlots<TData = unknown> extends FileTreeNodeSlots<TData> {
  /** Menu entries shown on right-click. `item` is `null` when the empty area was clicked. */
  'context-menu'?: (props: FileManagerContextMenuSlotProps<TData>) => unknown
  empty?: (props: { query: string }) => unknown
  loading?: (props: Record<string, never>) => unknown
  /** Body of the delete confirmation dialog. */
  'delete-description'?: (props: { items: FileManagerItem<TData>[] }) => unknown
}

export interface FileTreeProps<TData = unknown> {
  items?: FileManagerItem<TData>[]
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
  getIcon?: FileManagerIconResolver<TData>
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
  messages?: Partial<FileManagerMessages>
  /** Called with the new name after an inline rename (F2 or the context menu). Enables renaming. */
  onRename?: (item: FileManagerItem<TData>, name: string, context?: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Extra checks for new names. Empty names and duplicates in the same folder are always refused. */
  validateName?: FileManagerNameValidator<TData>
  /** Called with the selection on Delete, or from the context menu. Enables deleting. */
  onDelete?: (items: FileManagerItem<TData>[], context?: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Asks for confirmation in a dialog before calling `onDelete`. */
  confirmDelete?: boolean
  /**
   * Loads a folder whose `children` is `undefined` when it is expanded. Update
   * `items` with the children; a rejected promise shows an error with Retry.
   */
  onLoadChildren?: (folder: FileManagerItem<TData>, context: FileManagerOperationContext<TData>) => unknown
  class?: HTMLAttributes['class']
}

export interface FileTreeEmits<TData = unknown> {
  'update:selected': [value: string[]]
  'update:expanded': [value: string[]]
  'update:search': [value: string]
  /** The user selected an item with the pointer or keyboard. */
  select: [event: FileManagerSelectEvent<TData>]
  /** A file was activated with Enter or a double-click. */
  open: [item: FileManagerItem<TData>]
  /** Items were dropped on a folder (or the root). Only with `draggable`. */
  move: [event: FileManagerMoveEvent<TData>]
}

// --- FileManager ---------------------------------------------------------------

export type FileManagerView = 'grid' | 'list'

export type FileManagerColumnKey = 'name' | 'modified' | 'created' | 'accessed' | 'type' | 'size' | 'owner' | 'permissions'
/** A built-in column key, or the `key` of a custom column. */
export type FileManagerSortKey = FileManagerColumnKey | (string & {})

export interface FileManagerSort {
  key: FileManagerSortKey
  direction: 'asc' | 'desc'
}

/** A column of the details view. Built-in keys only need `key`. */
export interface FileManagerColumn<TData = unknown> {
  key: FileManagerSortKey
  label?: string
  /** CSS grid track, e.g. `"8rem"` or `"minmax(0, 1fr)"`. */
  width?: string
  align?: 'start' | 'end'
  /** Defaults to `true` when the column has a value to sort by. */
  sortable?: boolean
  /** Value to sort by (and to display, unless `format` is given). */
  value?: (item: FileManagerItem<TData>) => string | number | Date | undefined
  format?: (item: FileManagerItem<TData>) => string
  /** Keep the column on narrow file managers. Name and size always stay. */
  pinned?: boolean
}

/** A line in the command palette (`command-palette`): an action, or a place to go. */
export interface FileManagerCommand {
  id: string
  label: string
  /** Secondary text, e.g. a folder's path. */
  hint?: string
  icon?: Component
  shortcut?: string
  group: 'actions' | 'go'
  destructive?: boolean
  run: () => void
}

/** A flat set of items shown instead of the open folder: search results, Recent, Starred, Trash… */
export interface FileManagerListing<TData = unknown> {
  items: FileManagerItem<TData>[]
  /** Shown in place of the breadcrumbs. Defaults to the active location's label. */
  label?: string
  hasMore?: boolean
  cursor?: unknown
  /** The listing is the trash: offers Empty trash. */
  trash?: boolean
}

/** An entry in the sidebar, above the directory tree. */
export interface FileManagerLocation {
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

export interface FileManagerLocationSection {
  id?: string
  label?: string
  locations: FileManagerLocation[]
}

export type FileManagerActionId =
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
export interface FileManagerAction {
  id: FileManagerActionId
  label: string
  icon: Component
  /** Display form of the keyboard shortcut, e.g. "⌘C" or "Ctrl+C". */
  shortcut?: string
  group: 'open' | 'new' | 'clipboard' | 'organize' | 'share' | 'trash' | 'info'
  destructive?: boolean
  disabled: boolean
  run: () => void
}

type Handler<TEvent, TData> = (event: TEvent, context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>

export interface FileManagerProps<TData = unknown> {
  items?: FileManagerItem<TData>[]
  /** Id of the open folder, `null` for the root. Bind with `v-model:folder`. */
  folder?: string | null
  defaultFolder?: string | null
  /** Selected ids in the open folder. Bind with `v-model:selected`. */
  selected?: string[]
  defaultSelected?: string[]
  /** Bind with `v-model:view`. */
  view?: FileManagerView
  defaultView?: FileManagerView
  /** Filters the open folder by name. Bind with `v-model:search`. */
  search?: string
  /** Bind with `v-model:sort`. Folders always come first. */
  sort?: FileManagerSort
  /** Initial sort when `sort` is not bound. Defaults to name, ascending. */
  defaultSort?: FileManagerSort
  /** Copied or cut items. Bind with `v-model:clipboard` to share it between file managers. */
  clipboard?: FileManagerClipboard<TData> | null
  /** Active sidebar location without a folder. Bind with `v-model:location`. */
  location?: string | null
  /** Items shown instead of the open folder (search results, Recent, Trash…). */
  listing?: FileManagerListing<TData> | null
  /** Sidebar sections above the directory tree. */
  locations?: FileManagerLocationSection[]
  /** Your own operations (e.g. per-file upload progress), shown next to the file manager's. */
  operations?: FileManagerOperationState[]
  /**
   * Details view columns. Defaults to name, modified, type and size. `v-model:columns`
   * receives the new list when a column is resized or moved.
   */
  columns?: (FileManagerColumnKey | FileManagerColumn<TData>)[]
  /**
   * A command palette on Ctrl/Cmd+K (while focus is in the file manager): the
   * selection's actions and every loaded folder and location, searchable.
   * Off by default, since apps often own Ctrl/Cmd+K.
   */
  commandPalette?: boolean
  /** Columns can be resized by dragging (or with the keyboard on) their edge. Default `true`. */
  resizableColumns?: boolean
  /** Columns other than the name can be dragged (or moved with Alt+Shift+Arrow). Default `true`. */
  reorderableColumns?: boolean
  /** Starred item ids. */
  favorites?: string[]
  /** Ctrl/Cmd-click, Shift-click, Shift+Arrow and Ctrl/Cmd+A. */
  multiple?: boolean
  /** Drag items onto folders, the directory tree or the breadcrumbs. Listen to `move`. */
  draggable?: boolean
  /** Shows the directory tree when the file manager is wide enough. */
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
  getIcon?: FileManagerIconResolver<TData>
  /** Accessible name of the item list. */
  label?: string
  /** Reading direction. Defaults to Reka's `ConfigProvider`, then the page. */
  dir?: 'ltr' | 'rtl'
  /** Overrides user-facing strings. */
  messages?: Partial<FileManagerMessages>
  class?: HTMLAttributes['class']

  // Handlers: listening to one enables its action. Any of them may return a
  // promise, which the file manager tracks as an operation.

  /**
   * Called with picked or dropped files and the destination folder. Providing it
   * shows the Upload button and the drop tile, and accepts files dropped from the desktop.
   */
  onUpload?: (files: File[], folder: FileManagerItem<TData> | null, context: FileManagerUploadContext<TData>) => FileManagerHandlerResult<TData>
  /** Called by New folder. Return `{ rename: id }` to put the new folder in rename mode. */
  onCreateFolder?: (parent: FileManagerItem<TData> | null, context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Called by New file. */
  onCreateFile?: (parent: FileManagerItem<TData> | null, context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Called with the new name after an inline rename (F2 or the context menu). Enables renaming. */
  onRename?: (item: FileManagerItem<TData>, name: string, context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Extra checks for new names. Empty names and duplicates in the same folder are always refused. */
  validateName?: FileManagerNameValidator<TData>
  /** Called with the items to delete, after confirmation. */
  onDelete?: (items: FileManagerItem<TData>[], context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData>
  /** Asks for confirmation in a dialog before deleting. */
  confirmDelete?: boolean
  /** Items were dropped on a folder, or on a breadcrumb (`target: null` is the root). */
  onMove?: Handler<FileManagerMoveEvent<TData>, TData>
  /** Items from the clipboard were pasted. Enables Copy, Cut and Paste. */
  onPaste?: Handler<FileManagerPasteEvent<TData>, TData>
  onDuplicate?: Handler<FileManagerItemsEvent<TData>, TData>
  onDownload?: Handler<FileManagerDownloadEvent<TData>, TData>
  /** Quick look (Space), distinct from opening. */
  onPreview?: Handler<FileManagerPreviewEvent<TData>, TData>
  onRefresh?: Handler<FileManagerFolderEvent<TData>, TData>
  onProperties?: Handler<FileManagerItemsEvent<TData>, TData>
  onShare?: Handler<FileManagerItemsEvent<TData>, TData>
  onCopyLink?: Handler<FileManagerItemsEvent<TData>, TData>
  onTrash?: Handler<FileManagerItemsEvent<TData>, TData>
  onRestore?: Handler<FileManagerItemsEvent<TData>, TData>
  onDeletePermanently?: Handler<FileManagerItemsEvent<TData>, TData>
  onEmptyTrash?: Handler<FileManagerFolderEvent<TData>, TData>
  onFavorite?: Handler<FileManagerItemsEvent<TData>, TData>
  onUnfavorite?: Handler<FileManagerItemsEvent<TData>, TData>
  /** Loads a folder whose `children` is `undefined` when it is opened or expanded. */
  onLoadChildren?: (folder: FileManagerItem<TData>, context: FileManagerOperationContext<TData>) => unknown
  /** Loads the next page of a folder (or listing) with `hasMore`. */
  onLoadMore?: Handler<FileManagerLoadMoreEvent<TData>, TData>
  /** With `remoteSearch`: runs the query; show the results through `listing`. */
  onSearch?: Handler<FileManagerSearchEvent<TData>, TData>
}

export interface FileManagerEmits<TData = unknown> {
  'update:folder': [id: string | null]
  'update:selected': [value: string[]]
  'update:view': [value: FileManagerView]
  'update:search': [value: string]
  'update:sort': [value: FileManagerSort]
  /** A column was resized or moved. */
  'update:columns': [value: FileManagerColumn<TData>[]]
  'update:clipboard': [value: FileManagerClipboard<TData> | null]
  'update:location': [value: string | null]
  /** A file was opened with a double-click, Enter or the status bar. */
  open: [item: FileManagerItem<TData>]
  /** Items were put on the clipboard. */
  copy: [event: FileManagerCopyEvent<TData>]
  cut: [event: FileManagerItemsEvent<TData>]
  /** Cancel was pressed on one of your `operations`. The file manager cancels its own. */
  'cancel-operation': [operation: FileManagerOperationState]
  /** Retry was pressed on one of your `operations`. The file manager retries its own. */
  'retry-operation': [operation: FileManagerOperationState]
  'dismiss-operation': [operation: FileManagerOperationState]
  /** One of the file manager's operations failed. */
  'operation-error': [operation: FileManagerOperationState]
}

export interface FileManagerMenuSlotProps<TData = unknown> extends FileManagerContextMenuSlotProps<TData> {
  /** The actions available for `item` (or the empty area), in menu order. */
  actions: FileManagerAction[]
}

export interface FileManagerSlots<TData = unknown> {
  /** Replaces the preview area of a card. */
  preview?: (props: { item: FileManagerItem<TData> }) => unknown
  /** Replaces the built-in context menu for items, the empty area and the directory tree. */
  'context-menu'?: (props: FileManagerMenuSlotProps<TData>) => unknown
  /** Body of the delete confirmation dialog. */
  'delete-description'?: (props: { items: FileManagerItem<TData>[] }) => unknown
  empty?: (props: { query: string }) => unknown
  /** A details view cell. Built-in cells render when the slot renders nothing for them. */
  cell?: (props: { item: FileManagerItem<TData>, column: FileManagerColumn<TData> }) => unknown
  /** Extra toolbar buttons, before the built-in actions. */
  'toolbar-actions'?: (props: Record<string, never>) => unknown
  /** Actions at the end of the status bar. Defaults to Open, Preview and Download. */
  'status-actions'?: (props: { items: FileManagerItem<TData>[], actions: FileManagerAction[] }) => unknown
}
