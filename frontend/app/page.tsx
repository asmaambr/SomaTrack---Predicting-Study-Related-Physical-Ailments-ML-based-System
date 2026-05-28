import { Sidebar } from '@/components/sidebar'
import { MetricCard } from '@/components/metric-card'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import { Recommendations } from '@/components/recommendations'
import { Clock, TrendingUp, Heart } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome to SomaTrack AI
            </h1>
            <p className="text-muted-foreground">
              Your smart companion for productive study sessions and ergonomic health
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Daily Focus Time"
              value="4h 32m"
              icon={Clock}
              description="Your study streak is going strong"
            />
            <MetricCard
              title="Current Risk Level"
              value="Low"
              icon={TrendingUp}
              description="Great posture and break habits"
              variant="accent"
            />
            <MetricCard
              title="Health Score"
              value="87/100"
              icon={Heart}
              description="Keep maintaining your routine"
            />
          </div>

          {/* Pomodoro Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Study Timer</h2>
            <div className="max-w-md">
              <PomodoroTimer />
            </div>
          </div>

          {/* Recommendations */}
          <Recommendations />
        </div>
      </main>
    </div>
  )
}
