// Mobile Bottom Navigation Bar for SomoPal
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Sparkles, BookOpen, CheckSquare, Award } from 'lucide-react'

export default function MobileBottomNav() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const navItems = [
    { label: 'Home', to: '/app', icon: Home, exact: true },
    { label: 'Buddy', to: '/app/buddy', icon: Sparkles },
    { label: 'Topics', to: '/app/topics', icon: BookOpen },
    { label: 'Quiz', to: '/app/quiz', icon: CheckSquare },
    { label: 'Readiness', to: '/app/readiness', icon: Award },
  ]

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return currentPath === to
    return currentPath === to || currentPath.startsWith(`${to}/`)
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-2 py-2 backdrop-blur-md md:hidden"
    >
      {navItems.map((item) => {
        const active = isActive(item.to, item.exact)
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'text-teal-600 dark:text-teal-400 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform ${
                active
                  ? 'bg-teal-50 dark:bg-teal-950/60 scale-110 shadow-xs'
                  : ''
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
