import { useMemo, useState } from 'react'
import { KEYS, get } from '../../lib/storage'
import LoanCard from './LoanCard'
import { getSessionUserId, isOverdue } from './loanUtils'
import { useUserLoans } from './useUserLoans'
import '../receipt/theme.css'
import './history.css'

type Tab = 'activos' | 'historial'
type Filtro = 'todos' | 'activo' | 'vencido' | 'devuelto'

const FILTROS: [Filtro, string][] = [
  ['todos', 'Todos'],
  ['activo', 'Activos'],
  ['vencido', 'Vencidos'],
  ['devuelto', 'Devueltos'],
]

interface Props {
  /** Id del usuario; si no se pasa, se toma de la sesión (KEYS.session) */
  userId?: string
}

/** Mis préstamos: activos + historial + estado */
export default function MyLoans({ userId }: Props) {
  const uid = userId ?? getSessionUserId(get<unknown>(KEYS.session, null))
  const { loans, books } = useUserLoans(uid)
  const [tab, setTab] = useState<Tab>('activos')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const stats = useMemo(() => {
    const vencidos = loans.filter(isOverdue).length
    const devueltos = loans.filter((l) => l.estado === 'devuelto').length
    return { total: loans.length, activos: loans.length - devueltos - vencidos, vencidos, devueltos }
  }, [loans])

  const visibles = useMemo(() => {
    if (tab === 'activos') return loans.filter((l) => l.estado === 'activo')
    if (filtro === 'todos') return loans
    if (filtro === 'vencido') return loans.filter(isOverdue)
    if (filtro === 'activo') return loans.filter((l) => l.estado === 'activo' && !isOverdue(l))
    return loans.filter((l) => l.estado === 'devuelto')
  }, [loans, tab, filtro])

  if (!uid) {
    return (
      <section className="p3-history">
        <p className="p3-vacio">Inicia sesión para ver tus préstamos.</p>
      </section>
    )
  }

  return (
    <section className="p3-history">
      <h2 className="p3-history-title">Mis préstamos</h2>

      <div className="p3-stats">
        <div className="p3-stat">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div className="p3-stat amarillo">
          <strong>{stats.activos}</strong>
          <span>Activos</span>
        </div>
        <div className="p3-stat rojo">
          <strong>{stats.vencidos}</strong>
          <span>Vencidos</span>
        </div>
        <div className="p3-stat verde">
          <strong>{stats.devueltos}</strong>
          <span>Devueltos</span>
        </div>
      </div>

      <div className="p3-tabs">
        <button className={tab === 'activos' ? 'on' : ''} onClick={() => setTab('activos')}>
          Préstamos activos
        </button>
        <button className={tab === 'historial' ? 'on' : ''} onClick={() => setTab('historial')}>
          Historial completo
        </button>
      </div>

      {tab === 'historial' && (
        <div className="p3-filtros">
          {FILTROS.map(([value, label]) => (
            <button key={value} className={filtro === value ? 'on' : ''} onClick={() => setFiltro(value)}>
              {label}
            </button>
          ))}
        </div>
      )}

      {visibles.length === 0 ? (
        <p className="p3-vacio">
          {tab === 'activos' ? 'No tienes préstamos activos.' : 'No hay préstamos para mostrar.'}
        </p>
      ) : (
        <div className="p3-loan-grid">
          {visibles.map((loan) => (
            <LoanCard key={loan.id} loan={loan} book={books.find((b) => b.id === loan.bookId)} />
          ))}
        </div>
      )}
    </section>
  )
}
