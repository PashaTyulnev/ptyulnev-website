import { ref, computed, type ComputedRef } from 'vue'

interface AnimationEntry {
  id: string
  label: string
}

// Module-level singleton — shared across all components on the client
const _animations = ref<AnimationEntry[]>([])
const _activeId = ref<string | null>(null)

export function useAnimationManager() {
  function register(id: string, label: string): void {
    if (_animations.value.some(a => a.id === id)) return
    _animations.value.push({ id, label })
    if (_activeId.value === null) _activeId.value = id
  }

  function unregister(id: string): void {
    _animations.value = _animations.value.filter(a => a.id !== id)
    if (_activeId.value === id) {
      _activeId.value = _animations.value[0]?.id ?? null
    }
  }

  // Switches to this animation, pausing all others implicitly via their watchers.
  function toggle(id: string): void {
    _activeId.value = _activeId.value === id ? null : id
  }

  function isActive(id: string): ComputedRef<boolean> {
    return computed(() => _activeId.value === id)
  }

  return {
    animations: _animations,
    activeId: _activeId,
    register,
    unregister,
    toggle,
    isActive,
  }
}
