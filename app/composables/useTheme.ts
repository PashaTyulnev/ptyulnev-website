export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

/**
 * Site-wide theme toggle. `dark` is the default and matches what's rendered
 * on the server; a blocking inline script (nuxt.config.ts) applies any saved
 * `light` preference to <html data-theme> before first paint on the client,
 * this composable's `initTheme()` then syncs the reactive state to match so
 * the toggle icon isn't wrong for a frame.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  function applyToDom(t: Theme): void {
    if (!import.meta.client) return
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem(STORAGE_KEY, t)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', t === 'light' ? '#f7f7f5' : '#0d0f10')
  }

  function setTheme(t: Theme): void {
    theme.value = t
    applyToDom(t)
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme(): void {
    if (!import.meta.client) return
    theme.value = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  }

  return { theme, setTheme, toggleTheme, initTheme }
}
