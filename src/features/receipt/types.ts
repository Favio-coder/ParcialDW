/** Tipo local de Persona 3 (no se agrega a src/types para evitar conflictos) */
export interface Receipt {
  code: string
  loanId: string
  userName: string
  userCode: string
  bookTitle: string
  bookAuthor: string
  loanDate: string
  dueDate: string
  returnDate?: string
  status: 'Activo' | 'Devuelto'
}
