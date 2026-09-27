import type {
  FileExplorerConflict,
  FileExplorerFileCategory,
  FileExplorerItem,
  FileExplorerOperation,
  FileExplorerOperationStatus,
} from './types'

/**
 * Every user-facing string of `FileExplorer` and `FileTree`. Pass a partial
 * object through the `messages` prop to translate or reword; strings that
 * depend on counts or names are functions so plurals stay correct.
 */
export interface FileExplorerMessages {
  // Navigation
  back: string
  forward: string
  up: string
  folderPath: string
  hiddenFolders: string
  toggleSidebar: string
  // Toolbar
  filterPlaceholder: string
  searchPlaceholder: string
  clearFilter: string
  view: string
  gridView: string
  listView: string
  sort: string
  sortBy: (column: string) => string
  ascending: string
  descending: string
  new: string
  // Actions
  open: string
  preview: string
  download: string
  newFolder: string
  newFile: string
  upload: string
  uploadFolder: string
  cut: string
  copy: string
  paste: string
  duplicate: string
  rename: string
  moveToTrash: string
  delete: string
  restore: string
  deletePermanently: string
  emptyTrash: string
  share: string
  copyLink: string
  addToStarred: string
  removeFromStarred: string
  properties: string
  refresh: string
  retry: string
  dismiss: string
  cancel: string
  undo: string
  // Sidebar
  directoryTree: string
  folders: string
  // Details view
  columns: Record<'name' | 'modified' | 'created' | 'accessed' | 'type' | 'size' | 'owner' | 'permissions', string>
  readOnly: string
  canEdit: string
  starred: string
  // Counts and states
  items: (count: number) => string
  itemsSelected: (count: number) => string
  sizeSelected: (size: string) => string
  folder: string
  fileKind: (category: FileExplorerFileCategory, extension: string, label: string) => string
  emptyFolder: string
  emptyFolderHint: string
  noMatches: (query: string) => string
  noFiles: string
  noResults: (query: string) => string
  loading: string
  loadFailed: string
  searching: string
  searchFailed: string
  loadMore: string
  dropFiles: string
  dropFilesHint: string
  dropToUpload: (folder: string) => string
  cannotDropHere: string
  // Rename
  newName: string
  nameRequired: string
  nameInvalid: string
  nameExists: (name: string) => string
  // Confirmations
  deleteTitle: (items: FileExplorerItem<unknown>[]) => string
  deleteDescription: (items: FileExplorerItem<unknown>[]) => string
  deletePermanentlyTitle: (items: FileExplorerItem<unknown>[]) => string
  deletePermanentlyDescription: (items: FileExplorerItem<unknown>[]) => string
  emptyTrashTitle: string
  emptyTrashDescription: string
  // Conflicts
  conflictTitle: (conflict: FileExplorerConflict<unknown>) => string
  conflictDescription: (conflict: FileExplorerConflict<unknown>, targetName: string) => string
  conflictIncoming: string
  conflictExisting: string
  replace: string
  keepBoth: string
  skip: string
  applyToAll: (count: number) => string
  // Operations
  operations: string
  operationLabel: (type: FileExplorerOperation, status: FileExplorerOperationStatus, count: number) => string
  partialFailure: (failed: number, total: number) => string
  filesRejected: (count: number) => string
  fileTooLarge: (name: string, maxSize: string) => string
  fileNotAccepted: (name: string) => string
  moreOperations: (count: number) => string
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

const VERBS: Record<FileExplorerOperation, [running: string, done: string, failed: string]> = {
  upload: ['Uploading', 'Uploaded', 'upload'],
  download: ['Preparing download of', 'Downloaded', 'download'],
  create: ['Creating', 'Created', 'create'],
  rename: ['Renaming', 'Renamed', 'rename'],
  delete: ['Deleting', 'Deleted', 'delete'],
  trash: ['Moving to trash', 'Moved to trash', 'move to trash'],
  restore: ['Restoring', 'Restored', 'restore'],
  move: ['Moving', 'Moved', 'move'],
  copy: ['Copying', 'Copied', 'copy'],
  duplicate: ['Duplicating', 'Duplicated', 'duplicate'],
  share: ['Sharing', 'Shared', 'share'],
  load: ['Loading', 'Loaded', 'load'],
  search: ['Searching', 'Searched', 'search'],
  refresh: ['Refreshing', 'Refreshed', 'refresh'],
  other: ['Working on', 'Done with', 'finish'],
}

const describeItems = (items: FileExplorerItem<unknown>[]) => {
  const [first] = items
  if (items.length === 1 && first) {
    if (first.type !== 'folder') return 'This file will be deleted.'
    const count = first.children?.length ?? 0
    return count ? `This folder and the ${plural(count, 'item', 'items')} in it will be deleted.` : 'This folder will be deleted.'
  }
  const folders = items.filter(item => item.type === 'folder').length
  return folders
    ? `These items will be deleted, including ${plural(folders, 'folder', 'folders')} and everything in them.`
    : 'These files will be deleted.'
}

const titleFor = (verb: string, items: FileExplorerItem<unknown>[]) => {
  const [first] = items
  return items.length === 1 && first ? `${verb} “${first.name}”?` : `${verb} ${items.length} items?`
}

export const defaultFileExplorerMessages: FileExplorerMessages = {
  back: 'Back',
  forward: 'Forward',
  up: 'Up to parent folder',
  folderPath: 'Folder path',
  hiddenFolders: 'Show hidden path',
  toggleSidebar: 'Toggle directory tree',
  filterPlaceholder: 'Filter files…',
  searchPlaceholder: 'Search files…',
  clearFilter: 'Clear filter',
  view: 'View',
  gridView: 'Grid view',
  listView: 'Details view',
  sort: 'Sort',
  sortBy: column => `Sort by ${column}`,
  ascending: 'Ascending',
  descending: 'Descending',
  new: 'New',
  open: 'Open',
  preview: 'Preview',
  download: 'Download',
  newFolder: 'New Folder',
  newFile: 'New File',
  upload: 'Upload',
  uploadFolder: 'Upload folder',
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  duplicate: 'Duplicate',
  rename: 'Rename',
  moveToTrash: 'Move to Trash',
  delete: 'Delete',
  restore: 'Restore',
  deletePermanently: 'Delete permanently',
  emptyTrash: 'Empty Trash',
  share: 'Share',
  copyLink: 'Copy link',
  addToStarred: 'Add to Starred',
  removeFromStarred: 'Remove from Starred',
  properties: 'Properties',
  refresh: 'Refresh',
  retry: 'Retry',
  dismiss: 'Dismiss',
  cancel: 'Cancel',
  undo: 'Undo',
  directoryTree: 'Directory tree',
  folders: 'Folders',
  columns: {
    name: 'Name',
    modified: 'Modified',
    created: 'Created',
    accessed: 'Accessed',
    type: 'Type',
    size: 'Size',
    owner: 'Owner',
    permissions: 'Access',
  },
  readOnly: 'Read only',
  canEdit: 'Can edit',
  starred: 'Starred',
  items: count => plural(count, 'item', 'items'),
  itemsSelected: count => `${plural(count, 'item', 'items')} selected`,
  sizeSelected: size => `${size} selected`,
  folder: 'Folder',
  fileKind: (_category, _extension, label) => label,
  emptyFolder: 'This folder is empty',
  emptyFolderHint: 'Drop files here to upload',
  noMatches: query => `No items match “${query}”`,
  noFiles: 'No files',
  noResults: query => `No results for “${query}”`,
  loading: 'Loading…',
  loadFailed: 'This folder could not be loaded.',
  searching: 'Searching…',
  searchFailed: 'The search failed.',
  loadMore: 'Load more',
  dropFiles: 'Drop files',
  dropFilesHint: 'or click to upload',
  dropToUpload: folder => `Drop to upload to ${folder}`,
  cannotDropHere: 'You cannot drop here',
  newName: 'New name',
  nameRequired: 'A name is required.',
  nameInvalid: 'Names cannot contain / or \\.',
  nameExists: name => `An item named “${name}” already exists here.`,
  deleteTitle: items => titleFor('Delete', items),
  deleteDescription: describeItems,
  deletePermanentlyTitle: items => titleFor('Permanently delete', items),
  deletePermanentlyDescription: items => `${describeItems(items).replace('will be deleted', 'will be deleted permanently')} This cannot be undone.`,
  emptyTrashTitle: 'Empty the trash?',
  emptyTrashDescription: 'Everything in the trash will be deleted permanently. This cannot be undone.',
  conflictTitle: conflict => (conflict.reason === 'exists' ? 'Replace or skip?' : `“${conflict.name}” cannot be added`),
  conflictDescription: (conflict, targetName) => {
    if (conflict.message) return conflict.message
    switch (conflict.reason) {
      case 'exists': return `An item named “${conflict.name}” already exists in ${targetName}.`
      case 'permission': return `You do not have permission to add “${conflict.name}” to ${targetName}.`
      case 'invalid-name': return `“${conflict.name}” is not a valid name in ${targetName}.`
      default: return `“${conflict.name}” could not be added to ${targetName}.`
    }
  },
  conflictIncoming: 'Incoming',
  conflictExisting: 'Existing',
  replace: 'Replace',
  keepBoth: 'Keep both',
  skip: 'Skip',
  applyToAll: count => `Do this for the next ${plural(count, 'conflict', 'conflicts')}`,
  operations: 'Operations',
  operationLabel: (type, status, count) => {
    const [running, done, failed] = VERBS[type]
    const subject = type === 'load' || type === 'search' || type === 'refresh' ? '' : ` ${plural(count, 'item', 'items')}`
    if (status === 'error') return `Couldn’t ${failed}${subject}`
    if (status === 'canceled') return `Canceled: ${running.toLowerCase()}${subject}`
    if (status === 'success') return `${done}${subject}`
    return `${running}${subject}…`
  },
  partialFailure: (failed, total) => `${failed} of ${total} failed`,
  filesRejected: count => `${plural(count, 'file was', 'files were')} not uploaded`,
  fileTooLarge: (name, maxSize) => `${name} is larger than ${maxSize}.`,
  fileNotAccepted: name => `${name} is not an accepted file type.`,
  moreOperations: count => `+${count} more`,
}

export function resolveMessages(overrides: Partial<FileExplorerMessages> | undefined): FileExplorerMessages {
  if (!overrides) return defaultFileExplorerMessages
  return {
    ...defaultFileExplorerMessages,
    ...overrides,
    columns: { ...defaultFileExplorerMessages.columns, ...overrides.columns },
  }
}
