import { shallowRef } from 'vue'
import type { FileExplorerOperationContext } from './types'

export interface LoadState {
  status: 'loading' | 'error'
  error?: string
}

interface UseFileExplorerLoaderOptions<TData, TTarget> {
  /** The consumer's handler; `undefined` disables loading. */
  handler: () => ((target: TTarget, context: FileExplorerOperationContext<TData>) => unknown) | undefined
  context: (signal: AbortSignal) => FileExplorerOperationContext<TData>
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : ''
}

/**
 * Keyed async loads (folder children, next pages) with loading and error
 * states. Concurrent requests for the same key share one call, so the content
 * area and the directory tree never load a folder twice.
 */
export function useFileExplorerLoader<TData, TTarget>(options: UseFileExplorerLoaderOptions<TData, TTarget>) {
  const states = shallowRef(new Map<string, LoadState>())
  const inflight = new Map<string, Promise<void>>()
  const done = new Set<string>()

  function setState(key: string, state: LoadState | undefined) {
    const next = new Map(states.value)
    if (state) next.set(key, state)
    else next.delete(key)
    states.value = next
  }

  /**
   * Loads `key` once. `force` loads again (retry, next page). The returned
   * promise rejects with the handler's error, after the error state is set.
   */
  function load(key: string, target: TTarget, force = false): Promise<void> {
    const handler = options.handler()
    if (!handler) return Promise.resolve()
    const running = inflight.get(key)
    if (running) return running
    if (done.has(key) && !force) return Promise.resolve()

    const controller = new AbortController()
    setState(key, { status: 'loading' })
    const promise = Promise.resolve()
      .then(() => handler(target, options.context(controller.signal)))
      .then(
        () => {
          done.add(key)
          setState(key, undefined)
        },
        (error: unknown) => {
          setState(key, { status: 'error', error: errorMessage(error) })
          throw error
        },
      )
      .finally(() => inflight.delete(key))
    inflight.set(key, promise)
    return promise
  }

  /** Forgets that `key` was loaded, e.g. after a refresh. */
  function reset(key?: string) {
    if (key === undefined) done.clear()
    else done.delete(key)
  }

  return {
    states,
    state: (key: string) => states.value.get(key),
    load,
    reset,
  }
}
