import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Cloud, Globe, LogIn, LogOut, Menu, User as UserIcon, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.tsx'
import SignInModal from './SignInModal.tsx'
import { useAuth } from '../lib/auth-context.tsx'

export default function Header() {
  const { user, profile, isGuest, signOut, updateProfile } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)

  const currentLang = profile?.language || 'en'

  const toggleLanguage = async () => {
    const nextLang = currentLang === 'en' ? 'sw' : 'en'
    await updateProfile({ language: nextLang })
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 px-4 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
          {/* Brand Logo with Generic Cloud Icon */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2.5 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white shadow-md transition-transform group-hover:scale-105">
                <Cloud className="h-5 w-5 text-teal-200" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[var(--text-main)]">
                SomoPal
              </span>
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

          {/* Right Action Tools — Desktop: Sign In / Account only */}
          <div className="flex items-center gap-2.5">
            {user && !isGuest ? (
              <Link
                to="/app/settings"
                className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-900"
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
                Home
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

