import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/quiz/$quizId')({
  component: QuizActivePage,
})

function QuizActivePage() {
  const { quizId } = Route.useParams()

  return (
    <div className="space-y-6">
      <div className="card-glass p-8">
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
          Quiz Session: {quizId}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Loading questions...
        </p>
      </div>
    </div>
  )
}
