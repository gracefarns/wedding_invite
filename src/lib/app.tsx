import { createContext, useContext } from 'react'

/**
 * loading → the loader is up while fonts and intro images arrive
 * intro   → the closed invitation suite is on screen (or opening)
 * hero    → the suite has bloomed away and the monogram hero is arriving
 * ready   → the site is interactive and scrolling is unlocked
 */
export type Phase = 'loading' | 'intro' | 'hero' | 'ready'

export interface AppState {
  phase: Phase
  setPhase: (phase: Phase) => void
  /** Navigate through the paper veil. */
  go: (to: string) => void
  replayIntro: () => void
}

export const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <App>')
  return ctx
}

export const INTRO_KEY = 'cc-intro-seen'

export const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}
export const markIntroSeen = (seen: boolean) => {
  try {
    if (seen) sessionStorage.setItem(INTRO_KEY, '1')
    else sessionStorage.removeItem(INTRO_KEY)
  } catch {
    /* private mode: the intro simply plays each visit */
  }
}
