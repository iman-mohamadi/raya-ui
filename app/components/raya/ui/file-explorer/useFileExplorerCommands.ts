import {
  ArchiveRestore,
  ClipboardPaste,
  Copy,
  CopyPlus,
  Download,
  ExternalLink,
  Eye,
  FilePlus,
  FolderPlus,
  FolderUp,
  Info,
  Link,
  PencilLine,
  RefreshCw,
  Scissors,
  Share2,
  Star,
  StarOff,
  Trash,
  Trash2,
  Upload,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { FileExplorerMessages } from './messages'
import type { FileExplorerAction, FileExplorerActionId, FileExplorerItem } from './types'
import { can, isFolder, isPotentiallyUnsafe } from './utils'

/** The handler props an action depends on. */
export type FileExplorerHandlerName =
  | 'onUpload' | 'onCreateFolder' | 'onCreateFile' | 'onRename' | 'onDelete' | 'onPaste' | 'onDuplicate'
  | 'onDownload' | 'onPreview' | 'onRefresh' | 'onProperties' | 'onShare' | 'onCopyLink' | 'onTrash'
  | 'onRestore' | 'onDeletePermanently' | 'onEmptyTrash' | 'onFavorite' | 'onUnfavorite'

export interface FileExplorerCommandPerformers<TData> {
  open: (item: FileExplorerItem<TData>) => void
  preview: (item: FileExplorerItem<TData>) => void
  download: (items: FileExplorerItem<TData>[]) => void
  createFolder: (parent: FileExplorerItem<TData> | null) => void
  createFile: (parent: FileExplorerItem<TData> | null) => void
  upload: (directory: boolean) => void
  cut: (items: FileExplorerItem<TData>[]) => void
  copy: (items: FileExplorerItem<TData>[]) => void
  paste: (target: FileExplorerItem<TData> | null) => void
  duplicate: (items: FileExplorerItem<TData>[]) => void
  rename: (item: FileExplorerItem<TData>) => void
  trash: (items: FileExplorerItem<TData>[]) => void
  delete: (items: FileExplorerItem<TData>[]) => void
  restore: (items: FileExplorerItem<TData>[]) => void
  deletePermanently: (items: FileExplorerItem<TData>[]) => void
  emptyTrash: () => void
  share: (items: FileExplorerItem<TData>[]) => void
  copyLink: (items: FileExplorerItem<TData>[]) => void
  favorite: (items: FileExplorerItem<TData>[]) => void
  unfavorite: (items: FileExplorerItem<TData>[]) => void
  properties: (items: FileExplorerItem<TData>[]) => void
  refresh: () => void
}

interface UseFileExplorerCommandsOptions<TData> {
  messages: () => FileExplorerMessages
  has: (handler: FileExplorerHandlerName) => boolean
  /** Hides every action that changes data. */
  readonly: () => boolean
  isMac: () => boolean
  /** The open folder (`null` is the root), or `undefined` while a listing is shown. */
  currentFolder: () => FileExplorerItem<TData> | null | undefined
  canWrite: (folder: FileExplorerItem<TData> | null) => boolean
  hasClipboard: () => boolean
  isFavorite: (id: string) => boolean
  inTrash: () => boolean
  directoryUpload: () => boolean
  /** Wraps `run` so menus can defer it until they have closed. */
  schedule: (run: () => void) => () => void
  perform: FileExplorerCommandPerformers<TData>
}

interface Shortcut {
  key: string
  mod?: boolean
  shift?: boolean
  alt?: boolean
}

const SHORTCUTS: Partial<Record<FileExplorerActionId, Shortcut[]>> = {
  'copy': [{ key: 'c', mod: true }],
  'cut': [{ key: 'x', mod: true }],
  'paste': [{ key: 'v', mod: true }],
  'duplicate': [{ key: 'd', mod: true }],
  'rename': [{ key: 'F2' }],
  'preview': [{ key: ' ' }],
  'properties': [{ key: 'Enter', alt: true }],
  'trash': [{ key: 'Delete' }, { key: 'Backspace', mod: true }],
  'delete': [{ key: 'Delete' }, { key: 'Backspace', mod: true }, { key: 'Delete', shift: true }],
  // Plain Delete too: it is what Delete means for items already in the trash.
  'delete-permanently': [{ key: 'Delete', shift: true }, { key: 'Delete' }, { key: 'Backspace', mod: true }],
}

/** Shortcut checks, most specific first: Shift+Delete must not fall through to plain Delete. */
const SHORTCUT_ORDER: FileExplorerActionId[] = ['copy', 'cut', 'paste', 'duplicate', 'rename', 'preview', 'properties', 'trash', 'delete-permanently', 'delete']

const ICONS: Record<FileExplorerActionId, Component> = {
  'open': ExternalLink,
  'preview': Eye,
  'download': Download,
  'new-folder': FolderPlus,
  'new-file': FilePlus,
  'upload': Upload,
  'upload-folder': FolderUp,
  'cut': Scissors,
  'copy': Copy,
  'paste': ClipboardPaste,
  'duplicate': CopyPlus,
  'rename': PencilLine,
  'trash': Trash2,
  'delete': Trash2,
  'restore': ArchiveRestore,
  'delete-permanently': Trash,
  'empty-trash': Trash,
  'share': Share2,
  'copy-link': Link,
  'favorite': Star,
  'unfavorite': StarOff,
  'properties': Info,
  'refresh': RefreshCw,
}

function formatKey(key: string, mac: boolean) {
  if (key === ' ') return 'Space'
  if (key === 'Enter') return mac ? '↵' : 'Enter'
  if (key === 'Delete') return mac ? '⌦' : 'Del'
  if (key === 'Backspace') return mac ? '⌫' : 'Backspace'
  return key.length === 1 ? key.toUpperCase() : key
}

function formatShortcut(shortcut: Shortcut, mac: boolean) {
  const parts = [
    shortcut.mod ? (mac ? '⌘' : 'Ctrl') : '',
    shortcut.alt ? (mac ? '⌥' : 'Alt') : '',
    shortcut.shift ? (mac ? '⇧' : 'Shift') : '',
    formatKey(shortcut.key, mac),
  ].filter(Boolean)
  return parts.join(mac ? '' : '+')
}

function matches(event: KeyboardEvent, shortcut: Shortcut) {
  const mod = event.ctrlKey || event.metaKey
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
  return key === shortcut.key
    && mod === Boolean(shortcut.mod)
    && event.shiftKey === Boolean(shortcut.shift)
    && event.altKey === Boolean(shortcut.alt)
}

/**
 * The single source of truth for what can be done: toolbar buttons, the
 * built-in context menu, keyboard shortcuts and the status bar all read it.
 * An action exists only when its handler is provided and it applies to the
 * items; it is disabled when permissions or state forbid it right now.
 */
export function useFileExplorerCommands<TData>(options: UseFileExplorerCommandsOptions<TData>) {
  const { has, perform } = options

  function shortcutLabel(id: FileExplorerActionId): string | undefined {
    const mac = options.isMac()
    const shortcuts = SHORTCUTS[id]
    if (!shortcuts?.length) return undefined
    // On a Mac, deleting is ⌘⌫; elsewhere it is the Delete key.
    const preferred = mac ? shortcuts.find(shortcut => shortcut.key === 'Backspace') ?? shortcuts[0] : shortcuts[0]
    return preferred ? formatShortcut(preferred, mac) : undefined
  }

  /** Actions for `items` (a right-click on items, or the selection), or for the empty area when `items` is empty. */
  function resolve(items: FileExplorerItem<TData>[], scope: 'items' | 'background'): FileExplorerAction[] {
    const m = options.messages()
    const readonly = options.readonly()
    const actions: FileExplorerAction[] = []
    const add = (id: FileExplorerActionId, label: string, group: FileExplorerAction['group'], enabled: boolean, run: () => void, destructive = false) => {
      actions.push({ id, label, icon: ICONS[id], shortcut: shortcutLabel(id), group, destructive, disabled: !enabled, run: options.schedule(run) })
    }

    const all = (predicate: (item: FileExplorerItem<TData>) => boolean) => items.length > 0 && items.every(predicate)
    const trashed = all(item => Boolean(item.trashed))
    const anyTrashed = items.some(item => item.trashed)
    const current = options.currentFolder()

    if (scope === 'background') {
      const target = current === undefined ? undefined : current
      const writable = target !== undefined && !readonly && options.canWrite(target)
      if (!readonly && target !== undefined) {
        if (has('onCreateFolder')) add('new-folder', m.newFolder, 'new', writable, () => perform.createFolder(target))
        if (has('onCreateFile')) add('new-file', m.newFile, 'new', writable, () => perform.createFile(target))
        if (has('onUpload')) {
          add('upload', m.upload, 'new', writable, () => perform.upload(false))
          if (options.directoryUpload()) add('upload-folder', m.uploadFolder, 'new', writable, () => perform.upload(true))
        }
        if (has('onPaste')) add('paste', m.paste, 'clipboard', writable && options.hasClipboard(), () => perform.paste(target))
      }
      if (has('onEmptyTrash') && options.inTrash() && !readonly) add('empty-trash', m.emptyTrash, 'trash', true, () => perform.emptyTrash(), true)
      if (has('onRefresh')) add('refresh', m.refresh, 'info', true, () => perform.refresh())
      return actions
    }

    if (!items.length) return actions
    const [first] = items
    const single = items.length === 1 ? first : undefined

    if (single) {
      add('open', m.open, 'open', can(single, 'read') && !single.disabled, () => perform.open(single))
      if (has('onPreview') && !isFolder(single))
        add('preview', m.preview, 'open', can(single, 'read') && !isPotentiallyUnsafe(single) && !single.trashed, () => perform.preview(single))
    }

    if (!anyTrashed && !readonly) {
      if (has('onPaste')) {
        add('cut', m.cut, 'clipboard', all(item => can(item, 'move') && can(item, 'delete')), () => perform.cut(items))
        add('copy', m.copy, 'clipboard', all(item => can(item, 'copy')), () => perform.copy(items))
        // Pasting onto a folder pastes into it.
        if (single && isFolder(single))
          add('paste', m.paste, 'clipboard', options.hasClipboard() && options.canWrite(single), () => perform.paste(single))
      }
      if (has('onDuplicate')) add('duplicate', m.duplicate, 'clipboard', all(item => can(item, 'copy')), () => perform.duplicate(items))
      if (has('onRename') && single) add('rename', m.rename, 'organize', can(single, 'rename'), () => perform.rename(single))
    }

    if (!anyTrashed) {
      const starred = all(item => options.isFavorite(item.id))
      if (starred && has('onUnfavorite')) add('unfavorite', m.removeFromStarred, 'organize', true, () => perform.unfavorite(items))
      if (!starred && has('onFavorite')) add('favorite', m.addToStarred, 'organize', items.every(item => !item.disabled), () => perform.favorite(items))
      if (has('onDownload')) add('download', m.download, 'share', all(item => can(item, 'download')), () => perform.download(items))
      if (has('onShare')) add('share', m.share, 'share', all(item => can(item, 'share')), () => perform.share(items))
      if (has('onCopyLink')) add('copy-link', m.copyLink, 'share', all(item => can(item, 'share')), () => perform.copyLink(items))
    }

    if (!readonly) {
      const deletable = all(item => can(item, 'delete'))
      if (trashed) {
        if (has('onRestore')) add('restore', m.restore, 'trash', items.every(item => !item.disabled), () => perform.restore(items))
        if (has('onDeletePermanently')) add('delete-permanently', m.deletePermanently, 'trash', deletable, () => perform.deletePermanently(items), true)
      }
      else if (!anyTrashed) {
        if (has('onTrash')) add('trash', m.moveToTrash, 'trash', deletable, () => perform.trash(items), true)
        else if (has('onDelete')) add('delete', m.delete, 'trash', deletable, () => perform.delete(items), true)
        if (has('onTrash') && has('onDelete')) {
          // Offered through Shift+Delete only, like a desktop.
          actions.push({ id: 'delete', label: m.deletePermanently, icon: ICONS.delete, shortcut: shortcutLabel('delete'), group: 'trash', destructive: true, disabled: !deletable, run: options.schedule(() => perform.delete(items)) })
        }
      }
    }

    if (has('onProperties')) add('properties', m.properties, 'info', true, () => perform.properties(items))
    return actions
  }

  /** Menu entries: the resolved actions minus the ones reachable only by keyboard. */
  function menu(items: FileExplorerItem<TData>[]): FileExplorerAction[] {
    const actions = resolve(items, items.length ? 'items' : 'background')
    const trashAndDelete = actions.some(action => action.id === 'trash')
    return actions.filter(action => !(trashAndDelete && action.id === 'delete'))
  }

  /**
   * Runs the action bound to a key combination. Paste always targets the open
   * folder, as on a desktop. Returns whether the event was handled.
   */
  function handleKeydown(event: KeyboardEvent, selection: FileExplorerItem<TData>[]): boolean {
    const candidates = [
      ...resolve(selection, 'items').filter(action => action.id !== 'paste'),
      ...resolve([], 'background').filter(action => action.id === 'paste'),
    ]
    for (const id of SHORTCUT_ORDER) {
      const shortcuts = SHORTCUTS[id] ?? []
      if (!shortcuts.some(shortcut => matches(event, shortcut))) continue
      const action = candidates.find(candidate => candidate.id === id && !candidate.disabled)
      if (!action) continue
      event.preventDefault()
      action.run()
      return true
    }
    return false
  }

  /**
   * Toolbar buttons that act on the selection stay visible but disabled when
   * nothing is selected, instead of popping in and out.
   */
  function toolbar(selection: FileExplorerItem<TData>[]): FileExplorerAction[] {
    const actions = resolve(selection, 'items')
    if (actions.some(action => action.id === 'download') || !has('onDownload')) return actions
    return [...actions, { id: 'download', label: options.messages().download, icon: ICONS.download, group: 'share', disabled: true, run: () => {} }]
  }

  return { resolve, menu, toolbar, handleKeydown, shortcutLabel }
}
