import { computed, ref, watch, type Ref } from 'vue'
import { getAncestorIds, type FileExplorerIndex } from './utils'

interface UseFileExplorerNavigationOptions<TData> {
  /** The open folder, `null` for the root. May point at an id that no longer exists. */
  folder: Ref<string | null>
  index: Readonly<Ref<FileExplorerIndex<TData>>>
}

/**
 * Back / Forward / Up over folder ids, like a browser history. Changes made
 * from outside (`v-model:folder`) are recorded too.
 */
export function useFileExplorerNavigation<TData>(options: UseFileExplorerNavigationOptions<TData>) {
  const { folder, index } = options

  /** The open folder, falling back to the root when it was deleted or never existed. */
  const current = computed(() => {
    const id = folder.value
    return id !== null && index.value.get(id)?.item.type === 'folder' ? id : null
  })

  const history = ref<(string | null)[]>([current.value])
  const position = ref(0)

  watch(current, (id) => {
    if (history.value[position.value] === id) return
    history.value = [...history.value.slice(0, position.value + 1), id]
    position.value = history.value.length - 1
  })

  function go(to: number) {
    position.value = to
    folder.value = history.value[to] ?? null
  }

  const canGoBack = computed(() => position.value > 0)
  const canGoForward = computed(() => position.value < history.value.length - 1)
  const parentId = computed(() => (current.value === null ? null : index.value.get(current.value)?.parentId ?? null))

  return {
    current,
    /** Folder ids from the root down to the open folder. */
    path: computed(() => getAncestorIds(index.value, current.value)),
    canGoBack,
    canGoForward,
    canGoUp: computed(() => current.value !== null),
    navigate(id: string | null) {
      folder.value = id
    },
    back() {
      if (canGoBack.value) go(position.value - 1)
    },
    forward() {
      if (canGoForward.value) go(position.value + 1)
    },
    /** Opens the parent folder and returns the folder that was left, so it can be re-selected. */
    up(): string | null {
      const left = current.value
      if (left === null) return null
      folder.value = parentId.value
      return left
    },
  }
}
