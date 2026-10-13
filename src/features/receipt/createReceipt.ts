import { v4 as uuidv4 } from 'uuid'
import { KEYS, get, set } from '../../lib/storage'
import type { Book, Loan, User } from '../../types'
import type { Receipt } from './types'

/** Genera un código único legible: PRE-20261013-3F9A1C2B */
export function generateReceiptCode(existing: string[] = []): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  let code: string
  do {
    code = `PRE-${date}-${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`
  } while (existing.includes(code))
  return code
}

/** Arma el comprobante a partir del préstamo, el usuario y el libro */
export function buildReceipt(loan: Loan, user?: User, book?: Book): Receipt {
  return {
    code: loan.codigo ?? '',
    loanId: loan.id,
    userName: user ? `${user.nombres} ${user.apellidos}` : 'Usuario no encontrado',
    userCode: user?.codigo ?? '—',
    bookTitle: book?.titulo ?? 'Libro no encontrado',
    bookAuthor: book?.autor ?? '—',
    loanDate: loan.fechaPrestamo,
    dueDate: loan.fechaLimite,
    returnDate: loan.fechaDevolucion,
    status: loan.estado === 'devuelto' ? 'Devuelto' : 'Activo',
  }
}

const findRefs = (loan: Loan) => ({
  user: get<User[]>(KEYS.users, []).find((u) => u.id === loan.userId),
  book: get<Book[]>(KEYS.books, []).find((b) => b.id === loan.bookId),
})

/**
 * API pública de Persona 3.
 * Persona 2 la llama justo después de registrar el préstamo:
 *
 *   import { createLoanReceipt } from '../receipt/createReceipt'
 *   createLoanReceipt(loanId)
 *
 * - Genera un código único (uuid) y lo guarda en loan.codigo (KEYS.loans).
 * - Si el préstamo ya tenía código, lo respeta (no duplica).
 */
export function createLoanReceipt(loanId: string): Receipt | null {
  const loans = get<Loan[]>(KEYS.loans, [])
  const loan = loans.find((l) => l.id === loanId)
  if (!loan) return null

  if (loan.codigo) {
    const { user, book } = findRefs(loan)
    return buildReceipt(loan, user, book)
  }

  const updated: Loan = { ...loan, codigo: generateReceiptCode(loans.map((l) => l.codigo)) }
  set(KEYS.loans, loans.map((l) => (l.id === loanId ? updated : l)))
  window.dispatchEvent(new Event('storage-updated'))

  const { user, book } = findRefs(updated)
  return buildReceipt(updated, user, book)
}

/** Obtiene el comprobante de un préstamo con su estado actualizado */
export function getReceiptByLoanId(loanId: string): Receipt | null {
  const loan = get<Loan[]>(KEYS.loans, []).find((l) => l.id === loanId)
  if (!loan) return null
  if (!loan.codigo) return createLoanReceipt(loanId) // préstamos sin código
  const { user, book } = findRefs(loan)
  return buildReceipt(loan, user, book)
}

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'
