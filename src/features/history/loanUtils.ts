import type { Loan } from '../../types'

export const isOverdue = (loan: Loan) => loan.estado === 'activo' && new Date(loan.fechaLimite) < new Date()

export function daysLeft(loan: Loan): number {
  const ms = new Date(loan.fechaLimite).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
  return Math.round(ms / 86_400_000)
}

/** Obtiene el id del usuario logueado, sea que la sesión guarde el id o el objeto User */
export function getSessionUserId(session: unknown): string | undefined {
  if (typeof session === 'string') return session
  if (session && typeof session === 'object' && 'id' in session) return String((session as { id: unknown }).id)
  return undefined
}
