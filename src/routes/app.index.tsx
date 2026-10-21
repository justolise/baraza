// App Home Dashboard for SomoPal
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  ArrowRight,
  Compass,
} from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'

export const Route = createFileRoute('/app/')({
  component: AppDashboard,
})

function getTimeGreeting(language: 'en' | 'sw'): { greeting: string; subGreeting: string } {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return language === 'sw'
      ? { greeting: 'Habari za Asubuhi', subGreeting: 'Good morning! Ready for today’s cloud study?' }
      : { greeting: 'Good Morning', subGreeting: 'Habari za asubuhi! Let’s build your Azure skills today.' }
  } else if (hour >= 12 && hour < 17) {
    return language === 'sw'
      ? { greeting: 'Habari za Mchana', subGreeting: 'Good afternoon! Keep up the revision momentum.' }
      : { greeting: 'Good Afternoon', subGreeting: 'Habari za mchana! Time for a quick quiz session.' }
  } else if (hour >= 17 && hour < 22) {
    return language === 'sw'
      ? { greeting: 'Habari za Jioni', subGreeting: 'Good evening! Wind down with an AI study chat.' }
      : { greeting: 'Good Evening', subGreeting: 'Habari za jioni! Review your daily topic progress.' }
  } else {
    return language === 'sw'
      ? { greeting: 'Habari za Usiku', subGreeting: 'Late night revision! Keep focused and rest well.' }
      : { greeting: 'Late Night Study', subGreeting: 'Habari za usiku! Steady preparation builds mastery.' }
  }
}

function AppDashboard() {
  const { profile, isGuest } = useAuth()
  const language = profile?.language || 'en'
  const { greeting, subGreeting } = getTimeGreeting(language)

  const displayName = profile?.display_name || (isGuest ? 'Learner (Guest)' : 'Learner')

  // Calculate days to exam if set
  let daysToExam: number | null = null
  if (profile?.exam_date) {
    const examDate = new Date(profile.exam_date)
    const today = new Date()
    const diffTime = examDate.getTime() - today.getTime()
    daysToExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="space-y-8">
      {/* Time-Aware Greeting Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
              {greeting}, {displayName}!
            </h1>
            {isGuest && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                Guest Mode
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subGreeting}</p>
        </div>

        {/* Exam Countdown or Schedule Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/settings"
            className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-main)] shadow-xs hover:border-[var(--border-strong)]"
          >
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              {daysToExam !== null ? `${daysToExam} days to exam` : 'Set exam target date'}
            </span>
          </Link>
        </div>
      </div>

      {/* Primary Study Loop Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Study Buddy */}
        <Link
          to="/app/buddy"
          className="card-glass card-interactive group flex flex-col justify-between p-6"
        >
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md transition-transform group-hover:scale-105">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              1. Explain
            </span>
            <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
              Ask Buddy Baraza
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Grounded AI answers structured into Simple, African Analogy, Exam Definition, and Watch Out cards.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span>Start studying</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Practice Quiz */}
        <Link
          to="/app/quiz"
          className="card-glass card-interactive group flex flex-col justify-between p-6"
        >
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md transition-transform group-hover:scale-105">
              <CheckSquare className="h-6 w-6 text-amber-100" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              2. Test
            </span>
            <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
              Take Practice Quiz
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Original multiple-choice questions with per-option feedback. Test your knowledge across all 3 domains.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Launch quiz engine</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 3: Readiness Tracker */}
        <Link
          to="/app/readiness"
          className="card-glass card-interactive group flex flex-col justify-between p-6"
        >
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-md transition-transform group-hover:scale-105">
              <Award className="h-6 w-6 text-teal-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              3. Measure
            </span>
            <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
              Readiness Score
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              View your overall exam readiness score, domain weight breakdowns, and top weak topics to practice next.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span>View score breakdown</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Secondary Quick Jump Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          to="/app/topics"
          className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                Topic Catalog
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Browse all 31 AZ-900 exam topics and grounded study notes
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
        </Link>

        <Link
          to="/app/settings"
          className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-main)]">
                Preferences & Demo Mode
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Toggle Swahili, set your exam date, or load sample progress
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
        </Link>
      </div>
    </div>
  )
}
