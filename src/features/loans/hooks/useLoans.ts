import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { Book, Loan } from "../../../types";
import { get, set, KEYS } from "../../../lib/storage";
import { generateReceiptCode } from "../../receipt/createReceipt";

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

  useEffect(() => {
    window.addEventListener("storage", refreshLoans);
    window.addEventListener("storage-updated", refreshLoans);
    return () => {
      window.removeEventListener("storage", refreshLoans);
      window.removeEventListener("storage-updated", refreshLoans);
    };
  }, [refreshLoans]);

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
        codigo: generateReceiptCode(currentLoans.map((item) => item.codigo)),
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

  const returnLoan = useCallback(async (loanId: string): Promise<void> => {
    const confirmation = await Swal.fire({
      title: "¿Registrar devolución?",
      text: "El libro volverá a estar disponible en el inventario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0f5540",
    });
    if (!confirmation.isConfirmed) return;

    const currentLoans = get<Loan[]>(KEYS.loans, []);
    const loan = currentLoans.find((item) => item.id === loanId);
    if (!loan || loan.estado !== "activo") {
      await Swal.fire("Préstamo no disponible", "El préstamo ya fue devuelto o no existe.", "warning");
      return;
    }

    const books = get<Book[]>(KEYS.books, []);
    const returnedLoan: Loan = {
      ...loan,
      estado: "devuelto",
      fechaDevolucion: new Date().toISOString(),
    };
    const updatedLoans = currentLoans.map((item) => item.id === loanId ? returnedLoan : item);
    const updatedBooks = books.map((book) =>
      book.id === loan.bookId ? { ...book, stock: book.stock + 1 } : book,
    );

    set(KEYS.books, updatedBooks);
    set(KEYS.loans, updatedLoans);
    setLoans(updatedLoans);
    await Swal.fire({
      icon: "success",
      title: "Devolución registrada",
      timer: 1500,
      showConfirmButton: false,
    });
  }, []);

  return {
    loans,
    createLoan,
    refreshLoans,
    returnLoan,
  };
}
