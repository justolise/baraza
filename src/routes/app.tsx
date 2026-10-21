import { useEffect } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useAuth } from '../lib/auth-context.tsx'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const { user, isLoading, signInAsGuest } = useAuth()

  useEffect(() => {
    // If user accesses /app directly without a session, automatically create guest session
    if (!isLoading && !user) {
      void signInAsGuest()
    }
  }, [isLoading, user, signInAsGuest])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Outlet />
    </div>
  )
}
