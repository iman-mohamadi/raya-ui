import { computed, onBeforeUnmount, shallowRef } from 'vue'
import type { FileManagerMessages } from './messages'
import type {
  FileManagerConflict,
  FileManagerConflictResolution,
  FileManagerHandlerResult,
  FileManagerOperation,
  FileManagerOperationContext,
  FileManagerOperationFailure,
  FileManagerOperationResult,
  FileManagerOperationState,
} from './types'

export interface RunOptions<TData> {
  type: FileManagerOperation
  /** Number of items involved, for the default labels. */
  count: number
  itemIds?: string[]
  label?: string
  cancelable?: boolean
  /** Hide from the panel while running (inline or instant actions). Errors still show. */
  silent?: boolean
  /** Offer Retry when it fails. */
  retryable?: boolean
  /** Performs the operation. Called again on retry. */
  invoke: (context: FileManagerOperationContext<TData>) => FileManagerHandlerResult<TData> | unknown
  /** Runs once the operation succeeded, synchronously or not. */
  onSuccess?: (result: FileManagerOperationResult<TData> | undefined) => void
  /** For partial failures: the same operation with only the failed sources. */
  retryWith?: (failed: FileManagerOperationFailure<TData>[]) => RunOptions<TData> | undefined
  /** Where the result's `undo` is recorded. Undoing records into `redo`. */
  history?: 'undo' | 'redo' | 'redo-kept'
}

interface HistoryEntry<TData> {
  label: string
  count: number
  run: () => FileManagerHandlerResult<TData>
  operationId?: string
}

interface Meta<TData> {
  controller: AbortController
  options: RunOptions<TData>
  retry?: RunOptions<TData>
  timer?: ReturnType<typeof setTimeout>
}

interface UseFileManagerOperationsOptions<TData> {
  messages: () => FileManagerMessages
  external: () => FileManagerOperationState[] | undefined
  resolveConflicts: (conflicts: FileManagerConflict<TData>[]) => Promise<FileManagerConflictResolution<TData>[] | null>
  onError: (operation: FileManagerOperationState) => void
  onExternal: (event: 'cancel' | 'retry' | 'dismiss', operation: FileManagerOperationState) => void
}

const SUCCESS_DISMISS = 4000
const UNDO_DISMISS = 8000
const CANCELED_DISMISS = 2500

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value && typeof value.then === 'function'
}

function isResult<TData>(value: unknown): value is FileManagerOperationResult<TData> {
  return typeof value === 'object' && value !== null
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : ''
}

/**
 * Tracks what handlers do. A handler that returns a promise becomes an
 * operation with progress, cancel (through its `AbortSignal`), retry and
 * dismiss; a rejected promise is never swallowed. Results may carry `undo`,
 * which feeds Undo and Redo — the file manager never reverses anything itself.
 */
export function useFileManagerOperations<TData>(options: UseFileManagerOperationsOptions<TData>) {
  const own = shallowRef<FileManagerOperationState[]>([])
  const meta = new Map<string, Meta<TData>>()
  const undoStack = shallowRef<HistoryEntry<TData>[]>([])
  const redoStack = shallowRef<HistoryEntry<TData>[]>([])
  let counter = 0

  const isOwn = (id: string) => meta.has(id)

  function patch(id: string, update: Partial<FileManagerOperationState>) {
    own.value = own.value.map(operation => (operation.id === id ? { ...operation, ...update } : operation))
  }

  function show(state: FileManagerOperationState) {
    own.value = own.value.some(operation => operation.id === state.id)
      ? own.value.map(operation => (operation.id === state.id ? state : operation))
      : [state, ...own.value]
  }

  function remove(id: string) {
    clearTimeout(meta.get(id)?.timer)
    meta.delete(id)
    own.value = own.value.filter(operation => operation.id !== id)
  }

  function dismissLater(id: string, delay: number) {
    const entry = meta.get(id)
    if (!entry) return
    clearTimeout(entry.timer)
    entry.timer = setTimeout(() => remove(id), delay)
  }

  function run(runOptions: RunOptions<TData>): Promise<boolean> {
    const id = `operation-${++counter}`
    const controller = new AbortController()
    const messages = options.messages()
    const labelFor = (status: FileManagerOperationState['status'], count = runOptions.count) =>
      runOptions.label ?? messages.operationLabel(runOptions.type, status, count)

    const base: FileManagerOperationState = {
      id,
      type: runOptions.type,
      status: 'running',
      label: labelFor('running'),
      itemIds: runOptions.itemIds,
      cancelable: runOptions.cancelable,
      retryable: runOptions.retryable ?? true,
    }
    meta.set(id, { controller, options: runOptions })

    let visible = false
    let progress: number | undefined
    const context: FileManagerOperationContext<TData> = {
      signal: controller.signal,
      progress: (percent) => {
        progress = Math.max(0, Math.min(100, percent))
        if (visible) patch(id, { progress })
      },
      resolveConflicts: options.resolveConflicts,
    }

    const fail = (error: unknown) => {
      const state: FileManagerOperationState = { ...base, status: 'error', label: labelFor('error'), error: errorMessage(error), cancelable: false }
      show(state)
      options.onError(state)
    }

    const finish = (value: unknown) => {
      const result = isResult<TData>(value) ? value : undefined
      runOptions.onSuccess?.(result)

      const failed = result?.failed ?? []
      if (failed.length) {
        const entry = meta.get(id)
        const retry = runOptions.retryWith?.(failed)
        if (entry) entry.retry = retry
        const [first] = failed
        const detail = [messages.partialFailure(failed.length, runOptions.count), first?.error].filter(Boolean).join(': ')
        const state: FileManagerOperationState = { ...base, status: 'error', label: labelFor('error', failed.length), error: detail, retryable: Boolean(retry), cancelable: false }
        show(state)
        options.onError(state)
        return
      }

      if (result?.undo) {
        const entry: HistoryEntry<TData> = { label: result.message ?? labelFor('success'), count: runOptions.count, run: result.undo, operationId: id }
        if (runOptions.history === 'redo') {
          // An undo whose result can be redone: Redo lives in the shortcut, not the panel.
          redoStack.value = [...redoStack.value, { ...entry, operationId: undefined }]
          remove(id)
          return
        }
        else {
          undoStack.value = [...undoStack.value, entry]
          if (runOptions.history === undefined || runOptions.history === 'undo') redoStack.value = []
        }
        show({ ...base, status: 'success', label: entry.label, progress: undefined, cancelable: false, undoable: true })
        dismissLater(id, UNDO_DISMISS)
        return
      }
      if (result?.message) {
        show({ ...base, status: 'success', label: result.message, cancelable: false })
        dismissLater(id, SUCCESS_DISMISS)
        return
      }
      remove(id)
    }

    let value: unknown
    try {
      value = runOptions.invoke(context)
    }
    catch (error) {
      fail(error)
      return Promise.resolve(false)
    }

    if (!isPromiseLike(value)) {
      finish(value)
      return Promise.resolve(true)
    }

    if (!runOptions.silent) {
      visible = true
      show({ ...base, progress })
    }

    return Promise.resolve(value).then(
      (resolved) => {
        // A canceled operation stays canceled even if the handler finished anyway.
        if (controller.signal.aborted) return false
        finish(resolved)
        return true
      },
      (error: unknown) => {
        if (controller.signal.aborted) return false
        fail(error)
        return false
      },
    )
  }

  function find(id: string) {
    return [...own.value, ...(options.external() ?? [])].find(operation => operation.id === id)
  }

  function cancel(id: string) {
    const entry = meta.get(id)
    if (!entry) {
      const operation = find(id)
      if (operation) options.onExternal('cancel', operation)
      return
    }
    entry.controller.abort()
    patch(id, { status: 'canceled', label: options.messages().operationLabel(entry.options.type, 'canceled', entry.options.count), cancelable: false })
    dismissLater(id, CANCELED_DISMISS)
  }

  function retry(id: string) {
    const entry = meta.get(id)
    if (!entry) {
      const operation = find(id)
      if (operation) options.onExternal('retry', operation)
      return
    }
    const again = entry.retry ?? entry.options
    remove(id)
    void run(again)
  }

  function dismiss(id: string) {
    if (isOwn(id)) {
      remove(id)
      return
    }
    const operation = find(id)
    if (operation) options.onExternal('dismiss', operation)
  }

  function replay(entry: HistoryEntry<TData>, history: 'redo' | 'redo-kept') {
    if (entry.operationId) remove(entry.operationId)
    return run({
      type: 'other',
      count: entry.count,
      label: `${options.messages().undo}: ${entry.label}`,
      invoke: () => entry.run(),
      history,
    })
  }

  /** Undoes the latest undoable operation, or the one with `operationId`. */
  function undo(operationId?: string) {
    const stack = undoStack.value
    const index = operationId ? stack.findIndex(entry => entry.operationId === operationId) : stack.length - 1
    const entry = stack[index]
    if (!entry) return
    undoStack.value = stack.filter((_, i) => i !== index)
    void replay(entry, 'redo')
  }

  function redo() {
    const entry = redoStack.value.at(-1)
    if (!entry) return
    redoStack.value = redoStack.value.slice(0, -1)
    if (entry.operationId) remove(entry.operationId)
    void run({ type: 'other', count: entry.count, label: entry.label, invoke: () => entry.run(), history: 'redo-kept' })
  }

  const operations = computed(() => [...(options.external() ?? []), ...own.value])

  /** The operation shown on each item: running beats failed. */
  const byItem = computed(() => {
    const map = new Map<string, FileManagerOperationState>()
    for (const operation of operations.value) {
      if (operation.status !== 'running' && operation.status !== 'pending' && operation.status !== 'error') continue
      for (const itemId of operation.itemIds ?? []) {
        const current = map.get(itemId)
        if (!current || (current.status === 'error' && operation.status !== 'error')) map.set(itemId, operation)
      }
    }
    return map
  })

  onBeforeUnmount(() => {
    for (const entry of meta.values()) clearTimeout(entry.timer)
  })

  return {
    operations,
    byItem,
    run,
    cancel,
    retry,
    dismiss,
    undo,
    redo,
    canUndo: computed(() => undoStack.value.length > 0),
    canRedo: computed(() => redoStack.value.length > 0),
  }
}

export type FileManagerOperationsApi<TData> = ReturnType<typeof useFileManagerOperations<TData>>
