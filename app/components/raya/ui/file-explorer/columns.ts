import type { FileExplorerMessages } from './messages'
import type { FileExplorerColumn, FileExplorerColumnKey, FileExplorerItem } from './types'
import { formatBytes, formatRelativeTime, getFileExtension, getFileKind, isFolder, toDate } from './utils'

/** A details column with everything needed to render it. */
export interface ResolvedColumn<TData> {
  key: string
  label: string
  /** CSS grid track. */
  width: string
  align: 'start' | 'end'
  sortable: boolean
  /** Stays visible on narrow explorers. */
  pinned: boolean
  format: (item: FileExplorerItem<TData>) => string
  title?: (item: FileExplorerItem<TData>) => string | undefined
  /** The consumer's definition, for the `cell` slot. */
  source: FileExplorerColumn<TData>
}

export const DEFAULT_COLUMNS: FileExplorerColumnKey[] = ['name', 'modified', 'type', 'size']

type BuiltIn<TData> = Pick<ResolvedColumn<TData>, 'width' | 'format'> & Partial<Pick<ResolvedColumn<TData>, 'align' | 'title'>>

/** The item's type as shown to people: its description, else its file kind. */
export function describeKind<TData>(item: FileExplorerItem<TData>, messages: FileExplorerMessages): string {
  const kind = getFileKind(item)
  return item.description ?? messages.fileKind(kind.category, getFileExtension(item), kind.label)
}

function builtIns<TData>(messages: FileExplorerMessages, now: () => Date): Partial<Record<string, BuiltIn<TData>>> {
  const date = (pick: (item: FileExplorerItem<TData>) => Date | string | undefined): BuiltIn<TData> => ({
    width: '6.5rem',
    format: item => formatRelativeTime(pick(item), now()),
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
      format: item => (isFolder(item) ? (item.children ? messages.items(item.children.length) : '') : formatBytes(item.size)),
    },
    owner: { width: '8rem', format: item => item.owner ?? '' },
    permissions: { width: '6rem', format: item => (item.permissions?.write === false ? messages.readOnly : messages.canEdit) },
  }
}

/** Normalizes the `columns` prop: strings become built-in columns, and Name is always there. */
export function columnDefinitions<TData>(columns: (FileExplorerColumnKey | FileExplorerColumn<TData>)[] | undefined): FileExplorerColumn<TData>[] {
  const definitions = (columns ?? DEFAULT_COLUMNS).map(column => (typeof column === 'string' ? { key: column } : column))
  return definitions.some(column => column.key === 'name') ? definitions : [{ key: 'name' }, ...definitions]
}

/** Resolves labels, widths, formatting and sortability. `now` is read at render time. */
export function resolveColumns<TData>(
  definitions: FileExplorerColumn<TData>[],
  messages: FileExplorerMessages,
  now: () => Date,
): ResolvedColumn<TData>[] {
  const known = builtIns<TData>(messages, now)
  const labels: Record<string, string> = messages.columns
  return definitions.map((definition) => {
    const base = known[definition.key]
    const value = definition.value
    const fallback = (item: FileExplorerItem<TData>) => {
      const raw = value?.(item)
      return raw instanceof Date ? formatRelativeTime(raw, now()) : raw === undefined ? '' : String(raw)
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
