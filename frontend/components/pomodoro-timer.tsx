'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { usePomodoro } from '@/app/context/pomodoro-context'

interface PomodoroTimerProps {
  variant?: 'compact' | 'full'
}

export function PomodoroTimer({
  variant = 'full',
}: PomodoroTimerProps) {
  const {
    timeLeft,
    isRunning,
    mode,
    focusDuration,
    breakDuration,
    setTimeLeft,
    setFocusDuration,
    setBreakDuration,
    start,
    pause,
    reset,
  } = usePomodoro()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isBreak = mode === 'break'

  const handleReset = () => {
    reset()
  }

  const handleStartPause = () => {
    if (isRunning) pause()
    else start()
  }

  const handleFocusChange = (value: string) => {
    const num = Math.max(1, Math.min(60, parseInt(value) || 25))
    setFocusDuration(num * 60)
    if (!isRunning && !isBreak) {
      setTimeLeft(num * 60)
    }
  }

  const handleBreakChange = (value: string) => {
    const num = Math.max(1, Math.min(60, parseInt(value) || 5))
    setBreakDuration(num * 60)
    if (!isRunning && isBreak) {
      setTimeLeft(num * 60)
    }
  }

  const currentDuration = isBreak ? breakDuration : focusDuration
  const progress =
    ((currentDuration - timeLeft) / currentDuration) *
    100

  if (variant === 'compact') {
    return (
      <Card className="p-4 bg-card">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-card">
      <div className="flex flex-col gap-6">
        {/* Settings Section */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b">
          <div className="space-y-2">
            <Label htmlFor="focus-input" className="text-sm font-medium">
              Focus Duration (min)
            </Label>
            <Input
              id="focus-input"
              type="number"
              min="1"
              max="60"
              value={Math.round(focusDuration / 60)}
              onChange={(e) => handleFocusChange(e.target.value)}
              disabled={isRunning}
              className="text-center font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-input" className="text-sm font-medium">
              Break Duration (min)
            </Label>
            <Input
              id="break-input"
              type="number"
              min="1"
              max="60"
              value={Math.round(breakDuration / 60)}
              onChange={(e) => handleBreakChange(e.target.value)}
              disabled={isRunning}
              className="text-center font-semibold"
            />
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-4">
          {/* Current Mode Badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            <p className="text-sm font-semibold text-primary">
              {isBreak ? '☕ Break Time' : '⏱️ Focus Time'}
            </p>
          </div>

          {/* Timer Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Progress Ring SVG */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={isBreak ? 'var(--color-success)' : 'var(--color-primary)'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Time Display */}
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground tabular-nums">
                {String(minutes).padStart(2, '0')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {String(seconds).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleStartPause}
            size="lg"
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Customize your focus and break durations, then start working. The timer stays synchronized across pages and switches modes automatically.
        </p>
      </div>
    </Card>
  )
}
