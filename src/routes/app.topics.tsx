import { createFileRoute } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

export const Route = createFileRoute('/app/topics')({
  component: TopicsPage,
})

function TopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
          <BookOpen className="h-5 w-5 text-teal-200" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            AZ-900 Topic Catalog
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            31 syllabus topics across Cloud Concepts, Architecture, and Management
          </p>
        </div>
      </div>
      <div className="card-glass p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Topics loading...</p>
      </div>
    </div>
  )
}
