import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Settings, Globe, Calendar, User, Zap, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'
import {
  generateSampleProgress,
  saveAnswerHistory,
  clearAnswerHistory,
} from '../lib/demo-data.ts'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { profile, updateProfile, isGuest } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [examDate, setExamDate] = useState(profile?.exam_date || '')
  const [language, setLanguage] = useState<'en' | 'sw'>(profile?.language || 'en')
  const [isSaved, setIsSaved] = useState(false)
  const [demoMessage, setDemoMessage] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({
      display_name: displayName.trim() || 'Learner',
      exam_date: examDate || null,
      language,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleLoadDemo = () => {
    const sample = generateSampleProgress()
    saveAnswerHistory(sample)
    setDemoMessage('Sample progress loaded! Check the Readiness page.')
    setTimeout(() => setDemoMessage(null), 4000)
  }

  const handleClearDemo = () => {
    clearAnswerHistory()
    setDemoMessage('Progress history reset successfully.')
    setTimeout(() => setDemoMessage(null), 4000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
          <Settings className="h-5 w-5 text-teal-200" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            Preferences & Settings
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Customize your language, exam target date, and study profile
          </p>
        </div>
      </div>

      <div className="card-glass p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="name-input" className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Learner Name</span>
            </label>
            <input
              id="name-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Kwame or Zawadi"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-main)] focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Language Toggle */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Study Language Preference</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  language === 'en'
                    ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="font-bold">English (Default)</div>
                <div className="mt-0.5 text-xs opacity-80">Official exam terminology</div>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('sw')}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  language === 'sw'
                    ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="font-bold">Kiswahili</div>
                <div className="mt-0.5 text-xs opacity-80">Maelezo na mifano ya Kiswahili</div>
              </button>
            </div>
          </div>

          {/* Exam Target Date */}
          <div className="space-y-1.5">
            <label htmlFor="date-input" className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Exam Target Date</span>
            </label>
            <input
              id="date-input"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-main)] focus:border-teal-500 focus:outline-hidden"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Sets your countdown timer and calculates how many topics to cover each day.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800"
            >
              Save Preferences
            </button>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <Check className="h-4 w-4" /> Preferences saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Demo Data Controls */}
      <div className="card-glass p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold">Demo Mode & Progress Data</h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Populate realistic sample quiz attempts across all 3 domains to explore the readiness charts, mastery rings, and study recommendations.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="flex items-center gap-2 rounded-xl border border-teal-600 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-200"
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Load Sample Progress</span>
          </button>
          <button
            type="button"
            onClick={handleClearDemo}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-red-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Progress</span>
          </button>
          {demoMessage && (
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
              {demoMessage}
            </span>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
          <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Account Status: {isGuest ? 'Guest Anonymous Account' : 'Authenticated User'}</span>
        </div>
        <p className="mt-1 leading-relaxed">
          {isGuest
            ? 'You are studying as a guest. All progress is kept in your current browser session. Sign in with Google or magic link anytime to preserve your scores permanently.'
            : 'Your profile and quiz history are securely synced with Supabase row-level security.'}
        </p>
      </div>
    </div>
  )
}

