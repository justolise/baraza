import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LogIn,
  MessageSquare,
  HelpCircle,
  Award,
} from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'
import { useTranslation } from '../lib/i18n.ts'
import SignInModal from '../components/SignInModal.tsx'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const { user, profile, isGuest, signInAsGuest } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)

  const handleGuestEntry = async () => {
    setIsSubmitting(true)
    try {
      await signInAsGuest()
      void router.navigate({ to: '/app' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayName = profile?.display_name || (isGuest ? 'Guest Learner' : 'Learner')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Hero Section */}
      <div className="text-center">
        {/* Top Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-xs dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{t('home.hero_badge')}</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-6xl sm:leading-tight">
          {t('home.hero_title_prefix')}{' '}
          <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-teal-300 dark:to-amber-400">
            {t('home.hero_title_highlight')}
          </span>{' '}
          {t('home.hero_title_suffix')}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          {t('home.hero_desc')}
        </p>

        {/* Conditional Content based on Auth State */}
        {user ? (
          /* LOGGED IN / GUEST USER: No join requests, clean direct access */
          <div className="mt-10 space-y-8">
            <div className="mx-auto max-w-md rounded-2xl border border-teal-200 bg-teal-50/70 p-6 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/30">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>{t('home.active_session')}</span>
              </div>
              <p className="mt-2 text-lg font-bold text-[var(--text-main)]">
                {t('home.welcome_back')} {displayName}!
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/app"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800"
                >
                  <span>{t('home.continue_dash')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/app/buddy"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3 text-sm font-semibold text-[var(--text-main)] shadow-xs transition hover:bg-[var(--bg-surface-elevated)]"
                >
                  <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>{t('home.ask_buddy')}</span>
                </Link>
              </div>
            </div>

            {/* Quick 3-Pillar Access for Logged-In Learner */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
              <Link
                to="/app/buddy"
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-teal-500 hover:shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--text-main)]">
                  {t('nav.buddy')}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {t('dash.card1.desc')}
                </p>
              </Link>

              <Link
                to="/app/quiz"
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-amber-500 hover:shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <HelpCircle className="h-5 w-5 text-amber-100" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--text-main)]">
                  {t('nav.quiz')}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {t('dash.card2.desc')}
                </p>
              </Link>

              <Link
                to="/app/readiness"
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-teal-500 hover:shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Award className="h-5 w-5 text-teal-200" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--text-main)]">
                  {t('nav.readiness')}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {t('dash.card3.desc')}
                </p>
              </Link>
            </div>
          </div>
        ) : (
          /* NOT SIGNED IN: Clean, focused entry actions without clutter or exposed deep contents */
          <div className="mt-10 space-y-6">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGuestEntry}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800 sm:w-auto disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>{isSubmitting ? 'Starting Session…' : t('home.try_guest')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-main)] shadow-xs transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-elevated)] sm:w-auto"
              >
                <LogIn className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>{t('home.sign_in')}</span>
              </button>
            </div>

            {/* Clean Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t('home.no_cc')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t('home.original_q')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t('home.bilingual')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
    </div>
  )
}
