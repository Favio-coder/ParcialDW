import { useCallback, useState } from "react";
import type { Book, Loan } from "../../../types";
import { get, set, KEYS } from "../../../lib/storage";

interface CreateLoanResult {
  success: boolean;
  message: string;
  loan?: Loan;
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>(() => get<Loan[]>(KEYS.loans, []));

  const refreshLoans = useCallback(() => {
    setLoans(get<Loan[]>(KEYS.loans, []));
  }, []);

  const createLoan = useCallback(
    (userId: string, bookId: string): CreateLoanResult => {
      if (!userId.trim()) {
        return {
          success: false,
          message: "Debes iniciar sesión para solicitar un préstamo.",
        };
      }

      // Leer nuevamente los datos antes de validar el stock.
      const books = get<Book[]>(KEYS.books, []);
      const currentLoans = get<Loan[]>(KEYS.loans, []);

      const book = books.find((item) => item.id === bookId);

      if (!book) {
        return {
          success: false,
          message: "El libro seleccionado no existe.",
        };
      }

      if (book.stock <= 0) {
        return {
          success: false,
          message: "No hay ejemplares disponibles de este libro.",
        };
      }

      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 7);

      const loan: Loan = {
        id: crypto.randomUUID(),
        codigo: `PRE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        userId,
        bookId,
        fechaPrestamo: now.toISOString(),
        fechaLimite: dueDate.toISOString(),
        estado: "activo",
      };

      // Descontar una unidad del inventario.
      const updatedBooks = books.map((item) =>
        item.id === bookId ? { ...item, stock: item.stock - 1 } : item,
      );

      // Persistir inventario y préstamo.
      set(KEYS.books, updatedBooks);
      set(KEYS.loans, [...currentLoans, loan]);

      setLoans([...currentLoans, loan]);

      return {
        success: true,
        message: "El préstamo se registró correctamente.",
        loan,
      };
    },
    [],
  );

  return {
    loans,
    createLoan,
    refreshLoans,
  };
}
