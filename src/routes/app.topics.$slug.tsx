import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/topics/$slug')({
  component: TopicDetailPage,
})

function TopicDetailPage() {
  const { slug } = Route.useParams()

  return (
    <div className="space-y-6">
      <div className="card-glass p-8">
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
          Topic: {slug}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Loading topic study notes and African analogies...
        </p>
      </div>
    </div>
  )
}
