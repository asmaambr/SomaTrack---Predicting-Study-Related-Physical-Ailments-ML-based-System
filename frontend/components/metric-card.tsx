import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'accent'
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: MetricCardProps) {
  return (
    <Card
      className={`p-6 ${
        variant === 'accent'
          ? 'bg-primary/5 border-primary/20'
          : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          variant === 'accent'
            ? 'bg-primary/10'
            : 'bg-secondary'
        }`}>
          <Icon
            className={`w-6 h-6 ${
              variant === 'accent'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          />
        </div>
      </div>
    </Card>
  )
}
