import type { Ref } from 'vue'
import { createContext } from 'reka-ui'
import type { FileExplorerSize } from './types'

/**
 * State shared from `FileExplorer` with every recursive node. It is id-based on
 * purpose: nodes receive their item as a prop, so nothing here depends on the
 * consumer's `data` type, and a node never needs a watcher of its own.
 */
export interface FileExplorerContext {
  /** Trimmed search query, used to highlight matches. */
  query: Readonly<Ref<string>>
  size: Readonly<Ref<FileExplorerSize>>
  guides: Readonly<Ref<boolean>>
  draggable: Readonly<Ref<boolean>>
  /** Folder currently under the pointer during a drag; `null` is the root, `undefined` is none. */
  dropTargetId: Readonly<Ref<string | null | undefined>>
  draggingIds: Readonly<Ref<readonly string[]>>
  onItemSelect: (id: string, event: Event) => void
  onItemOpen: (id: string) => void
  onItemContextMenu: (id: string) => void
  extendSelection: (id: string) => void
  selectAll: () => void
  onDragStart: (id: string, event: DragEvent) => void
  onDragOver: (id: string | null, event: DragEvent) => void
  onDrop: (event: DragEvent) => void
  onDragEnd: () => void
}

export const [injectFileExplorerContext, provideFileExplorerContext]
  = createContext<FileExplorerContext>('FileExplorer')
