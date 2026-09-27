import { computed, type Ref } from 'vue'
import type { FileExplorerItem } from './types'
import { filterFileTree } from './utils'

/**
 * Client-side name filter. Derived purely from `items` and `query`, so there is
 * nothing to debounce: filtering is a single pass that only copies the folders
 * on a path to a match.
 */
export function useFileExplorerSearch<TData>(
  items: Readonly<Ref<FileExplorerItem<TData>[]>>,
  query: Readonly<Ref<string>>,
) {
  const normalizedQuery = computed(() => query.value.trim())
  const result = computed(() => filterFileTree(items.value, normalizedQuery.value))

  return {
    query: normalizedQuery,
    isSearching: computed(() => normalizedQuery.value.length > 0),
    items: computed(() => result.value.items),
    revealIds: computed(() => result.value.revealIds),
  }
}
