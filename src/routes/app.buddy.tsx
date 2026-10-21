import { createFileRoute } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/app/buddy')({
  component: BuddyPage,
})

function BuddyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
          <Sparkles className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            Baraza Study Buddy
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            AI study companion grounded in verified AZ-900 notes with African analogies
          </p>
        </div>
      </div>
      <div className="card-glass p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Study buddy chat loading...</p>
      </div>
    </div>
  )
}
