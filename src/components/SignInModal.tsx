import React, { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { X, Sparkles, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { signInWithGoogle, signInWithMagicLink, signInAsGuest, isGuest, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setMagicLinkSent(false)
      setErrorMessage(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleGoogle = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setErrorMessage(error.message)
        setIsSubmitting(false)
      }
    } catch {
      setErrorMessage('Google sign-in could not be initiated. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const { error } = await signInWithMagicLink(email.trim())
      if (error) {
        setErrorMessage(error.message)
      } else {
        setMagicLinkSent(true)
      }
    } catch {
      setErrorMessage('Could not send magic link. Please check your email and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuest = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await signInAsGuest()
      onClose()
      void router.navigate({ to: '/app' })
    } catch {
      setErrorMessage('Could not initiate guest session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card-glass relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in modal"
          className="absolute right-4 top-4 rounded-xl p-2 text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-main)] transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md">
            <Sparkles className="h-6 w-6 text-amber-300" />
          </div>
          <h2 id="signin-modal-title" className="font-display text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Sign in to SomoPal
          </h2>
          <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
            Save your quiz progress, track domain readiness scores, and sync study notes across devices.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Option 1: Google OAuth */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleGoogle()}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] py-3 px-4 text-sm font-semibold text-[var(--text-main)] shadow-xs transition hover:bg-[var(--bg-surface-elevated)] hover:border-amber-500 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
            <span className="absolute bg-[var(--bg-surface)] px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              or with email
            </span>
          </div>

          {/* Option 2: Email Magic Link */}
          {magicLinkSent ? (
            <div className="rounded-2xl border border-green-300 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950/40">
              <CheckCircle2 className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
              <p className="mt-2 text-sm font-bold text-green-900 dark:text-green-100">
                Magic Link Sent!
              </p>
              <p className="mt-1 text-xs text-green-800/90 dark:text-green-300">
                We sent an instant login link to <span className="font-semibold">{email}</span>. Click the link in your email to sign in.
              </p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="mt-3 text-xs font-semibold text-green-700 underline dark:text-green-300"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-2.5">
              <div className="relative">
                <input
                  id="modal-magic-email"
                  type="email"
                  required
                  placeholder="name@domain.africa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Send Magic Link</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Option 3: Continue as Guest (if not already logged in or guest) */}
          {(!user || isGuest) && (
            <>
              <div className="relative flex items-center justify-center pt-1">
                <div className="w-full border-t border-[var(--border-subtle)]" />
                <span className="absolute bg-[var(--bg-surface)] px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  or
                </span>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleGuest()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-transparent py-2.5 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-main)] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  {isGuest ? 'Continue exploring as Guest' : 'Try as Guest (no account required)'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
