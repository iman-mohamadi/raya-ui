/**
 * Registry item schema for Raya UI.
 *
 * Mirrors the official shadcn registry-item schema
 * (https://ui.shadcn.com/schema/registry-item.json) so items produced by
 * `scripts/build-registry.ts` are installable by the shadcn-vue CLI and any
 * compatible tooling. Kept as dependency-free TypeScript types because the
 * registry is generated from the component folders under
 * `app/components/raya/ui`, not hand-authored.
 */

export type RegistryItemType =
  | "registry:ui"
  | "registry:component"
  | "registry:lib"
  | "registry:hook"
  | "registry:block"
  | "registry:example";

export interface RegistryItemFile {
  /** Source path of the file within the item, e.g. "magnetic/Magnetic.vue". */
  path: string;
  /** File contents (inlined so a single fetch installs the component). */
  content?: string;
  type: RegistryItemType;
  /** Where the CLI writes the file in the user's project. */
  target?: string;
}

export interface RegistryItemCssVars {
  /** Tailwind `@theme` tokens (rare). */
  theme?: Record<string, string>;
  /** CSS variables added under `:root`. */
  light?: Record<string, string>;
  /** CSS variables added under `.dark`. */
  dark?: Record<string, string>;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  /** npm packages the component needs. */
  dependencies?: string[];
  devDependencies?: string[];
  /** Other registry items (e.g. shadcn primitives like "button"). */
  registryDependencies?: string[];
  files?: RegistryItemFile[];
  /** Theme tokens installed alongside the component (keeps it portable). */
  cssVars?: RegistryItemCssVars;
  meta?: Record<string, unknown>;
}

export type Registry = RegistryItem[];

/** Shape of a per-component `config.json` (all fields optional). */
export interface ComponentConfig {
  title?: string;
  description?: string;
  type?: RegistryItemType;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  /** Explicit file list; when omitted the folder is auto-scanned. */
  files?: string[];
  cssVars?: RegistryItemCssVars;
}
