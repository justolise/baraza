import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const { user, signInAsGuest, signInWithGoogle, signInWithMagicLink } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGuestEntry = async () => {
    setIsSubmitting(true)
    setAuthError(null)
    try {
      await signInAsGuest()
      void router.navigate({ to: '/app' })
    } catch {
      setAuthError('Could not start guest session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setAuthError(null)
    try {
      const { error } = await signInWithMagicLink(email.trim())
      if (error) {
        setAuthError(error.message)
      } else {
        setMagicLinkSent(true)
      }
    } catch {
      setAuthError('Failed to send magic link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-16 py-8 md:gap-24 md:py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Unofficial Banner */}
        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50/90 px-4 py-2 text-center text-xs font-semibold text-amber-900 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Unofficial: not affiliated with or endorsed by Microsoft. Generic cloud icons used.
          </span>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 shadow-xs dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>AI Study Buddy & Readiness Tracker for African Learners</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-6xl sm:leading-tight">
            Pass the <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-teal-300 dark:to-amber-400">AZ-900 Azure</span> Exam with Relatable Everyday Analogies.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Say goodbye to dry technical jargon. Master cloud concepts through Nairobi matatus, M-Pesa float, SACCO governance, and prepaid KPLC tokens. Grounded notes, original practice quizzes, and an actionable readiness score.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {user ? (
              <Link
                to="/app"
                className="flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-teal-700/20"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGuestEntry}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-teal-700/20 sm:w-auto disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{isSubmitting ? 'Starting Session...' : 'Try as Guest (Instant Access)'}</span>
                </button>
                <Link
                  to="/app/topics"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-main)] shadow-xs transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-elevated)] sm:w-auto"
                >
                  <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Explore Study Notes (31 Topics)</span>
                </Link>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              100% Original questions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              English & Swahili
            </span>
          </div>
        </div>
      </section>

      {/* The 3-Step Learning Loop Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            The SomoPal Pedagogy
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
            A Three-Part Feedback Loop
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-muted)]">
            Proven cognitive cycle: Explain the theory with contextual anchors, Test understanding with active recall, and Measure exam readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1: Explain */}
          <div className="card-glass relative flex flex-col justify-between overflow-hidden p-6 sm:p-8">
            <div className="absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-teal-500/10 text-4xl font-extrabold text-teal-600/20 dark:text-teal-400/20">
              1
            </div>
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md">
                <Sparkles className="h-6 w-6 text-amber-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
                1. Explain: Baraza AI Buddy
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Ask Baraza any cloud question. Every explanation is strictly grounded in official notes and formatted into 4 distinct cards: <strong>Simple</strong>, <strong>Analogy</strong>, <strong>Exam Definition</strong>, and <strong>Watch Out</strong>.
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs">
              <span className="font-semibold text-teal-700 dark:text-teal-300">Grounding Chips:</span>
              <p className="mt-1 text-[var(--text-muted)]">Cites retrieved study notes so you know the exact source without AI hallucinations.</p>
            </div>
          </div>

          {/* Step 2: Test */}
          <div className="card-glass relative flex flex-col justify-between overflow-hidden p-6 sm:p-8">
            <div className="absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/10 text-4xl font-extrabold text-amber-600/20 dark:text-amber-400/20">
              2
            </div>
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md">
                <HelpCircle className="h-6 w-6 text-amber-100" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
                2. Test: Original AI Quizzes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Generate tailored multiple-choice quizzes on any topic. Choose Practice mode (immediate feedback after every question) or Test mode (timed exam rehearsal).
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs">
              <span className="font-semibold text-amber-700 dark:text-amber-300">Option-by-Option Breakdown:</span>
              <p className="mt-1 text-[var(--text-muted)]">Detailed rationale explaining why the correct choice is right and why each distractor is wrong.</p>
            </div>
          </div>

          {/* Step 3: Measure */}
          <div className="card-glass relative flex flex-col justify-between overflow-hidden p-6 sm:p-8">
            <div className="absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-teal-500/10 text-4xl font-extrabold text-teal-600/20 dark:text-teal-400/20">
              3
            </div>
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-md">
                <TrendingUp className="h-6 w-6 text-teal-200" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-main)]">
                3. Measure: Readiness Score
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                A mathematical readiness score powered by recency-weighted mastery and coverage. Identifies weak topics and recommends top 3 next-up study priorities.
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs">
              <span className="font-semibold text-teal-700 dark:text-teal-300">Exam Countdown:</span>
              <p className="mt-1 text-[var(--text-muted)]">Paces your revision with a daily recommended target of topics before test day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* African Analogies Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-teal-900/10 via-[var(--bg-surface)] to-amber-900/10 p-8 sm:p-12">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Real Life Context
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
              How African Analogies Clarify Cloud Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs">
              <div className="text-xs font-bold uppercase text-teal-700 dark:text-teal-400">
                Shared Responsibility
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[var(--text-main)]">
                Nairobi Apartment Renting
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                The landlord maintains the physical gates and roof (Microsoft), but locking your door and safeguarding your personal items is 100% your duty (Customer).
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs">
              <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                Elastic Scaling
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[var(--text-main)]">
                Rush Hour Matatus
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                A SACCO adds 5 extra 14-seater vans at 6 PM rush hour (horizontal scale-out), and parks them when midnight arrives to prevent wasted fuel (scale-in).
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs">
              <div className="text-xs font-bold uppercase text-teal-700 dark:text-teal-400">
                Consumption Pricing
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[var(--text-main)]">
                Prepaid KPLC Tokens
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                Instead of buying a heavy diesel generator upfront (CapEx), you buy prepaid power units weekly and pay only for the exact kilowatt-hours consumed (OpEx).
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs">
              <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                Azure RBAC
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[var(--text-main)]">
                SACCO Committee Roles
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                The Chairman signs checks and approves members (Owner), Treasurer deposits funds (Contributor), and regular members only view balances (Reader).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth & Getting Started Box */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="card-glass p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            <Zap className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
            Ready to Begin Your AZ-900 Journey?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">
            Start right now with 1-click guest access, or sign in with Google or a magic link to persist your quiz scores across devices.
          </p>

          <div className="mx-auto mt-8 max-w-sm space-y-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGuestEntry}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{isSubmitting ? 'Loading...' : 'Try as Guest (No Registration)'}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void signInWithGoogle()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-main)] shadow-xs transition hover:bg-[var(--bg-surface-elevated)] disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-2 pt-2 text-left">
              <label htmlFor="magic-email" className="block text-xs font-semibold text-[var(--text-muted)]">
                Or sign in via Email Magic Link
              </label>
              <div className="flex gap-2">
                <input
                  id="magic-email"
                  type="email"
                  placeholder="you@domain.africa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2 text-sm text-[var(--text-main)] focus:border-teal-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="rounded-xl bg-[var(--border-strong)] px-4 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-teal-700 hover:text-white disabled:opacity-50"
                >
                  Send
                </button>
              </div>
              {magicLinkSent && (
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  Magic link sent! Check your email inbox to sign in.
                </p>
              )}
              {authError && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {authError}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
