import { computed, ref, shallowRef } from 'vue'
import type { FileManagerConflict, FileManagerConflictAction, FileManagerConflictResolution } from './types'
import { uniqueName } from './utils'

interface UseFileManagerConflictsOptions<TData> {
  /** Names already used in the folder receiving `conflict`. */
  takenNames: (conflict: FileManagerConflict<TData>) => string[]
}

/**
 * Drives the conflict dialog: one conflict at a time, with "apply to all".
 * Requests made while a dialog is open wait their turn.
 */
export function useFileManagerConflicts<TData>(options: UseFileManagerConflictsOptions<TData>) {
  const queue = shallowRef<FileManagerConflict<TData>[]>([])
  const position = ref(0)
  let resolutions: FileManagerConflictResolution<TData>[] = []
  let settle: ((value: FileManagerConflictResolution<TData>[] | null) => void) | null = null
  let chain: Promise<unknown> = Promise.resolve()
  // Names handed out for "keep both" in this batch, per destination folder.
  let assigned = new Map<string, string[]>()

  const current = computed(() => queue.value[position.value] ?? null)
  const remaining = computed(() => Math.max(0, queue.value.length - position.value - 1))

  function close(value: FileManagerConflictResolution<TData>[] | null) {
    const done = settle
    settle = null
    queue.value = []
    position.value = 0
    done?.(value)
  }

  function freeName(conflict: FileManagerConflict<TData>) {
    const key = conflict.target?.id ?? ''
    const taken = [...options.takenNames(conflict), ...(assigned.get(key) ?? [])]
    const name = uniqueName(conflict.name, taken)
    assigned.set(key, [...(assigned.get(key) ?? []), name])
    return name
  }

  function record(conflict: FileManagerConflict<TData>, action: FileManagerConflictAction) {
    // Only name clashes can be replaced or kept; anything else can only be skipped.
    const effective = conflict.reason === 'exists' ? action : 'skip'
    resolutions.push({ conflict, action: effective, name: effective === 'keep-both' ? freeName(conflict) : undefined })
  }

  /** Records a choice for the current conflict, or for it and every remaining one. */
  function choose(action: FileManagerConflictAction, applyToAll = false) {
    const pending = applyToAll ? queue.value.slice(position.value) : [current.value]
    for (const conflict of pending) if (conflict) record(conflict, action)
    position.value += pending.length
    if (position.value >= queue.value.length) close(resolutions)
  }

  function cancel() {
    close(null)
  }

  /** Asks the user about each conflict. Resolves `null` when they cancel. */
  function resolve(conflicts: FileManagerConflict<TData>[]): Promise<FileManagerConflictResolution<TData>[] | null> {
    if (!conflicts.length) return Promise.resolve([])
    const next = chain.then(() => new Promise<FileManagerConflictResolution<TData>[] | null>((done) => {
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
