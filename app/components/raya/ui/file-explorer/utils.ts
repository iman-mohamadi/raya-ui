import type { Component } from 'vue'
import {
  AppWindow,
  Box,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileCog,
  FileImage,
  FileJson,
  FileLock,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  FileType,
  FileVideo,
  Folder,
  FolderOpen,
  Presentation,
} from 'lucide-vue-next'
import { defaultFileExplorerMessages, type FileExplorerMessages, type FileExplorerSizeUnit, type FileExplorerTimeUnit } from './messages'
import type {
  FileExplorerColumn,
  FileExplorerConflict,
  FileExplorerFileCategory,
  FileExplorerItem,
  FileExplorerItemState,
  FileExplorerPermission,
  FileExplorerSort,
} from './types'

export interface FileExplorerIndexEntry<TData = unknown> {
  item: FileExplorerItem<TData>
  parentId: string | null
  depth: number
}

export type FileExplorerIndex<TData = unknown> = Map<string, FileExplorerIndexEntry<TData>>

export function isFolder<TData>(item: FileExplorerItem<TData>): boolean {
  return item.type === 'folder'
}

/**
 * One pass over the tree that maps every id to its item, parent and depth.
 * Items are referenced, never copied.
 */
export function indexFileTree<TData>(items: FileExplorerItem<TData>[]): FileExplorerIndex<TData> {
  const index: FileExplorerIndex<TData> = new Map()
  const visit = (nodes: FileExplorerItem<TData>[], parentId: string | null, depth: number) => {
    for (const item of nodes) {
      index.set(item.id, { item, parentId, depth })
      if (item.children?.length) visit(item.children, item.id, depth + 1)
    }
  }
  visit(items, null, 0)
  return index
}

/**
 * A folders-only copy of the tree. Folders on the way are shallow-copied; the
 * input is untouched. Unloaded folders (`children: undefined`) stay unloaded.
 */
export function pruneFiles<TData>(items: FileExplorerItem<TData>[]): FileExplorerItem<TData>[] {
  return items.flatMap(item => (isFolder(item)
    ? [{ ...item, children: item.children === undefined ? undefined : pruneFiles(item.children) }]
    : []))
}

/** A folder whose children have not been loaded yet (only meaningful with a loader). */
export function isUnloadedFolder<TData>(item: FileExplorerItem<TData>): boolean {
  return isFolder(item) && item.children === undefined && item.hasChildren !== false
}

/**
 * Whether a tree node shows a chevron. Unloaded folders can always be opened
 * when children load on demand; in a folders-only tree, a folder without
 * subfolders is a leaf, like a desktop navigation pane.
 */
export function isExpandableFolder<TData>(item: FileExplorerItem<TData>, options: { lazy: boolean, foldersOnly: boolean }): boolean {
  if (!isFolder(item)) return false
  if (item.children === undefined) return options.lazy ? item.hasChildren !== false : !options.foldersOnly
  return !options.foldersOnly || item.children.length > 0
}

/**
 * Whether the UI may offer `permission` on `item`. Disabled items allow
 * nothing; otherwise every permission defaults to allowed.
 */
export function can<TData>(item: FileExplorerItem<TData>, permission: FileExplorerPermission): boolean {
  if (item.disabled) return false
  // Without read access there is nothing to download, copy or share.
  const needsRead = permission === 'download' || permission === 'copy' || permission === 'share'
  if (needsRead && item.permissions?.read === false) return false
  return item.permissions?.[permission] !== false
}

/** Whether `id` sits somewhere below `ancestorId`. */
export function isDescendantOf<TData>(index: FileExplorerIndex<TData>, id: string, ancestorId: string): boolean {
  let parentId = index.get(id)?.parentId ?? null
  while (parentId !== null) {
    if (parentId === ancestorId) return true
    parentId = index.get(parentId)?.parentId ?? null
  }
  return false
}

/** Ids of the items currently on screen, in the order they appear. */
export function getVisibleIds<TData>(items: FileExplorerItem<TData>[], expanded: ReadonlySet<string>): string[] {
  const ids: string[] = []
  const visit = (nodes: FileExplorerItem<TData>[]) => {
    for (const item of nodes) {
      ids.push(item.id)
      if (item.children && expanded.has(item.id)) visit(item.children)
    }
  }
  visit(items)
  return ids
}

export interface FileTreeFilterResult<TData = unknown> {
  items: FileExplorerItem<TData>[]
  /** Folders that must be open for every match to be visible. */
  revealIds: string[]
}

/**
 * Keeps the items whose name contains `query`, plus the folders leading to them.
 *
 * A folder whose own name matches is kept whole. A folder kept only for its
 * descendants is shallow-copied with a filtered `children` array; the input is
 * never mutated.
 */
export function filterFileTree<TData>(items: FileExplorerItem<TData>[], query: string): FileTreeFilterResult<TData> {
  const needle = query.trim().toLowerCase()
  if (!needle) return { items, revealIds: [] }

  const revealIds: string[] = []
  const visit = (nodes: FileExplorerItem<TData>[]): FileExplorerItem<TData>[] => {
    const kept: FileExplorerItem<TData>[] = []
    for (const item of nodes) {
      if (item.name.toLowerCase().includes(needle)) {
        kept.push(item)
        continue
      }
      if (!item.children?.length) continue
      const children = visit(item.children)
      if (children.length) {
        revealIds.push(item.id)
        kept.push({ ...item, children })
      }
    }
    return kept
  }

  return { items: visit(items), revealIds }
}

/** Splits `text` around case-insensitive occurrences of `query`, for highlighting. */
export function splitByQuery(text: string, query: string): { text: string, match: boolean }[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return [{ text, match: false }]

  const parts: { text: string, match: boolean }[] = []
  const haystack = text.toLowerCase()
  let cursor = 0
  let found = haystack.indexOf(needle)
  while (found !== -1) {
    if (found > cursor) parts.push({ text: text.slice(cursor, found), match: false })
    parts.push({ text: text.slice(found, found + needle.length), match: true })
    cursor = found + needle.length
    found = haystack.indexOf(needle, cursor)
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false })
  return parts
}

interface KindDefinition {
  category: FileExplorerFileCategory
  label: string
  /** Short text for the icon tile ("V", "TS"). Types without one show their icon. */
  badge?: string
  tone: string
  icon: Component
}

const NEUTRAL_TONE = 'bg-muted text-foreground/75'
const KIND_TABLE: [extensions: string[], definition: KindDefinition][] = [
  [['vue'], { category: 'code', label: 'Vue component', badge: 'V', tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', icon: FileCode }],
  [['ts', 'tsx', 'mts', 'cts'], { category: 'code', label: 'TypeScript', badge: 'TS', tone: 'bg-sky-500/10 text-sky-700 dark:text-sky-400', icon: FileCode }],
  [['js', 'jsx', 'mjs', 'cjs'], { category: 'code', label: 'JavaScript', badge: 'JS', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: FileCode }],
  [['json', 'jsonc', 'json5'], { category: 'code', label: 'JSON', badge: '{}', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: FileJson }],
  [['css', 'scss', 'sass', 'less'], { category: 'code', label: 'Stylesheet', badge: '#', tone: 'bg-pink-500/10 text-pink-700 dark:text-pink-400', icon: FileCode }],
  [['html', 'htm'], { category: 'code', label: 'HTML document', badge: '<>', tone: 'bg-orange-500/10 text-orange-700 dark:text-orange-400', icon: FileCode }],
  [['svelte', 'astro', 'py', 'go', 'rs', 'java', 'kt', 'swift', 'rb', 'php', 'c', 'h', 'cpp', 'cs', 'sql', 'graphql', 'xml'], { category: 'code', label: 'Source code', tone: NEUTRAL_TONE, icon: FileCode }],
  [['md', 'mdx'], { category: 'text', label: 'Markdown', badge: 'MD', tone: NEUTRAL_TONE, icon: FileText }],
  [['txt', 'log', 'rtf'], { category: 'text', label: 'Text document', tone: NEUTRAL_TONE, icon: FileText }],
  [['yml', 'yaml', 'toml', 'ini', 'env', 'conf', 'config', 'editorconfig', 'gitignore'], { category: 'text', label: 'Configuration', tone: NEUTRAL_TONE, icon: FileCog }],
  [['lock'], { category: 'text', label: 'Lock file', tone: NEUTRAL_TONE, icon: FileLock }],
  [['pdf'], { category: 'pdf', label: 'PDF document', tone: 'bg-red-500/10 text-red-700 dark:text-red-400', icon: FileText }],
  [['doc', 'docx', 'odt', 'pages'], { category: 'document', label: 'Document', tone: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', icon: FileText }],
  [['xls', 'xlsx', 'ods', 'csv', 'tsv', 'numbers'], { category: 'spreadsheet', label: 'Spreadsheet', tone: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: FileSpreadsheet }],
  [['ppt', 'pptx', 'odp', 'key'], { category: 'presentation', label: 'Presentation', tone: 'bg-orange-500/10 text-orange-700 dark:text-orange-400', icon: Presentation }],
  [['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'ico', 'bmp', 'heic', 'tif', 'tiff'], { category: 'image', label: 'image', tone: 'bg-violet-500/10 text-violet-700 dark:text-violet-400', icon: FileImage }],
  [['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'], { category: 'video', label: 'video', tone: 'bg-rose-500/10 text-rose-700 dark:text-rose-400', icon: FileVideo }],
  [['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'], { category: 'audio', label: 'audio', tone: 'bg-rose-500/10 text-rose-700 dark:text-rose-400', icon: FileAudio }],
  [['zip', 'tar', 'gz', 'tgz', 'rar', '7z', 'bz2', 'xz'], { category: 'archive', label: 'Archive', tone: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400', icon: FileArchive }],
  [['ttf', 'otf', 'woff', 'woff2'], { category: 'font', label: 'Font', tone: NEUTRAL_TONE, icon: FileType }],
  [['obj', 'fbx', 'gltf', 'glb', 'stl', 'blend', 'usdz'], { category: '3d', label: '3D model', tone: 'bg-teal-500/10 text-teal-700 dark:text-teal-400', icon: Box }],
  [['exe', 'msi', 'dmg', 'pkg', 'app', 'apk', 'deb', 'rpm', 'bat', 'cmd', 'com', 'scr', 'jar', 'vbs'], { category: 'executable', label: 'Application', tone: NEUTRAL_TONE, icon: AppWindow }],
  [['sh', 'bash', 'zsh', 'fish', 'ps1'], { category: 'executable', label: 'Shell script', tone: NEUTRAL_TONE, icon: FileTerminal }],
]
const KIND_BY_EXTENSION = new Map(KIND_TABLE.flatMap(([extensions, definition]) => extensions.map(extension => [extension, definition] as const)))

const MIME_CATEGORIES: [prefix: string, category: FileExplorerFileCategory, icon: Component][] = [
  ['image/', 'image', FileImage],
  ['video/', 'video', FileVideo],
  ['audio/', 'audio', FileAudio],
  ['font/', 'font', FileType],
  ['text/', 'text', FileText],
  ['application/pdf', 'pdf', FileText],
  ['application/zip', 'archive', FileArchive],
]

/** Lower-cased extension without the dot. `.env` resolves to `env`; `Makefile` to `''`. */
export function getFileExtension<TData>(item: FileExplorerItem<TData>): string {
  if (item.extension) return item.extension.replace(/^\./, '').toLowerCase()
  const dot = item.name.lastIndexOf('.')
  return dot === -1 ? '' : item.name.slice(dot + 1).toLowerCase()
}

export interface FileKind {
  category: FileExplorerFileCategory
  /** Human description, e.g. "Vue component" or "PNG image". */
  label: string
  /** Short text for the icon tile ("V", "TS"). Types without one show their icon. */
  badge?: string
  /** Tailwind classes tinting the icon tile. */
  tone: string
  icon: Component
}

/**
 * Describes an item for icons, cards, the details view and the status bar, from
 * its extension and then its MIME type.
 */
export function getFileKind<TData>(item: FileExplorerItem<TData>): FileKind {
  if (isFolder(item)) return { category: 'folder', label: 'Folder', tone: NEUTRAL_TONE, icon: Folder }
  const extension = getFileExtension(item)
  const definition = KIND_BY_EXTENSION.get(extension)
  if (definition) {
    // Media kinds read better with their format: "PNG image", "MP4 video".
    const label = ['image', 'video', 'audio'].includes(definition.category) ? `${extension.toUpperCase()} ${definition.label}` : definition.label
    return { ...definition, label }
  }
  const mime = item.mimeType?.toLowerCase()
  const byMime = mime ? MIME_CATEGORIES.find(([prefix]) => mime.startsWith(prefix)) : undefined
  if (byMime) return { category: byMime[1], label: mime ?? '', tone: NEUTRAL_TONE, icon: byMime[2] }
  return { category: 'unknown', label: extension ? `${extension.toUpperCase()} file` : 'File', tone: NEUTRAL_TONE, icon: File }
}

/**
 * Executables and scripts. The explorer never runs or previews content itself;
 * this only lets applications warn before opening or downloading.
 */
export function isPotentiallyUnsafe<TData>(item: FileExplorerItem<TData>): boolean {
  return getFileKind(item).category === 'executable'
}

/** The default icon resolver: open/closed folders, and a small set of generic file-type glyphs. */
export function getFileIcon<TData>(item: FileExplorerItem<TData>, state: Pick<FileExplorerItemState, 'expanded'>): Component {
  if (isFolder(item)) return state.expanded ? FolderOpen : Folder
  return getFileKind(item).icon
}

/** `1536` → `"1.5 KB"`. */
/** "4.2 KB". Pass `messages` to translate the units. */
export function formatBytes(bytes: number | undefined, messages: Pick<FileExplorerMessages, 'fileSize'> = defaultFileExplorerMessages): string {
  if (bytes === undefined || !Number.isFinite(bytes)) return ''
  const units: FileExplorerSizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return messages.fileSize(unit === 0 ? String(value) : value.toFixed(1), units[unit] ?? 'B')
}

export function toDate(value: Date | string | undefined): Date | undefined {
  if (value === undefined) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** Compact relative time: `"just now"`, `"10m ago"`, `"3d ago"`. */
/** "5m ago". Pass `messages` to translate. */
export function formatRelativeTime(
  value: Date | string | undefined,
  now: Date = new Date(),
  messages: Pick<FileExplorerMessages, 'justNow' | 'timeAgo'> = defaultFileExplorerMessages,
): string {
  const date = toDate(value)
  if (!date) return ''
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  if (seconds < 45) return messages.justNow
  const steps: [limit: number, size: number, unit: FileExplorerTimeUnit][] = [
    [60 * 60, 60, 'minute'],
    [60 * 60 * 24, 60 * 60, 'hour'],
    [60 * 60 * 24 * 7, 60 * 60 * 24, 'day'],
    [60 * 60 * 24 * 30, 60 * 60 * 24 * 7, 'week'],
    [60 * 60 * 24 * 365, 60 * 60 * 24 * 30, 'month'],
  ]
  for (const [limit, size, unit] of steps) {
    if (seconds < limit) return messages.timeAgo(Math.max(1, Math.floor(seconds / size)), unit)
  }
  return messages.timeAgo(Math.floor(seconds / (60 * 60 * 24 * 365)), 'year')
}

export type CodeTokenKind = 'keyword' | 'string' | 'tag' | 'comment' | 'plain'

const CODE_TOKEN = /(\/\/.*$)|(["'`])(?:\\.|(?!\2).)*\2|(<\/?[A-Za-z][\w.-]*|\/?>)|\b(import|export|default|from|const|let|var|function|return|async|await|if|else|new|type|interface|class|extends|true|false|null)\b/g

/** A deliberately tiny tokenizer for one-glance previews. It is not a syntax highlighter. */
export function tokenizeCode(line: string): { text: string, kind: CodeTokenKind }[] {
  const tokens: { text: string, kind: CodeTokenKind }[] = []
  let cursor = 0
  for (const match of line.matchAll(CODE_TOKEN)) {
    const start = match.index ?? 0
    if (start > cursor) tokens.push({ text: line.slice(cursor, start), kind: 'plain' })
    const kind: CodeTokenKind = match[1] ? 'comment' : match[2] ? 'string' : match[3] ? 'tag' : 'keyword'
    tokens.push({ text: match[0], kind })
    cursor = start + match[0].length
  }
  if (cursor < line.length) tokens.push({ text: line.slice(cursor), kind: 'plain' })
  return tokens
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

type SortValue = string | number | Date | undefined

function builtInValue<TData>(item: FileExplorerItem<TData>, key: string): SortValue {
  switch (key) {
    case 'modified': return toDate(item.modifiedAt)
    case 'created': return toDate(item.createdAt)
    case 'accessed': return toDate(item.accessedAt)
    case 'size': return item.size
    case 'type': return item.description ?? getFileKind(item).label
    case 'owner': return item.owner
    case 'permissions': return item.permissions?.write === false ? 0 : 1
    default: return undefined
  }
}

function compareValues(a: SortValue, b: SortValue): number {
  if (a === undefined || b === undefined) return a === b ? 0 : a === undefined ? -1 : 1
  if (a instanceof Date || b instanceof Date) return (a instanceof Date ? a.getTime() : 0) - (b instanceof Date ? b.getTime() : 0)
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

/**
 * Folders first, then by `sort`, then by name — the order every desktop file
 * manager uses. Custom column keys sort by the column's `value`.
 */
export function sortFileItems<TData>(
  items: FileExplorerItem<TData>[],
  sort: FileExplorerSort,
  columns: FileExplorerColumn<TData>[] = [],
): FileExplorerItem<TData>[] {
  const direction = sort.direction === 'asc' ? 1 : -1
  const custom = columns.find(column => column.key === sort.key)?.value
  const valueOf = (item: FileExplorerItem<TData>) => (custom ? custom(item) : builtInValue(item, sort.key))
  return [...items].sort((a, b) => {
    if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1
    const byKey = sort.key === 'name' ? 0 : compareValues(valueOf(a), valueOf(b))
    return (byKey || collator.compare(a.name, b.name)) * direction
  })
}

/** Ids from the root down to `id`, inclusive. */
export function getAncestorIds<TData>(index: FileExplorerIndex<TData>, id: string | null): string[] {
  const ids: string[] = []
  let current = id
  while (current !== null) {
    const entry = index.get(current)
    if (!entry) break
    ids.unshift(current)
    current = entry.parentId
  }
  return ids
}

/** The items directly inside `folderId` (`null` is the root). */
export function childrenOf<TData>(index: FileExplorerIndex<TData>, rootItems: FileExplorerItem<TData>[], folderId: string | null): FileExplorerItem<TData>[] {
  return folderId === null ? rootItems : index.get(folderId)?.item.children ?? []
}

/**
 * Checks a new name for `item`: not empty, no separators, and unique among its
 * siblings (case-insensitively, as on Windows and macOS). Returns an error message.
 */
export function validateItemName<TData>(
  index: FileExplorerIndex<TData>,
  rootItems: FileExplorerItem<TData>[],
  item: FileExplorerItem<TData>,
  name: string,
  messages: Pick<FileExplorerMessages, 'nameRequired' | 'nameInvalid' | 'nameExists'> = defaultFileExplorerMessages,
): string | undefined {
  const trimmed = name.trim()
  if (!trimmed) return messages.nameRequired
  if (/[\\/]/.test(trimmed)) return messages.nameInvalid
  const siblings = childrenOf(index, rootItems, index.get(item.id)?.parentId ?? null)
  const lower = trimmed.toLowerCase()
  if (siblings.some(sibling => sibling.id !== item.id && sibling.name.toLowerCase() === lower))
    return messages.nameExists(trimmed)
  return undefined
}

/** `"report.pdf"` → `"report (1).pdf"`, skipping names already taken (case-insensitively). */
export function uniqueName(name: string, taken: Iterable<string>): string {
  const used = new Set(Array.from(taken, value => value.toLowerCase()))
  if (!used.has(name.toLowerCase())) return name
  const dot = name.lastIndexOf('.')
  const [base, extension] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
  for (let n = 1; ; n++) {
    const candidate = `${base} (${n})${extension}`
    if (!used.has(candidate.toLowerCase())) return candidate
  }
}

/** Name clashes between incoming sources and the existing children of `target`. */
export function findNameConflicts<TData>(
  sources: { name: string, source: FileExplorerItem<TData> | File }[],
  existing: FileExplorerItem<TData>[],
  target: FileExplorerItem<TData> | null,
): FileExplorerConflict<TData>[] {
  const byName = new Map(existing.map(item => [item.name.toLowerCase(), item]))
  return sources.flatMap(({ name, source }) => {
    const destination = byName.get(name.toLowerCase())
    // Moving an item onto itself is not a conflict; the move is simply a no-op.
    if (!destination || ('id' in source && destination.id === source.id)) return []
    return [{ name, source, destination, target, reason: 'exists' as const }]
  })
}

/** Checks a file against an `accept` attribute value (`.pdf`, `image/*`, `text/plain`). */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept?.trim()) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean).some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

export interface DroppedFile {
  file: File
  /** Path relative to the dropped folder, e.g. `"photos/2024/a.jpg"`; `''` for loose files. */
  path: string
}

const isFileEntry = (entry: FileSystemEntry): entry is FileSystemFileEntry => entry.isFile
const isDirectoryEntry = (entry: FileSystemEntry): entry is FileSystemDirectoryEntry => entry.isDirectory

async function readEntry(entry: FileSystemEntry): Promise<DroppedFile[]> {
  if (isFileEntry(entry)) {
    const file = await new Promise<File>((resolve, reject) => entry.file(resolve, reject))
    return [{ file, path: entry.fullPath.replace(/^\//, '') }]
  }
  if (!isDirectoryEntry(entry)) return []
  const reader = entry.createReader()
  const children: FileSystemEntry[] = []
  // readEntries returns results in batches until it yields an empty one.
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject))
    if (!batch.length) break
    children.push(...batch)
  }
  return (await Promise.all(children.map(readEntry))).flat()
}

/**
 * Files from a drop, walking into dropped folders where the browser supports
 * it. Loose files get an empty `path`.
 */
export async function collectDroppedFiles(dataTransfer: DataTransfer, includeFolders: boolean): Promise<DroppedFile[]> {
  const entries = includeFolders
    ? Array.from(dataTransfer.items ?? []).flatMap((item) => {
        const entry = typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null
        return entry ? [entry] : []
      })
    : []
  if (entries.some(entry => entry.isDirectory)) {
    const files = (await Promise.all(entries.map(readEntry))).flat()
    // Loose files dropped next to folders keep an empty path.
    return files.map(({ file, path }) => ({ file, path: path.includes('/') ? path : '' }))
  }
  // Without folder support, a dropped folder shows up as an empty, typeless "file": leave it out.
  return Array.from(dataTransfer.files ?? [])
    .filter(file => file.type !== '' || file.size > 0 || file.name.includes('.'))
    .map(file => ({ file, path: '' }))
}

/**
 * Focuses an element without the browser's own scroll-into-view, which also
 * scrolls clipped (`overflow: hidden`) ancestors and can shift the host page
 * under a fixed header. Only the nearest scroll container moves, just enough to
 * show the element, honouring its `scroll-padding` (e.g. a sticky header).
 */
export function focusElement(element: HTMLElement | null | undefined) {
  if (!element) return
  element.focus({ preventScroll: true })
  let scroller = element.parentElement
  while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement
  if (!scroller) return
  const style = getComputedStyle(scroller)
  const padTop = Number.parseFloat(style.scrollPaddingTop) || 0
  const padBottom = Number.parseFloat(style.scrollPaddingBottom) || 0
  const box = element.getBoundingClientRect()
  const view = scroller.getBoundingClientRect()
  if (box.top < view.top + padTop) scroller.scrollTop -= view.top + padTop - box.top
  else if (box.bottom > view.bottom - padBottom) scroller.scrollTop += Math.min(box.bottom - view.bottom + padBottom, box.top - view.top - padTop)
}
