'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface RiskAnalysisResult {
  riskLevel: 'low' | 'moderate' | 'high'
  backPain: number
  neckStrain: number
  headaches: number
  explanation: string
}

export function RiskAnalysisForm() {
  const [formData, setFormData] = useState({
    studyHours: '6',
    sittingDuration: '4',
    breakFrequency: '30',
    location: 'desk',
    chairType: 'office',
    posture: 'good',
    sleep: '7',
    activity: 'moderate',
    stress: 'medium',
  })

  const [result, setResult] = useState<RiskAnalysisResult | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const analyzeRisk = () => {
    const studyHours = parseInt(formData.studyHours) || 0
    const sittingDuration = parseInt(formData.sittingDuration) || 0
    const breakFrequency = parseInt(formData.breakFrequency) || 0
    const sleep = parseInt(formData.sleep) || 0
    const postureMult = formData.posture === 'good' ? 0.5 : formData.posture === 'fair' ? 1 : 1.5
    const stressMult = formData.stress === 'low' ? 0.8 : formData.stress === 'medium' ? 1 : 1.3
    const activityMult = formData.activity === 'high' ? 0.6 : formData.activity === 'moderate' ? 1 : 1.4

    const baseRisk = Math.min(100, (sittingDuration * 12 + (8 - sleep) * 10) * postureMult * stressMult)
    const backPain = Math.min(100, Math.max(20, baseRisk * 0.8 * activityMult))
    const neckStrain = Math.min(100, Math.max(15, baseRisk * 0.7 * activityMult))
    const headaches = Math.min(100, Math.max(10, (8 - sleep) * 15 * stressMult * (100 - breakFrequency) / 50))

    const avgRisk = (backPain + neckStrain + headaches) / 3
    const riskLevel: 'low' | 'moderate' | 'high' = avgRisk < 35 ? 'low' : avgRisk < 65 ? 'moderate' : 'high'

    const explanations = {
      low: `Your ergonomic health is excellent. You're maintaining good study habits with adequate breaks and sleep. Keep up the healthy routine!`,
      moderate: `Your risk level is moderate. Consider increasing break frequency and reviewing your posture. Small adjustments can significantly improve your health.`,
      high: `Your risk level is high. Immediate action is needed. Increase breaks, improve posture, and prioritize sleep. Consider consulting a healthcare provider.`,
    }

    setResult({
      riskLevel,
      backPain: Math.round(backPain),
      neckStrain: Math.round(neckStrain),
      headaches: Math.round(headaches),
      explanation: explanations[riskLevel],
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Health Assessment</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="studyHours" className="text-sm font-medium">
              Daily Study Hours
            </Label>
            <Input
              id="studyHours"
              name="studyHours"
              type="number"
              min="0"
              max="24"
              value={formData.studyHours}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sittingDuration" className="text-sm font-medium">
              Continuous Sitting (hours)
            </Label>
            <Input
              id="sittingDuration"
              name="sittingDuration"
              type="number"
              min="0"
              max="12"
              value={formData.sittingDuration}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="breakFrequency" className="text-sm font-medium">
              Break Frequency (minutes)
            </Label>
            <Input
              id="breakFrequency"
              name="breakFrequency"
              type="number"
              min="5"
              max="120"
              value={formData.breakFrequency}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Study Location
            </Label>
            <Select value={formData.location} onValueChange={(val) => handleSelectChange('location', val)}>
              <SelectTrigger id="location" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desk">Desk</SelectItem>
                <SelectItem value="couch">Couch</SelectItem>
                <SelectItem value="bed">Bed</SelectItem>
                <SelectItem value="standing">Standing Desk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chairType" className="text-sm font-medium">
              Chair Type
            </Label>
            <Select value={formData.chairType} onValueChange={(val) => handleSelectChange('chairType', val)}>
              <SelectTrigger id="chairType" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office Chair</SelectItem>
                <SelectItem value="gaming">Gaming Chair</SelectItem>
                <SelectItem value="basic">Basic Chair</SelectItem>
                <SelectItem value="none">No Chair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="posture" className="text-sm font-medium">
              Posture Quality
            </Label>
            <Select value={formData.posture} onValueChange={(val) => handleSelectChange('posture', val)}>
              <SelectTrigger id="posture" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sleep" className="text-sm font-medium">
              Sleep Hours Per Night
            </Label>
            <Input
              id="sleep"
              name="sleep"
              type="number"
              min="0"
              max="12"
              value={formData.sleep}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="activity" className="text-sm font-medium">
              Physical Activity Level
            </Label>
            <Select value={formData.activity} onValueChange={(val) => handleSelectChange('activity', val)}>
              <SelectTrigger id="activity" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stress" className="text-sm font-medium">
              Stress Level
            </Label>
            <Select value={formData.stress} onValueChange={(val) => handleSelectChange('stress', val)}>
              <SelectTrigger id="stress" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={analyzeRisk} className="w-full mt-6">
            Analyze Risk
          </Button>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {result ? (
          <>
            {/* Risk Level */}
            <Card className={`p-6 ${
              result.riskLevel === 'low'
                ? 'bg-green-50 border-green-200'
                : result.riskLevel === 'moderate'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.riskLevel === 'low' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                    result.riskLevel === 'moderate' ? 'text-amber-600' : 'text-red-600'
                  }`} />
                )}
                <div>
                  <h4 className={`font-semibold ${
                    result.riskLevel === 'low'
                      ? 'text-green-900'
                      : result.riskLevel === 'moderate'
                      ? 'text-amber-900'
                      : 'text-red-900'
                  }`}>
                    Risk Level: <span className="capitalize">{result.riskLevel}</span>
                  </h4>
                  <p className={`text-sm mt-1 ${
                    result.riskLevel === 'low'
                      ? 'text-green-800'
                      : result.riskLevel === 'moderate'
                      ? 'text-amber-800'
                      : 'text-red-800'
                  }`}>
                    {result.explanation}
                  </p>
                </div>
              </div>
            </Card>

            {/* Pain Predictions */}
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-4">Pain Risk Prediction</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Back Pain</span>
                    <span className="text-sm font-bold text-foreground">{result.backPain}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${result.backPain}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Neck Strain</span>
                    <span className="text-sm font-bold text-foreground">{result.neckStrain}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${result.neckStrain}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Headaches</span>
                    <span className="text-sm font-bold text-foreground">{result.headaches}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${result.headaches}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6 flex items-center justify-center h-full min-h-96 bg-secondary">
            <p className="text-center text-muted-foreground">
              Fill in the form and click &quot;Analyze Risk&quot; to see your health assessment.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
