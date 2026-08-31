/**
 * Registry item schema for Raya UI.
 *
 * Mirrors the official shadcn-vue registry schemas
 * (https://shadcn-vue.com/schema/registry.json and
 * https://shadcn-vue.com/schema/registry-item.json) so items produced by
 * `scripts/build-registry.ts` are installable by the shadcn-vue CLI and any
 * compatible tooling. Kept as dependency-free TypeScript types because the
 * registry is generated from the component folders under
 * `app/components/raya/ui`, not hand-authored.
 */

/** The `type` enum accepted at registry-item root level. */
export type RegistryItemType =
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:page"
  | "registry:file"
  | "registry:style"
  | "registry:base"
  | "registry:font"
  | "registry:item";

/** Same enum minus `registry:font`, which is not valid on a file entry. */
export type RegistryFileType = Exclude<RegistryItemType, "registry:font">;

export interface RegistryItemFile {
  /** Source path of the file within the item, e.g. "magnetic/Magnetic.vue". */
  path: string;
  /** File contents (inlined so a single fetch installs the component). */
  content?: string;
  type: RegistryFileType;
  /**
   * Where the CLI writes the file in the user's project. Required only for
   * `registry:file` and `registry:page`; omit it for everything else so the
   * CLI resolves the destination from the consumer's `components.json`
   * aliases instead of a path we hardcoded.
   */
  target?: string;
}

export interface RegistryItemCssVars {
  /** Tailwind `@theme` tokens. */
  theme?: Record<string, string>;
  /** CSS variables added under `:root`. */
  light?: Record<string, string>;
  /** CSS variables added under `.dark`. */
  dark?: Record<string, string>;
}

/** Raw CSS rules keyed by at-rule, e.g. "@layer base" or "@keyframes wiggle". */
export type RegistryItemCss = Record<string, unknown>;

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  author?: string;
  /** npm packages the component needs. */
  dependencies?: string[];
  devDependencies?: string[];
  /** Other registry items: bare names ("button") or absolute URLs. */
  registryDependencies?: string[];
  files?: RegistryItemFile[];
  /** Theme tokens installed alongside the component (keeps it portable). */
  cssVars?: RegistryItemCssVars;
  css?: RegistryItemCss;
  /** Free text the CLI prints after install. */
  docs?: string;
  categories?: string[];
  meta?: Record<string, unknown>;
}

/** The root `registry.json` manifest. */
export interface Registry {
  $schema?: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

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
  css?: RegistryItemCss;
  docs?: string;
  categories?: string[];
  meta?: Record<string, unknown>;
}
