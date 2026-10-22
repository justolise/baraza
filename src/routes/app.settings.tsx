import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Settings, Globe, Calendar, User, Zap, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'
import { useToast } from '../lib/toast-context.tsx'
import { useTranslation } from '../lib/i18n.ts'
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
  const { toast } = useToast()
  const { t, language: activeLang } = useTranslation()

  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [examDate, setExamDate] = useState(profile?.exam_date || '')
  const [language, setLanguage] = useState<'en' | 'sw'>(profile?.language || 'en')
  const [isSaved, setIsSaved] = useState(false)
  const [demoMessage, setDemoMessage] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.language) {
      setLanguage(profile.language)
    }
  }, [profile?.language])

  const handleLanguageChange = async (newLang: 'en' | 'sw') => {
    setLanguage(newLang)
    try {
      await updateProfile({ language: newLang })
      toast.info(
        newLang === 'sw'
          ? 'Lugha imebadilishwa kuwa Kiswahili (Swahili)'
          : 'Language switched to English',
        'Study Language'
      )
    } catch {
      toast.error('Could not update language preference')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        display_name: displayName.trim() || 'Learner',
        exam_date: examDate || null,
        language,
      })
      setIsSaved(true)
      toast.success(
        language === 'sw'
          ? 'Mipangilio yako imehifadhiwa kikamilifu!'
          : 'Your preferences have been saved successfully!',
        'Settings Saved'
      )
      setTimeout(() => setIsSaved(false), 3000)
    } catch {
      toast.error(
        language === 'sw'
          ? 'Haikuweza kuhifadhi mipangilio. Tafadhali jaribu tena.'
          : 'Could not save your preferences. Please try again.'
      )
    }
  }

  const handleLoadDemo = () => {
    const sample = generateSampleProgress()
    saveAnswerHistory(sample)
    toast.success(
      language === 'sw'
        ? 'Data ya mfano imewekwa! Angalia ukurasa wa Utayari.'
        : 'Sample readiness progress loaded! Check the Readiness tracker.',
      'Demo Data'
    )
    setDemoMessage(
      language === 'sw'
        ? 'Data ya mfano imewekwa! Angalia ukurasa wa Utayari.'
        : 'Sample progress loaded! Check the Readiness page.'
    )
    setTimeout(() => setDemoMessage(null), 4000)
  }

  const handleClearDemo = () => {
    clearAnswerHistory()
    toast.info(
      language === 'sw'
        ? 'Data ya utayari na majibu imefutwa.'
        : 'Answer and progress history have been reset.',
      'Reset Complete'
    )
    setDemoMessage(
      language === 'sw'
        ? 'Historia ya maendeleo imefutwa.'
        : 'Progress history reset successfully.'
    )
    setTimeout(() => setDemoMessage(null), 4000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
          <Settings className="h-5 w-5 text-teal-200" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
            {t('settings.title')}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            {t('settings.subtitle')}
          </p>
        </div>
      </div>

      <div className="card-glass p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="name-input" className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>{t('settings.name')}</span>
            </label>
            <input
              id="name-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={language === 'sw' ? 'mfano: Kwame au Zawadi' : 'e.g. Kwame or Zawadi'}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-main)] focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Language Toggle */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>{t('settings.lang_pref')}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void handleLanguageChange('en')}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  language === 'en'
                    ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="font-bold">{t('settings.lang_en')}</div>
                <div className="mt-0.5 text-xs opacity-80">{t('settings.lang_en_sub')}</div>
              </button>
              <button
                type="button"
                onClick={() => void handleLanguageChange('sw')}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  language === 'sw'
                    ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-200'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="font-bold">{t('settings.lang_sw')}</div>
                <div className="mt-0.5 text-xs opacity-80">{t('settings.lang_sw_sub')}</div>
              </button>
            </div>
          </div>

          {/* Exam Target Date */}
          <div className="space-y-1.5">
            <label htmlFor="date-input" className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
              <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>{t('settings.exam_date')}</span>
            </label>
            <input
              id="date-input"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-main)] focus:border-teal-500 focus:outline-hidden"
            />
            <p className="text-xs text-[var(--text-muted)]">
              {t('settings.exam_date_sub')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800"
            >
              {t('settings.save')}
            </button>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <Check className="h-4 w-4" /> {t('settings.saved')}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Demo Data Controls */}
      <div className="card-glass p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold">{t('settings.demo_title')}</h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('settings.demo_desc')}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="flex items-center gap-2 rounded-xl border border-teal-600 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-200"
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span>{t('settings.demo_load')}</span>
          </button>
          <button
            type="button"
            onClick={handleClearDemo}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-red-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('settings.demo_reset')}</span>
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
          <span>
            {t('settings.account')}:{' '}
            {isGuest
              ? (activeLang === 'sw' ? 'Akaunti ya Mgeni (Bila Kujisajili)' : 'Guest Anonymous Account')
              : (activeLang === 'sw' ? 'Mtumiaji Aliyesajiliwa' : 'Authenticated User')}
          </span>
        </div>
        <p className="mt-1 leading-relaxed">
          {isGuest
            ? (activeLang === 'sw'
                ? 'Unasoma kama mgeni. Maendeleo yote yanahifadhiwa kwenye kivinjari chako cha sasa. Ingia wakati wowote kwa Google au kiungo cha barua pepe ili kuhifadhi alama zako daima.'
                : 'You are studying as a guest. All progress is kept in your current browser session. Sign in with Google or magic link anytime to preserve your scores permanently.')
            : (activeLang === 'sw'
                ? 'Wasifu wako na historia ya majaribio inahifadhiwa salama kwenye Supabase kwa usalama wa kiwango cha juu.'
                : 'Your profile and quiz history are securely synced with Supabase row-level security.')}
        </p>
      </div>
    </div>
  )
}
