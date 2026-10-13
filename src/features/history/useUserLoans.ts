import { useEffect, useState } from 'react'
import { KEYS, get } from '../../lib/storage'
import type { Book, Loan } from '../../types'

const read = (userId: string | undefined) => ({
  loans: get<Loan[]>(KEYS.loans, [])
    .filter((l) => l.userId === userId)
    .sort((a, b) => b.fechaPrestamo.localeCompare(a.fechaPrestamo)),
  books: get<Book[]>(KEYS.books, []),
})

/** Lee los préstamos del usuario desde Local Storage y se actualiza solo */
export function useUserLoans(userId: string | undefined) {
  const [data, setData] = useState(() => read(userId))

  useEffect(() => {
    const refresh = () => setData(read(userId))
    refresh()
    window.addEventListener('storage', refresh) // otra pestaña
    window.addEventListener('storage-updated', refresh) // misma pestaña
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('storage-updated', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [userId])

  return data
}
