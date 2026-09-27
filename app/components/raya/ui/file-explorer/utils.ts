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
import type { FileExplorerItem, FileExplorerItemState } from './types'

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
