import type { Component } from 'vue'
import {
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
} from 'lucide-vue-next'
import type { FileExplorerItem, FileExplorerItemState, FileExplorerSort } from './types'

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

/** A folders-only copy of the tree. Folders on the way are shallow-copied; the input is untouched. */
export function pruneFiles<TData>(items: FileExplorerItem<TData>[]): FileExplorerItem<TData>[] {
  return items.flatMap(item => (isFolder(item) ? [{ ...item, children: pruneFiles(item.children ?? []) }] : []))
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

const ICONS_BY_EXTENSION: Record<string, Component> = {}
const register = (icon: Component, extensions: string[]) => {
  for (const extension of extensions) ICONS_BY_EXTENSION[extension] = icon
}
register(FileCode, ['vue', 'ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs', 'html', 'css', 'scss', 'sass', 'less', 'svelte', 'astro', 'py', 'go', 'rs', 'java', 'kt', 'swift', 'rb', 'php', 'c', 'h', 'cpp', 'cs', 'sql', 'graphql'])
register(FileJson, ['json', 'jsonc', 'json5'])
register(FileText, ['md', 'mdx', 'txt', 'rtf', 'pdf', 'doc', 'docx'])
register(FileImage, ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'ico', 'bmp'])
register(FileVideo, ['mp4', 'mov', 'webm', 'mkv', 'avi'])
register(FileAudio, ['mp3', 'wav', 'ogg', 'flac', 'm4a'])
register(FileArchive, ['zip', 'tar', 'gz', 'tgz', 'rar', '7z'])
register(FileSpreadsheet, ['csv', 'tsv', 'xls', 'xlsx'])
register(FileTerminal, ['sh', 'bash', 'zsh', 'fish', 'ps1'])
register(FileCog, ['yml', 'yaml', 'toml', 'ini', 'env', 'conf', 'config', 'editorconfig', 'gitignore'])
register(FileLock, ['lock'])
register(FileType, ['ttf', 'otf', 'woff', 'woff2'])

/** Lower-cased extension without the dot. `.env` resolves to `env`; `Makefile` to `''`. */
export function getFileExtension<TData>(item: FileExplorerItem<TData>): string {
  if (item.extension) return item.extension.replace(/^\./, '').toLowerCase()
  const dot = item.name.lastIndexOf('.')
  return dot === -1 ? '' : item.name.slice(dot + 1).toLowerCase()
}

/** The default icon resolver: open/closed folders, and a small set of generic file-type glyphs. */
export function getFileIcon<TData>(item: FileExplorerItem<TData>, state: Pick<FileExplorerItemState, 'expanded'>): Component {
  if (isFolder(item)) return state.expanded ? FolderOpen : Folder
  return ICONS_BY_EXTENSION[getFileExtension(item)] ?? File
}

// --- Explorer helpers ------------------------------------------------------------

export interface FileKind {
  /** Human description, e.g. "Vue component". */
  label: string
  /** Short text for the icon tile ("V", "TS"). Types without one show their icon. */
  badge?: string
  /** Tailwind classes tinting the icon tile. */
  tone: string
}

const NEUTRAL_TONE = 'bg-muted text-muted-foreground'
const KINDS: { extensions: string[], kind: FileKind }[] = [
  { extensions: ['vue'], kind: { label: 'Vue component', badge: 'V', tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' } },
  { extensions: ['ts', 'tsx', 'mts', 'cts'], kind: { label: 'TypeScript', badge: 'TS', tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' } },
  { extensions: ['js', 'jsx', 'mjs', 'cjs'], kind: { label: 'JavaScript', badge: 'JS', tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' } },
  { extensions: ['json', 'jsonc', 'json5'], kind: { label: 'JSON', badge: '{}', tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' } },
  { extensions: ['css', 'scss', 'sass', 'less'], kind: { label: 'Stylesheet', badge: '#', tone: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' } },
  { extensions: ['html'], kind: { label: 'HTML document', badge: '<>', tone: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' } },
  { extensions: ['md', 'mdx'], kind: { label: 'Markdown', badge: 'MD', tone: NEUTRAL_TONE } },
  { extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'ico', 'bmp'], kind: { label: 'Image', tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' } },
  { extensions: ['mp4', 'mov', 'webm', 'mkv', 'avi'], kind: { label: 'Video', tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' } },
  { extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a'], kind: { label: 'Audio', tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' } },
  { extensions: ['pdf'], kind: { label: 'PDF document', tone: 'bg-red-500/10 text-red-600 dark:text-red-400' } },
]
const KIND_BY_EXTENSION = new Map(KINDS.flatMap(({ extensions, kind }) => extensions.map(extension => [extension, kind] as const)))

/** Describes an item for cards, the details view and the status bar. */
export function getFileKind<TData>(item: FileExplorerItem<TData>): FileKind {
  if (isFolder(item)) return { label: 'Folder', tone: NEUTRAL_TONE }
  const extension = getFileExtension(item)
  const kind = KIND_BY_EXTENSION.get(extension)
  if (kind?.label === 'Image' || kind?.label === 'Video' || kind?.label === 'Audio')
    return { ...kind, label: `${extension.toUpperCase()} ${kind.label.toLowerCase()}` }
  if (kind) return kind
  if (/\.config\.[a-z]+$/i.test(item.name)) return { label: 'Configuration', tone: NEUTRAL_TONE }
  return { label: extension ? `${extension.toUpperCase()} file` : 'File', tone: NEUTRAL_TONE }
}

/** `1536` → `"1.5 KB"`. */
export function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined || !Number.isFinite(bytes)) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${units[unit]}`
}

/** Compact relative time: `"just now"`, `"10m ago"`, `"3d ago"`. */
export function formatRelativeTime(value: Date | string | undefined, now: Date = new Date()): string {
  if (value === undefined) return ''
  const date = value instanceof Date ? value : new Date(value)
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  if (Number.isNaN(seconds)) return ''
  if (seconds < 45) return 'just now'
  const steps: [limit: number, size: number, suffix: string][] = [
    [60 * 60, 60, 'm'],
    [60 * 60 * 24, 60 * 60, 'h'],
    [60 * 60 * 24 * 7, 60 * 60 * 24, 'd'],
    [60 * 60 * 24 * 30, 60 * 60 * 24 * 7, 'w'],
    [60 * 60 * 24 * 365, 60 * 60 * 24 * 30, 'mo'],
  ]
  for (const [limit, size, suffix] of steps) {
    if (seconds < limit) return `${Math.max(1, Math.floor(seconds / size))}${suffix} ago`
  }
  return `${Math.floor(seconds / (60 * 60 * 24 * 365))}y ago`
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

function timestamp(value: Date | string | undefined): number {
  if (value === undefined) return 0
  const time = (value instanceof Date ? value : new Date(value)).getTime()
  return Number.isNaN(time) ? 0 : time
}

/** Folders first, then by `sort`, then by name — the order every desktop file manager uses. */
export function sortFileItems<TData>(items: FileExplorerItem<TData>[], sort: FileExplorerSort): FileExplorerItem<TData>[] {
  const direction = sort.direction === 'asc' ? 1 : -1
  const byKey = (a: FileExplorerItem<TData>, b: FileExplorerItem<TData>): number => {
    switch (sort.key) {
      case 'modified': return timestamp(a.modifiedAt) - timestamp(b.modifiedAt)
      case 'size': return (a.size ?? 0) - (b.size ?? 0)
      case 'type': return collator.compare(getFileKind(a).label, getFileKind(b).label)
      case 'name': return 0
    }
  }
  return [...items].sort((a, b) => {
    if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1
    return (byKey(a, b) || collator.compare(a.name, b.name)) * direction
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
