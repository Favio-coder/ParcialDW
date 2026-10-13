import { useParams, useNavigate } from 'react-router-dom'
import type { Receipt } from './types'
import { formatDate, getReceiptByLoanId } from './createReceipt'
import { downloadReceiptPDF } from './ReceiptPDF'
import './theme.css'
import './receipt.css'

interface Props {
  /** Comprobante ya generado (ej. el que devuelve createLoanReceipt) */
  receipt?: Receipt | null
  /** O el id del préstamo; si no se pasa nada se lee de la ruta /comprobante/:loanId */
  loanId?: string
  /** Muestra el botón "Volver" (útil cuando se usa como página) */
  showBack?: boolean
}

/** Comprobante digital en pantalla con descarga en PDF */
export default function ReceiptView({ receipt, loanId, showBack = true }: Props) {
  const params = useParams<{ loanId: string }>()
  const navigate = useNavigate()
  const id = loanId ?? params.loanId
  const r = receipt ?? (id ? getReceiptByLoanId(id) : null)

  if (!r) {
    return (
      <div className="p3-receipt-wrap">
        <p className="p3-receipt-error">No se encontró el comprobante.</p>
        {showBack && <button className="p3-btn borde" onClick={() => navigate(-1)}>← Volver</button>}
      </div>
    )
  }

  return (
    <div className="p3-receipt-wrap">
      <article className="p3-receipt">
        <header className="p3-receipt-head">
          <span className="p3-receipt-icon">📚</span>
          <div>
            <h2>Biblioteca Central</h2>
            <p>Comprobante digital de préstamo</p>
          </div>
        </header>

        <div className="p3-receipt-code">
          <small>Código único del préstamo</small>
          <strong>{r.code}</strong>
        </div>

        <dl className="p3-receipt-data">
          <dt>Usuario</dt>
          <dd>
            {r.userName} <span>({r.userCode})</span>
          </dd>
          <dt>Libro prestado</dt>
          <dd>
            {r.bookTitle} <span>— {r.bookAuthor}</span>
          </dd>
          <dt>Fecha de préstamo</dt>
          <dd>{formatDate(r.loanDate)}</dd>
          <dt>Fecha límite</dt>
          <dd>{formatDate(r.dueDate)}</dd>
          <dt>Estado</dt>
          <dd>
            <span className={`p3-badge ${r.status === 'Activo' ? 'activo' : 'devuelto'}`}>{r.status}</span>
          </dd>
        </dl>

        <div className="p3-receipt-due">Devolver a más tardar el {formatDate(r.dueDate)}</div>

        <footer className="p3-receipt-actions">
          <button className="p3-btn" onClick={() => downloadReceiptPDF(r)}>
            ⬇ Descargar PDF
          </button>
          {showBack && (
            <button className="p3-btn borde" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          )}
        </footer>
      </article>
    </div>
  )
}
