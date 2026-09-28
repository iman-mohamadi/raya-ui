import type { FileManagerMessages } from './messages'
import type { FileManagerColumn, FileManagerColumnKey, FileManagerItem } from './types'
import { formatBytes, formatRelativeTime, getFileExtension, getFileKind, isFolder, toDate } from './utils'

/** A details column with everything needed to render it. */
export interface ResolvedColumn<TData> {
  key: string
  label: string
  /** CSS grid track. */
  width: string
  align: 'start' | 'end'
  sortable: boolean
  /** Stays visible on narrow file managers. */
  pinned: boolean
  format: (item: FileManagerItem<TData>) => string
  title?: (item: FileManagerItem<TData>) => string | undefined
  /** The consumer's definition, for the `cell` slot. */
  source: FileManagerColumn<TData>
}

export const DEFAULT_COLUMNS: FileManagerColumnKey[] = ['name', 'modified', 'type', 'size']

type BuiltIn<TData> = Pick<ResolvedColumn<TData>, 'width' | 'format'> & Partial<Pick<ResolvedColumn<TData>, 'align' | 'title'>>

/** The kind of item ("TypeScript", "Image", "Folder"), translated. `description` is free text and is not used. */
export function describeKind<TData>(item: FileManagerItem<TData>, messages: FileManagerMessages): string {
  const kind = getFileKind(item)
  return messages.fileKind(kind.category, getFileExtension(item), kind.label)
}

function builtIns<TData>(messages: FileManagerMessages, now: () => Date): Partial<Record<string, BuiltIn<TData>>> {
  const date = (pick: (item: FileManagerItem<TData>) => Date | string | undefined): BuiltIn<TData> => ({
    width: '6.5rem',
    format: item => formatRelativeTime(pick(item), now(), messages),
    title: item => toDate(pick(item))?.toLocaleString(),
  })
  return {
    name: { width: 'minmax(0, 1fr)', format: item => item.name },
    modified: date(item => item.modifiedAt),
    created: date(item => item.createdAt),
    accessed: date(item => item.accessedAt),
    type: { width: '9rem', format: item => describeKind(item, messages) },
    size: {
      width: '5.5rem',
      align: 'end',
      format: item => (isFolder(item) ? (item.children ? messages.items(item.children.length) : '') : formatBytes(item.size, messages)),
    },
    owner: { width: '8rem', format: item => item.owner ?? '' },
    permissions: { width: '6rem', format: item => (item.permissions?.write === false ? messages.readOnly : messages.canEdit) },
  }
}

/** Normalizes the `columns` prop: strings become built-in columns, and Name is always there. */
export function columnDefinitions<TData>(columns: (FileManagerColumnKey | FileManagerColumn<TData>)[] | undefined): FileManagerColumn<TData>[] {
  const definitions = (columns ?? DEFAULT_COLUMNS).map(column => (typeof column === 'string' ? { key: column } : column))
  return definitions.some(column => column.key === 'name') ? definitions : [{ key: 'name' }, ...definitions]
}

/** The narrowest the name column may get before other columns make room for it, in rem. */
export const NAME_MIN_WIDTH = 12
/** Gap between details columns (`gap-3`), in rem. */
const COLUMN_GAP = 0.75
/** Width of the selection checkbox track, in rem. */
export const CHECK_WIDTH = '1.25rem'

/** The minimum a track needs, in rem: the first rem or px length in it (`8rem`, `minmax(6rem, 1fr)`), else 0. */
export function trackMinWidth(width: string): number {
  const match = width.match(/(\d*\.?\d+)(rem|px)/)
  if (!match) return 0
  return match[2] === 'px' ? Number(match[1]) / 16 : Number(match[1])
}

/**
 * The columns that fit in `available` rem while the name keeps `NAME_MIN_WIDTH`.
 * Unpinned columns give way from the last one backwards; pinned ones always stay.
 * An unknown width (0, before the first measurement or during SSR) keeps every column.
 */
export function fitColumns<TData>(columns: ResolvedColumn<TData>[], available: number, check: boolean): ResolvedColumn<TData>[] {
  if (available <= 0) return columns
  const needed = (list: ResolvedColumn<TData>[]) => {
    const tracks = list.length + (check ? 1 : 0)
    const widths = list.reduce((sum, column) => sum + (column.key === 'name' ? NAME_MIN_WIDTH : trackMinWidth(column.width)), 0)
    return widths + (check ? trackMinWidth(CHECK_WIDTH) : 0) + COLUMN_GAP * Math.max(0, tracks - 1)
  }
  const fitted = [...columns]
  while (needed(fitted) > available) {
    const index = fitted.findLastIndex(column => !column.pinned)
    if (index < 0) break
    fitted.splice(index, 1)
  }
  return fitted
}

/** Resolves labels, widths, formatting and sortability. `now` is read at render time. */
export function resolveColumns<TData>(
  definitions: FileManagerColumn<TData>[],
  messages: FileManagerMessages,
  now: () => Date,
): ResolvedColumn<TData>[] {
  const known = builtIns<TData>(messages, now)
  const labels: Record<string, string> = messages.columns
  return definitions.map((definition) => {
    const base = known[definition.key]
    const value = definition.value
    const fallback = (item: FileManagerItem<TData>) => {
      const raw = value?.(item)
      return raw instanceof Date ? formatRelativeTime(raw, now(), messages) : raw === undefined ? '' : String(raw)
    }
    return {
      key: definition.key,
      label: definition.label ?? labels[definition.key] ?? definition.key,
      width: definition.width ?? base?.width ?? '8rem',
      align: definition.align ?? base?.align ?? 'start',
      sortable: definition.sortable ?? (base !== undefined || value !== undefined),
      pinned: definition.pinned ?? (definition.key === 'name' || definition.key === 'size'),
      format: definition.format ?? base?.format ?? fallback,
      title: base?.title,
      source: definition,
    }
  })
}
