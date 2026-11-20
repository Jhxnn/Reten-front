import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'reten-theme'
const listeners = new Set<() => void>()

/** Tema atual, já aplicado no <html> pelo script de index.html antes da primeira pintura. */
function current(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e1b17' : '#fafaf7')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Armazenamento indisponível (aba privada): o tema vale só para esta visita.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'light' as Theme)
  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
