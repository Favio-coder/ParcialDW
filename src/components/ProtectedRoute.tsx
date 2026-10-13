import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../lib/routes'
import type { Session } from '../features/users/types'

interface ProtectedRouteProps {
  session: Session | null
  requiredRole: Session['role']
  children: ReactNode
}

export function ProtectedRoute({ session, requiredRole, children }: ProtectedRouteProps) {
  if (!session) return <Navigate to={ROUTES.login} replace />
  if (session.role !== requiredRole) {
    return <Navigate to={session.role === 'admin' ? ROUTES.adminUsers : ROUTES.catalog} replace />
  }
  return children
}
