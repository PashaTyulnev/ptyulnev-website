<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary'

const props = withDefaults(
  defineProps<{ href?: string; variant?: ButtonVariant }>(),
  { href: undefined, variant: 'primary' },
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:opacity-90',
  secondary: 'border border-line-strong text-fg hover:bg-surface',
}
</script>

<template>
  <component
    :is="props.href ? 'a' : 'button'"
    :href="props.href"
    class="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[0.95rem] font-medium transition"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </component>
</template>
