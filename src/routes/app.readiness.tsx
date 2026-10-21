import { createFileRoute } from '@tanstack/react-router'
import { Award } from 'lucide-react'

export const Route = createFileRoute('/app/readiness')({
  component: ReadinessPage,
})

function ReadinessPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white">
          <Award className="h-5 w-5 text-teal-200" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            Readiness Tracker
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Recency-weighted domain mastery, coverage, and countdown pace
          </p>
        </div>
      </div>
      <div className="card-glass p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Readiness analytics loading...</p>
      </div>
    </div>
  )
}
