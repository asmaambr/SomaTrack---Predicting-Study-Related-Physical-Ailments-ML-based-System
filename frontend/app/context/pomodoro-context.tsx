'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type PomodoroMode = 'focus' | 'break'

type PomodoroContextValue = {
  timeLeft: number
  isRunning: boolean
  mode: PomodoroMode
  focusDuration: number
  breakDuration: number
  setTimeLeft: (value: number) => void
  setIsRunning: (value: boolean) => void
  setMode: (value: PomodoroMode) => void
  setFocusDuration: (value: number) => void
  setBreakDuration: (value: number) => void
  start: () => void
  pause: () => void
  reset: () => void
}

const STORAGE_KEY = 'somatrack-pomodoro-state'
const DEFAULT_FOCUS = 25 * 60
const DEFAULT_BREAK = 5 * 60

const PomodoroContext = createContext<PomodoroContextValue | null>(null)

function clampSeconds(value: number, min = 60, max = 60 * 60) {
  return Math.max(min, Math.min(max, value))
}

function getDefaultState() {
  return {
    timeLeft: DEFAULT_FOCUS,
    isRunning: false,
    mode: 'focus' as PomodoroMode,
    focusDuration: DEFAULT_FOCUS,
    breakDuration: DEFAULT_BREAK,
  }
}

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [focusDuration, setFocusDurationState] = useState(DEFAULT_FOCUS)
  const [breakDuration, setBreakDurationState] = useState(DEFAULT_BREAK)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as Partial<ReturnType<typeof getDefaultState>>
      const nextFocus = typeof parsed.focusDuration === 'number' ? clampSeconds(parsed.focusDuration) : DEFAULT_FOCUS
      const nextBreak = typeof parsed.breakDuration === 'number' ? clampSeconds(parsed.breakDuration) : DEFAULT_BREAK
      const nextMode = parsed.mode === 'break' ? 'break' : 'focus'
      const nextTimeLeft = typeof parsed.timeLeft === 'number'
        ? clampSeconds(parsed.timeLeft, 1, 60 * 60)
        : (nextMode === 'break' ? nextBreak : nextFocus)

      setFocusDurationState(nextFocus)
      setBreakDurationState(nextBreak)
      setMode(nextMode)
      setTimeLeft(nextTimeLeft)
      setIsRunning(Boolean(parsed.isRunning))
    } catch {
      // ignore malformed storage data
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timeLeft, isRunning, mode, focusDuration, breakDuration })
      )
    } catch {
      // ignore storage errors
    }
  }, [timeLeft, isRunning, mode, focusDuration, breakDuration])

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          const nextMode = mode === 'focus' ? 'break' : 'focus'
          const nextTime = nextMode === 'focus' ? focusDuration : breakDuration
          setMode(nextMode)
          return nextTime
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning, mode, focusDuration, breakDuration])

  const value = useMemo<PomodoroContextValue>(() => {
    return {
      timeLeft,
      isRunning,
      mode,
      focusDuration,
      breakDuration,
      setTimeLeft,
      setIsRunning,
      setMode,
      setFocusDuration: (value: number) => setFocusDurationState(clampSeconds(value)),
      setBreakDuration: (value: number) => setBreakDurationState(clampSeconds(value)),
      start: () => setIsRunning(true),
      pause: () => setIsRunning(false),
      reset: () => {
        setIsRunning(false)
        setMode('focus')
        setTimeLeft(focusDuration)
      },
    }
  }, [timeLeft, isRunning, mode, focusDuration, breakDuration])

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider')
  }
  return context
}