import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Book, Loan } from '../../types'
import { formatDate } from '../receipt/createReceipt'
import { daysLeft, isOverdue } from './loanUtils'
import '../receipt/theme.css'
import './history.css'

interface Props {
  loan: Loan
  book?: Book
  /** Ruta del comprobante; por defecto /comprobante/:id */
  receiptPath?: string
  /** Botones extra (ej. "Registrar devolución" en el panel admin) */
  actions?: ReactNode
}

/** Tarjeta reutilizable de un préstamo (historial, activos o panel admin) */
export default function LoanCard({ loan, book, receiptPath, actions }: Props) {
  const overdue = isOverdue(loan)
  const left = daysLeft(loan)
  const devuelto = loan.estado === 'devuelto'
  const estadoClase = devuelto ? 'devuelto' : overdue ? 'vencido' : 'activo'
  const estadoTexto = devuelto ? 'Devuelto' : overdue ? 'Vencido' : 'Activo'

  return (
    <article className={`p3-loan-card ${estadoClase}`}>
      <header className="p3-loan-top">
        <div>
          <h3>{book?.titulo ?? 'Libro eliminado'}</h3>
          <p className="p3-loan-author">{book?.autor ?? '—'}</p>
        </div>
        <span className={`p3-badge ${estadoClase}`}>{estadoTexto}</span>
      </header>

      <dl className="p3-loan-dates">
        <div>
          <dt>Préstamo</dt>
          <dd>{formatDate(loan.fechaPrestamo)}</dd>
        </div>
        <div>
          <dt>Fecha límite</dt>
          <dd className={overdue ? 'p3-texto-rojo' : ''}>{formatDate(loan.fechaLimite)}</dd>
        </div>
        <div>
          <dt>Devolución</dt>
          <dd>{devuelto ? formatDate(loan.fechaDevolucion) : 'Pendiente'}</dd>
        </div>
      </dl>

      {!devuelto && (
        <p className={`p3-loan-aviso ${overdue ? 'rojo' : left <= 2 ? 'amarillo' : ''}`}>
          {overdue
            ? `Vencido hace ${Math.abs(left)} día(s)`
            : left === 0
              ? 'Vence hoy'
              : `Quedan ${left} día(s) para devolver`}
        </p>
      )}

      <footer className="p3-loan-foot">
        <code>{loan.codigo || 'Sin código'}</code>
        <div className="p3-loan-actions">
          {actions}
          <Link className="p3-btn sm borde" to={receiptPath ?? `/comprobante/${loan.id}`}>
            Ver comprobante
          </Link>
        </div>
      </footer>
    </article>
  )
}
