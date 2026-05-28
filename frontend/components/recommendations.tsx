import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Smartphone, Eye, Armchair, Zap } from 'lucide-react'

const recommendations = [
  {
    title: 'Posture Improvement',
    description: 'Keep your monitor at eye level and maintain a 90-degree angle at your elbows.',
    icon: Armchair,
    action: 'Learn More',
  },
  {
    title: 'Break Strategy',
    description: 'Take a 5-minute break every 25 minutes following the Pomodoro technique.',
    icon: Zap,
    action: 'Start Timer',
  },
  {
    title: 'Eye Care',
    description: 'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.',
    icon: Eye,
    action: 'Set Reminder',
  },
  {
    title: 'Workspace Setup',
    description: 'Invest in ergonomic furniture and ensure proper lighting to reduce strain.',
    icon: Smartphone,
    action: 'View Guide',
  },
]

export function Recommendations() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Personalized Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon
          return (
            <Card
              key={index}
              className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {rec.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:bg-primary/10"
                  >
                    {rec.action}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
