import { computed, ref, shallowRef } from 'vue'
import type { FileExplorerConflict, FileExplorerConflictAction, FileExplorerConflictResolution } from './types'
import { uniqueName } from './utils'

interface UseFileExplorerConflictsOptions<TData> {
  /** Names already used in the folder receiving `conflict`. */
  takenNames: (conflict: FileExplorerConflict<TData>) => string[]
}

/**
 * Drives the conflict dialog: one conflict at a time, with "apply to all".
 * Requests made while a dialog is open wait their turn.
 */
export function useFileExplorerConflicts<TData>(options: UseFileExplorerConflictsOptions<TData>) {
  const queue = shallowRef<FileExplorerConflict<TData>[]>([])
  const position = ref(0)
  let resolutions: FileExplorerConflictResolution<TData>[] = []
  let settle: ((value: FileExplorerConflictResolution<TData>[] | null) => void) | null = null
  let chain: Promise<unknown> = Promise.resolve()
  // Names handed out for "keep both" in this batch, per destination folder.
  let assigned = new Map<string, string[]>()

  const current = computed(() => queue.value[position.value] ?? null)
  const remaining = computed(() => Math.max(0, queue.value.length - position.value - 1))

  function close(value: FileExplorerConflictResolution<TData>[] | null) {
    const done = settle
    settle = null
    queue.value = []
    position.value = 0
    done?.(value)
  }

  function freeName(conflict: FileExplorerConflict<TData>) {
    const key = conflict.target?.id ?? ''
    const taken = [...options.takenNames(conflict), ...(assigned.get(key) ?? [])]
    const name = uniqueName(conflict.name, taken)
    assigned.set(key, [...(assigned.get(key) ?? []), name])
    return name
  }

  function record(conflict: FileExplorerConflict<TData>, action: FileExplorerConflictAction) {
    // Only name clashes can be replaced or kept; anything else can only be skipped.
    const effective = conflict.reason === 'exists' ? action : 'skip'
    resolutions.push({ conflict, action: effective, name: effective === 'keep-both' ? freeName(conflict) : undefined })
  }

  /** Records a choice for the current conflict, or for it and every remaining one. */
  function choose(action: FileExplorerConflictAction, applyToAll = false) {
    const pending = applyToAll ? queue.value.slice(position.value) : [current.value]
    for (const conflict of pending) if (conflict) record(conflict, action)
    position.value += pending.length
    if (position.value >= queue.value.length) close(resolutions)
  }

  function cancel() {
    close(null)
  }

  /** Asks the user about each conflict. Resolves `null` when they cancel. */
  function resolve(conflicts: FileExplorerConflict<TData>[]): Promise<FileExplorerConflictResolution<TData>[] | null> {
    if (!conflicts.length) return Promise.resolve([])
    const next = chain.then(() => new Promise<FileExplorerConflictResolution<TData>[] | null>((done) => {
      resolutions = []
      assigned = new Map()
      settle = done
      position.value = 0
      queue.value = conflicts
    }))
    chain = next.catch(() => undefined)
    return next
  }

  return { current, remaining, choose, cancel, resolve }
}
