import { Sidebar } from '@/components/sidebar'
import { RiskAnalysisForm } from '@/components/risk-analysis-form'

export default function RiskAnalysisPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Risk Analysis
            </h1>
            <p className="text-muted-foreground">
              Analyze your study habits and ergonomic setup to predict and prevent physical discomfort.
            </p>
          </div>

          <RiskAnalysisForm />
        </div>
      </main>
    </div>
  )
}
