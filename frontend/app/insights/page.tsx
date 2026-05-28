import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Recommendations } from '@/components/recommendations'
import { TrendingDown, Activity, AlertCircle, CheckCircle } from 'lucide-react'

export default function InsightsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Insights & Recommendations
            </h1>
            <p className="text-muted-foreground">
              Get personalized insights based on your study habits and health data.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Daily Study</p>
                  <p className="text-2xl font-bold text-foreground">5.2h</p>
                </div>
                <Activity className="w-8 h-8 text-primary/50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Break Frequency</p>
                  <p className="text-2xl font-bold text-foreground">Every 28m</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary/50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sleep Avg</p>
                  <p className="text-2xl font-bold text-foreground">7.1h</p>
                </div>
                <Activity className="w-8 h-8 text-primary/50" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Trend</p>
                  <p className="text-2xl font-bold text-foreground">↓ 12%</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </div>

          {/* Health Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Good Habits</h3>
                  <p className="text-sm text-green-800">
                    You&apos;re maintaining consistent break frequency and sleep schedule. This is excellent for long-term health.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Watch Out</h3>
                  <p className="text-sm text-amber-800">
                    Try to reduce continuous sitting sessions. Consider adjusting your posture setup.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Activity className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Next Step</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase physical activity and practice eye care exercises daily.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Recommendations />
        </div>
      </main>
    </div>
  )
}
