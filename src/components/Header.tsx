import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Globe, LogIn, Menu, User as UserIcon, X, Sparkles, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle.tsx'
import SignInModal from './SignInModal.tsx'
import { useAuth } from '../lib/auth-context.tsx'
import { useToast } from '../lib/toast-context.tsx'
import { useTranslation } from '../lib/i18n.ts'

export default function Header() {
  const { user, profile, isGuest, updateProfile, signOut } = useAuth()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)

  const currentLang = profile?.language || 'en'

  const toggleLanguage = async () => {
    const nextLang = currentLang === 'en' ? 'sw' : 'en'
    try {
      await updateProfile({ language: nextLang })
      toast.info(
        nextLang === 'sw'
          ? 'Lugha imebadilishwa kuwa Kiswahili (Swahili)'
          : 'Language switched to English',
        'Study Language'
      )
    } catch {
      toast.error('Could not update language preference')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 px-4 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-2.5">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs transition group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[var(--text-main)] transition-colors hover:text-teal-700 dark:hover:text-teal-300">
                SomoPal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation — Focused on core study tools */}
          <nav aria-label="Desktop Navigation" className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link
              to="/app/buddy"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
              activeProps={{ className: 'font-bold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
            >
              {t('nav.buddy')}
            </Link>
            <Link
              to="/app/topics"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
              activeProps={{ className: 'font-bold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
            >
              {t('nav.topics')}
            </Link>
            <Link
              to="/app/quiz"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
              activeProps={{ className: 'font-bold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
            >
              {t('nav.quiz')}
            </Link>
            <Link
              to="/app/readiness"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
              activeProps={{ className: 'font-bold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
            >
              {t('nav.readiness')}
            </Link>
            <Link
              to="/app/history"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
              activeProps={{ className: 'font-bold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
            >
              {t('nav.history')}
            </Link>
          </nav>

          {/* Right Action Tools — Desktop controls */}
          <div className="flex items-center gap-2">
            {/* Quick Language switch */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={`Switch language (current: ${currentLang.toUpperCase()})`}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-main)]"
            >
              <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>{currentLang === 'en' ? 'EN' : 'SW'}</span>
            </button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {user && !isGuest ? (
              <Link
                to="/app/settings"
                className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-900"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>{profile?.display_name || 'Learner'}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-800 focus:outline-hidden"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[var(--border-subtle)] pb-5 pt-3 md:hidden space-y-4">
            {/* User status in mobile menu */}
            <div className="px-3 pb-2">
              {user && !isGuest ? (
                <div className="flex items-center justify-between rounded-xl bg-[var(--primary-light)] p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-white font-bold text-xs">
                      {(profile?.display_name || 'L')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-main)]">
                        {profile?.display_name || 'Learner'}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">Signed in account</p>
                    </div>
                  </div>
                  <Link
                    to="/app/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-teal-700 dark:text-teal-300"
                  >
                    Settings
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSignInModalOpen(true)
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign in / Create Account</span>
                </button>
              )}
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-1 px-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/app/buddy"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.buddy')}
              </Link>
              <Link
                to="/app/topics"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.topics')}
              </Link>
              <Link
                to="/app/quiz"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.quiz')}
              </Link>
              <Link
                to="/app/readiness"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.readiness')}
              </Link>
              <Link
                to="/app/history"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.history')}
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
              >
                {t('nav.settings')}
              </Link>
            </nav>

            {/* Transferred Actions: Language, Theme, & Logout */}
            <div className="border-t border-[var(--border-subtle)] px-3 pt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  title={currentLang === 'en' ? 'Switch to Swahili' : 'Switch to English'}
                  aria-label={currentLang === 'en' ? 'Switch to Swahili' : 'Switch to English'}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-amber-500 hover:bg-[var(--accent-light)]"
                >
                  <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{currentLang === 'en' ? 'EN (English)' : 'SW (Swahili)'}</span>
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />
              </div>

              {/* Logout button (if signed in) */}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    void signOut()
                  }}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sign In Modal */}
      <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
    </>
  )
}

