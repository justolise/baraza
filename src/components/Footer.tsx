// Footer component for SomoPal
import { Link } from '@tanstack/react-router'
import { Heart, BookOpen } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 pb-20 pt-12 text-sm text-[var(--text-muted)] md:pb-12">
      <div className="mx-auto max-w-7xl">

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-[var(--text-main)]">SomoPal</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your AI study buddy for AZ-900, grounded in everyday African analogies and structured learning loops.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Study Loop
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/app/buddy" className="hover:text-teal-700 dark:hover:text-teal-300">
                  1. Explain: Baraza AI Chat
                </Link>
              </li>
              <li>
                <Link to="/app/quiz" className="hover:text-teal-700 dark:hover:text-teal-300">
                  2. Test: AI Quizzes
                </Link>
              </li>
              <li>
                <Link to="/app/readiness" className="hover:text-teal-700 dark:hover:text-teal-300">
                  3. Measure: Readiness Score
                </Link>
              </li>
              <li>
                <Link to="/app/topics" className="hover:text-teal-700 dark:hover:text-teal-300">
                  Topic Catalog (31 topics)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Exam Domains
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[var(--text-muted)]">Domain 1: Cloud Concepts (28%)</span>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Domain 2: Architecture & Services (37%)</span>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Domain 3: Management & Governance (35%)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Official Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Microsoft Learn AZ-900</span>
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-700 dark:hover:text-teal-300">
                  About SomoPal & Pedagogy
                </Link>
              </li>
              <li>
                <Link to="/app/settings" className="hover:text-teal-700 dark:hover:text-teal-300">
                  Settings & Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 text-xs sm:flex-row">
          <p className="flex items-center gap-1">
            <span>Built with care for African cloud engineers</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          </p>
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Unofficial: not affiliated with or endorsed by Microsoft. &copy; {year} SomoPal
          </p>
        </div>
      </div>
    </footer>
  )
}
