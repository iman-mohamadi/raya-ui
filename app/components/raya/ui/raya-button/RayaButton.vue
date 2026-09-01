<script lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import type { RayaButtonVariants } from './variants'

/** Inline avatar rendered on the leading side. */
export interface RayaButtonAvatar {
  src?: string
  alt?: string
  /** Fallback initials shown when `src` is missing or fails to load. */
  text?: string
  loading?: 'eager' | 'lazy'
}

/**
 * An icon is either a component (e.g. any `lucide-vue-next` icon) or a class
 * string for a CSS icon set (e.g. `i-lucide-rocket` with Iconify/UnoCSS).
 */
export type RayaButtonIcon = Component | string

export interface RayaButtonProps {
  /** Label of the button. Ignored when the default slot is used. */
  label?: string
  color?: RayaButtonVariants['color']
  variant?: RayaButtonVariants['variant']
  size?: RayaButtonVariants['size']
  /** Color applied while the button is active. */
  activeColor?: RayaButtonVariants['color']
  /** Variant applied while the button is active. */
  activeVariant?: RayaButtonVariants['variant']
  /** Render the button with equal padding on all sides. */
  square?: boolean
  /** Render the button full width. */
  block?: boolean
  /** Round the shared edges when placed inside a horizontal/vertical group. */
  fieldGroup?: RayaButtonVariants['fieldGroup']

  /** Display an icon based on the `leading` and `trailing` props. */
  icon?: RayaButtonIcon
  /** Display an icon on the left side. */
  leadingIcon?: RayaButtonIcon
  /** Display an icon on the right side. */
  trailingIcon?: RayaButtonIcon
  /** When `true`, the icon will be displayed on the left side. */
  leading?: boolean
  /** When `true`, the icon will be displayed on the right side. */
  trailing?: boolean
  /** Display an avatar on the left side. */
  avatar?: RayaButtonAvatar

  /** When `true`, the loading icon is displayed and the button is disabled. */
  loading?: boolean
  /** Set the loading state automatically based on the `@click` promise state. */
  loadingAuto?: boolean
  /** The icon shown when `loading` is `true`. Defaults to a spinning loader. */
  loadingIcon?: RayaButtonIcon

  disabled?: boolean
  /** The type of the button when it is not a link. */
  type?: 'button' | 'submit' | 'reset'
  /** The element or component to render as when it is not a link. */
  as?: Component | string
  /** Merge props onto the single child element instead of rendering a tag. */
  asChild?: boolean
  autofocus?: boolean
  name?: string
  value?: string | number
  form?: string

  /** Route location the link should navigate to when clicked. */
  to?: string | Record<string, any>
  /** An alias for `to`. If used with `to`, `href` is ignored. */
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {})
  rel?: string
  download?: boolean | string
  /** Calls `router.replace` instead of `router.push`. */
  replace?: boolean
  /** Force the link to be treated as external (`<a>`) or internal. */
  external?: boolean
  /** Force the link to be active independently of the current route. */
  active?: boolean
  /** Only active when the current route is an exact match. */
  exact?: boolean
  /** Only active when the current route query matches. */
  exactQuery?: boolean
  /** Only active when the current route hash matches. */
  exactHash?: boolean
  /** Class applied when the link is active. */
  activeClass?: string
  /** Class applied when the link is inactive. */
  inactiveClass?: string
  /** Value passed to `aria-current` when the link is exact active. */
  ariaCurrentValue?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'

  class?: HTMLAttributes['class']
  /** Override the classes of any individual slot. */
  ui?: {
    base?: HTMLAttributes['class']
    label?: HTMLAttributes['class']
    leadingIcon?: HTMLAttributes['class']
    leadingAvatar?: HTMLAttributes['class']
    trailingIcon?: HTMLAttributes['class']
  }

  onClick?: ((event: MouseEvent) => void | Promise<void>) | ((event: MouseEvent) => void | Promise<void>)[]
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'
import { Primitive } from 'reka-ui'
import { LoaderCircle } from 'lucide-vue-next'
import { rayaButton } from './variants'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RayaButtonProps>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  type: 'button',
  as: 'button',
  asChild: false,
  // Vue casts absent boolean props to `false`; these four need to stay
  // `undefined` so "not set" is distinguishable from "explicitly off" —
  // `active`/`external` are tri-state, and `download`/`autofocus` must not be
  // written onto the element at all when they were never passed.
  active: undefined,
  external: undefined,
  download: undefined,
  autofocus: undefined
})

const slots = defineSlots<{
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}>()

const instance = getCurrentInstance()
/** Globally registered components, used to pick NuxtLink / RouterLink when present. */
const globalComponents = (instance?.appContext.components ?? {}) as Record<string, Component>

// --- Loading -----------------------------------------------------------------

const loadingAutoState = ref(false)
const isLoading = computed(() => props.loading || (props.loadingAuto && loadingAutoState.value))
const isDisabled = computed(() => props.disabled || isLoading.value)

async function onClickWrapper(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const callbacks = Array.isArray(props.onClick) ? props.onClick : props.onClick ? [props.onClick] : []
  if (!props.loadingAuto) {
    callbacks.forEach(fn => fn(event))
    return
  }

  loadingAutoState.value = true
  try {
    await Promise.all(callbacks.map(fn => fn(event)))
  } finally {
    loadingAutoState.value = false
  }
}

// --- Link --------------------------------------------------------------------

const linkTo = computed(() => props.to ?? props.href)
const isLink = computed(() => linkTo.value !== undefined && linkTo.value !== null)

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external
  if (typeof linkTo.value !== 'string') return false
  return /^(https?:)?\/\//.test(linkTo.value) || /^(mailto|tel):/.test(linkTo.value)
})

const linkComponent = computed<Component | string>(() => {
  if (!isLink.value) return props.as
  if (isExternal.value) return 'a'
  return globalComponents.NuxtLink || globalComponents.RouterLink || 'a'
})

const router = computed(() => instance?.appContext.config.globalProperties.$router)
const currentRoute = computed(() => instance?.appContext.config.globalProperties.$route)

const isActive = computed(() => {
  if (props.active !== undefined) return props.active
  if (!isLink.value || isExternal.value) return false

  const route = currentRoute.value
  if (!route) return false

  const resolved = router.value?.resolve(linkTo.value as any)
  const path: string | undefined = resolved?.path ?? (typeof linkTo.value === 'string' ? linkTo.value : undefined)
  if (!path) return false

  const matchesPath = props.exact
    ? route.path === path
    : route.path === path || route.path.startsWith(`${path.replace(/\/$/, '')}/`)

  if (!matchesPath) return false
  if (props.exactQuery && resolved) {
    const target = new URLSearchParams(resolved.query as Record<string, string>).toString()
    const current = new URLSearchParams(route.query as Record<string, string>).toString()
    if (target !== current) return false
  }
  if (props.exactHash && resolved && resolved.hash !== route.hash) return false

  return true
})

// --- Icons -------------------------------------------------------------------

const loadingIconValue = computed<RayaButtonIcon>(() => props.loadingIcon ?? LoaderCircle)

const isLeading = computed(() =>
  Boolean((props.icon && props.leading) || (props.icon && !props.trailing) || (isLoading.value && !props.trailing) || props.leadingIcon)
)
const isTrailing = computed(() =>
  Boolean((props.icon && props.trailing) || (isLoading.value && props.trailing) || props.trailingIcon)
)

const leadingIconValue = computed(() => (isLoading.value && !props.trailing ? loadingIconValue.value : props.leadingIcon || props.icon))
const trailingIconValue = computed(() => (isLoading.value && props.trailing ? loadingIconValue.value : props.trailingIcon || props.icon))

// --- Styles ------------------------------------------------------------------

/** An icon-only button gets equal padding on all sides. */
const isSquare = computed(() => props.square || (!props.label && !slots.default))

const ui = computed(() =>
  rayaButton({
    color: isActive.value && props.activeColor ? props.activeColor : props.color,
    variant: isActive.value && props.activeVariant ? props.activeVariant : props.variant,
    size: props.size,
    block: props.block,
    square: isSquare.value,
    fieldGroup: props.fieldGroup,
    leading: isLeading.value,
    trailing: isTrailing.value,
    loading: isLoading.value,
    active: isActive.value
  })
)

const baseClass = computed(() =>
  cn(
    ui.value.base(),
    props.ui?.base,
    isActive.value ? props.activeClass : props.inactiveClass,
    props.class
  )
)

// --- Attributes --------------------------------------------------------------

/** Props forwarded to the resolved element: link attributes or button attributes. */
const elementProps = computed(() => {
  if (!isLink.value) {
    return {
      type: props.type,
      disabled: isDisabled.value,
      autofocus: props.autofocus,
      name: props.name,
      value: props.value,
      form: props.form
    }
  }

  const shared = {
    target: props.target,
    rel: props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined),
    'aria-disabled': isDisabled.value ? 'true' : undefined,
    tabindex: isDisabled.value ? -1 : undefined
  }

  if (linkComponent.value === 'a') {
    return {
      ...shared,
      href: isDisabled.value ? undefined : (linkTo.value as string),
      download: props.download
    }
  }

  return {
    ...shared,
    to: linkTo.value,
    replace: props.replace,
    external: props.external,
    ariaCurrentValue: props.ariaCurrentValue
  }
})
</script>

<template>
  <Primitive
    :as="linkComponent"
    :as-child="asChild"
    :class="baseClass"
    v-bind="{ ...elementProps, ...$attrs }"
    @click="onClickWrapper"
  >
    <slot name="leading">
      <template v-if="isLeading && leadingIconValue">
        <span
          v-if="typeof leadingIconValue === 'string'"
          :class="cn(ui.leadingIcon(), props.ui?.leadingIcon, leadingIconValue)"
        />
        <component
          :is="leadingIconValue"
          v-else
          :class="cn(ui.leadingIcon(), props.ui?.leadingIcon)"
        />
      </template>
      <img
        v-else-if="avatar?.src"
        :src="avatar.src"
        :alt="avatar.alt"
        :loading="avatar.loading"
        :class="cn(ui.leadingAvatar(), ui.leadingAvatarSize(), props.ui?.leadingAvatar)"
      >
      <span
        v-else-if="avatar?.text"
        :class="cn(ui.leadingAvatar(), ui.leadingAvatarSize(), 'inline-flex items-center justify-center text-[0.65em] font-medium', props.ui?.leadingAvatar)"
      >{{ avatar.text }}</span>
    </slot>

    <slot>
      <span v-if="label" :class="cn(ui.label(), props.ui?.label)">{{ label }}</span>
    </slot>

    <slot name="trailing">
      <template v-if="isTrailing && trailingIconValue">
        <span
          v-if="typeof trailingIconValue === 'string'"
          :class="cn(ui.trailingIcon(), props.ui?.trailingIcon, trailingIconValue)"
        />
        <component
          :is="trailingIconValue"
          v-else
          :class="cn(ui.trailingIcon(), props.ui?.trailingIcon)"
        />
      </template>
    </slot>
  </Primitive>
</template>
