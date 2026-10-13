import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, CircleAlert } from "lucide-react";
import type { Book, Category } from "../../types";
import { get, KEYS } from "../../lib/storage";
import { useLoans } from "./hooks/useLoans";

interface LoanRequestProps {
  userId: string;
}

export default function LoanRequest({ userId }: LoanRequestProps) {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { createLoan } = useLoans();

  const [books, setBooks] = useState<Book[]>(() =>
    get<Book[]>(KEYS.books, []),
  );
  const [categories] = useState<Category[]>(() =>
    get<Category[]>(KEYS.categories, []),
  );
  const [selectedBookId, setSelectedBookId] = useState(bookId ?? "");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedBook = books.find((book) => book.id === selectedBookId);

  const categoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.nombre ??
    "Sin categoría";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!userId.trim()) {
      setMessage("Debes iniciar sesión para solicitar un préstamo.");
      return;
    }

    if (!selectedBookId) {
      setMessage("Selecciona un libro para continuar.");
      return;
    }

    setSubmitting(true);

    try {
      const result = createLoan(userId, selectedBookId);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        setBooks(get<Book[]>(KEYS.books, []));
      }
    } catch {
      setMessage(
        "No se pudo registrar el préstamo. Comprueba los datos e inténtalo nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <header className="mb-7">
          <div className="mb-3 inline-flex rounded-xl bg-zinc-800 p-3 text-white">
            <BookOpen size={26} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Solicitar préstamo
          </h1>
          <p className="mt-2 text-zinc-600">
            Selecciona un libro y verifica su disponibilidad antes de confirmar
            tu solicitud.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <label
            htmlFor="loan-book"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            Libro que deseas solicitar
          </label>

          <select
            id="loan-book"
            value={selectedBookId}
            onChange={(event) => {
              setSelectedBookId(event.target.value);
              setMessage("");
              setSuccess(false);
            }}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200"
            required
          >
            <option value="">Selecciona un libro</option>
            {books.map((book) => (
              <option key={book.id} value={book.id} disabled={book.stock <= 0}>
                {book.titulo} — Stock: {book.stock}
              </option>
            ))}
          </select>

          {selectedBook && (
            <section className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-zinc-200 p-3 text-zinc-700">
                  <BookOpen size={25} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-zinc-900">
                    {selectedBook.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Autor: {selectedBook.autor}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Categoría: {categoryName(selectedBook.categoryId)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    ISBN: {selectedBook.isbn}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                    <span className="text-sm text-zinc-600">
                      Ejemplares disponibles
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-zinc-800 ring-1 ring-zinc-200">
                      {selectedBook.stock}
                    </span>
                  </div>

                  {selectedBook.stock <= 0 && (
                    <p className="mt-3 text-sm font-medium text-zinc-600">
                      Este libro no tiene ejemplares disponibles.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                success
                  ? "border-zinc-300 bg-zinc-100 text-zinc-800"
                  : "border-zinc-300 bg-zinc-50 text-zinc-700"
              }`}
            >
              {success ? (
                <CheckCircle2 size={20} className="shrink-0" />
              ) : (
                <CircleAlert size={20} className="shrink-0" />
              )}
              <p>{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !selectedBook ||
              selectedBook.stock <= 0 ||
              !userId.trim()
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            {submitting ? "Registrando..." : "Confirmar préstamo"}
          </button>

          {!userId.trim() && (
            <p className="mt-3 text-center text-sm text-zinc-500">
              Necesitas iniciar sesión para solicitar un libro.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
