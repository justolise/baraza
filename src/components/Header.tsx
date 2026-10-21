import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Cloud, Globe, LogOut, Menu, User as UserIcon, X, Sparkles } from 'lucide-react'
import ThemeToggle from './ThemeToggle.tsx'
import { useAuth } from '../lib/auth-context.tsx'

export default function Header() {
  const { user, profile, isGuest, signOut, signInAsGuest, updateProfile } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const currentLang = profile?.language || 'en'

  const toggleLanguage = async () => {
    const nextLang = currentLang === 'en' ? 'sw' : 'en'
    await updateProfile({ language: nextLang })
  }

  const handleGuestEntry = async () => {
    setIsSigningIn(true)
    try {
      await signInAsGuest()
      void router.navigate({ to: '/app' })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 px-4 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
        {/* Brand Logo with Generic Cloud Icon */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2.5 no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white shadow-md transition-transform group-hover:scale-105">
              <Cloud className="h-5 w-5 text-teal-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-[var(--text-main)]">
                SomoPal
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Unofficial AZ-900
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            About
          </Link>
          <Link
            to="/app"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Dashboard
          </Link>
          <Link
            to="/app/buddy"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Buddy
          </Link>
          <Link
            to="/app/topics"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Topics
          </Link>
          <Link
            to="/app/quiz"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Quiz
          </Link>
          <Link
            to="/app/readiness"
            className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-light)] hover:text-teal-700 dark:hover:text-teal-300"
            activeProps={{ className: 'font-semibold text-teal-700 dark:text-teal-300 bg-[var(--primary-light)]' }}
          >
            Readiness
          </Link>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Swahili / English Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={currentLang === 'en' ? 'Switch to Swahili' : 'Switch to English'}
            aria-label={currentLang === 'en' ? 'Switch to Swahili' : 'Switch to English'}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-amber-500 hover:bg-[var(--accent-light)]"
          >
            <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>{currentLang === 'en' ? 'EN' : 'SW'}</span>
          </button>

          <ThemeToggle />

          {/* User Status / Login / Guest entry */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/app/settings"
                className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300"
              >
                <UserIcon className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {profile?.display_name || (isGuest ? 'Guest' : 'Learner')}
                </span>
                {isGuest && (
                  <span className="rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    Guest
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                title="Sign out"
                aria-label="Sign out"
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleGuestEntry}
              className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-hidden disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-200" />
              <span>{isSigningIn ? 'Loading...' : 'Try as guest'}</span>
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
        <div className="border-t border-[var(--border-subtle)] pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Home (Landing)
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              About SomoPal
            </Link>
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Dashboard
            </Link>
            <Link
              to="/app/buddy"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Study Buddy (Baraza)
            </Link>
            <Link
              to="/app/topics"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Topics Browser
            </Link>
            <Link
              to="/app/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Practice Quizzes
            </Link>
            <Link
              to="/app/readiness"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Readiness Tracker
            </Link>
            <Link
              to="/app/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary-light)]"
            >
              Settings & Preferences
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
