<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: ButtonVariant
  }>(),
  {
    href: undefined,
    variant: 'primary',
  },
)

const tag = computed(() => (props.href ? 'a' : 'button'))

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-fog text-ink hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.45)]',
  secondary:
    'border border-line-strong bg-white/[0.02] text-fog hover:border-white/30 hover:bg-white/[0.06]',
}
</script>

<template>
  <component
    :is="tag"
    :href="href"
    class="group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-[0.95rem] font-medium tracking-tight transition-all duration-200 ease-out active:translate-y-px"
    :class="variantClasses[variant]"
  >
    <slot />
  </component>
</template>
