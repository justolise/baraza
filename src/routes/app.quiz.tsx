import { createFileRoute } from '@tanstack/react-router'
import { CheckSquare } from 'lucide-react'

export const Route = createFileRoute('/app/quiz')({
  component: QuizHubPage,
})

function QuizHubPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white">
          <CheckSquare className="h-5 w-5 text-amber-100" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            AZ-900 Quiz Center
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Original AI-generated multiple-choice questions with option-by-option rationale
          </p>
        </div>
      </div>
      <div className="card-glass p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Quiz center loading...</p>
      </div>
    </div>
  )
}
