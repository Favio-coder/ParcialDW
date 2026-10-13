import { jsPDF } from 'jspdf'
import type { Receipt } from './types'
import { formatDate } from './createReceipt'

// Colores institucionales en RGB
const VERDE: [number, number, number] = [27, 94, 59]
const AMARILLO: [number, number, number] = [227, 181, 5]
const PLOMO: [number, number, number] = [74, 85, 96]
const PLOMO_CLARO: [number, number, number] = [238, 240, 242]

/** Genera y descarga el comprobante en PDF */
export function downloadReceiptPDF(r: Receipt): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const W = doc.internal.pageSize.getWidth()
  const M = 12

  // Encabezado verde con franja amarilla
  doc.setFillColor(...VERDE)
  doc.rect(0, 0, W, 30, 'F')
  doc.setFillColor(...AMARILLO)
  doc.rect(0, 30, W, 2.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('BIBLIOTECA CENTRAL', W / 2, 13, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.text('Comprobante digital de préstamo', W / 2, 21, { align: 'center' })

  // Código del préstamo
  doc.setFillColor(...PLOMO_CLARO)
  doc.roundedRect(M, 40, W - 2 * M, 20, 2, 2, 'F')
  doc.setTextColor(...PLOMO)
  doc.setFontSize(8)
  doc.text('CÓDIGO ÚNICO DEL PRÉSTAMO', W / 2, 47, { align: 'center' })
  doc.setFont('courier', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...VERDE)
  doc.text(r.code, W / 2, 55, { align: 'center' })

  // Datos
  const rows: [string, string][] = [
    ['Usuario', r.userName],
    ['Código universitario', r.userCode],
    ['Libro prestado', r.bookTitle],
    ['Autor', r.bookAuthor],
    ['Fecha de préstamo', formatDate(r.loanDate)],
    ['Fecha límite de devolución', formatDate(r.dueDate)],
    ['Estado', r.status],
  ]
  let y = 72
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...PLOMO)
    doc.text(label, M, y)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(30, 30, 30)
    const lines = doc.splitTextToSize(value, W - M - 62)
    doc.text(lines, 60, y)
    y += 7 * Math.max(1, lines.length) + 1.5
    doc.setDrawColor(217, 222, 227)
    doc.line(M, y - 5, W - M, y - 5)
  })

  // Fecha límite destacada
  doc.setFillColor(253, 246, 220)
  doc.roundedRect(M, y, W - 2 * M, 12, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(138, 106, 0)
  doc.text(`Devolver a más tardar el ${formatDate(r.dueDate)}`, W / 2, y + 7.5, { align: 'center' })

  // Pie
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.setTextColor(...PLOMO)
  doc.text('Presente este comprobante al momento de la devolución.', W / 2, y + 22, { align: 'center' })
  doc.text(`Emitido: ${new Date().toLocaleString('es-PE')}`, W / 2, y + 27, { align: 'center' })

  doc.save(`comprobante-${r.code}.pdf`)
}
