import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void
  removeToast: (id: string) => void
  toast: {
    success: (message: string, title?: string, duration?: number) => void
    error: (message: string, title?: string, duration?: number) => void
    info: (message: string, title?: string, duration?: number) => void
    warning: (message: string, title?: string, duration?: number) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { id, type, message, title, duration }

      setToasts((prev) => [...prev.slice(-4), newToast]) // keep max 5 at once to avoid screen flooding

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const toast = useMemo(
    () => ({
      success: (message: string, title?: string, duration?: number) =>
        showToast('success', message, title, duration),
      error: (message: string, title?: string, duration?: number) =>
        showToast('error', message, title, duration),
      info: (message: string, title?: string, duration?: number) =>
        showToast('info', message, title, duration),
      warning: (message: string, title?: string, duration?: number) =>
        showToast('warning', message, title, duration),
    }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex max-w-sm w-full flex-col gap-2.5 px-3 sm:px-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </div>
  )
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: () => void
}) {
  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      defaultTitle: 'Success',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/20 dark:border-rose-500/30',
      defaultTitle: 'Error',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/20 dark:border-amber-500/30',
      defaultTitle: 'Warning',
    },
    info: {
      icon: Info,
      iconColor: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
      border: 'border-teal-500/20 dark:border-teal-500/30',
      defaultTitle: 'Notice',
    },
  }[item.type]

  const IconComponent = config.icon

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border ${config.border} bg-[var(--bg-surface)] p-3.5 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
      style={{
        boxShadow:
          '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className={`mt-0.5 rounded-lg p-1 shrink-0 ${config.badgeBg}`}>
        <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        {item.title && (
          <p className="text-xs font-bold leading-snug text-[var(--text-main)]">
            {item.title}
          </p>
        )}
        <p className="text-xs leading-relaxed text-[var(--text-muted)] line-clamp-3">
          {item.message}
        </p>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Close notification"
        className="rounded-lg p-1 text-[var(--text-muted)] opacity-70 transition hover:bg-[var(--border-subtle)] hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
