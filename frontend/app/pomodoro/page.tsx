import { Sidebar } from '@/components/sidebar'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import { Card } from '@/components/ui/card'

export default function PomodoroPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Pomodoro Timer
            </h1>
            <p className="text-muted-foreground">
              Stay focused with the Pomodoro technique. Work in 25-minute intervals with regular breaks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timer */}
            <div className="lg:col-span-2">
              <PomodoroTimer />
            </div>

            {/* Tips */}
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary flex-shrink-0">1</span>
                    <span className="text-muted-foreground">
                      Work for 25 minutes with complete focus
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary flex-shrink-0">2</span>
                    <span className="text-muted-foreground">
                      Take a 5-minute break to rest
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary flex-shrink-0">3</span>
                    <span className="text-muted-foreground">
                      After 4 sessions, take a 15-minute break
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary flex-shrink-0">4</span>
                    <span className="text-muted-foreground">
                      Move, stretch, and hydrate during breaks
                    </span>
                  </li>
                </ol>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Disable notifications during work sessions</li>
                  <li>• Keep water nearby for hydration</li>
                  <li>• Stretch during breaks to improve posture</li>
                  <li>• Track your completed sessions</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
