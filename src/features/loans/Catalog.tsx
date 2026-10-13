import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Library, CircleCheck, CircleX } from "lucide-react";
import { get, KEYS } from "../../lib/storage";
import type { Book, Category } from "../../types";

export default function Catalog() {
  const navigate = useNavigate();

  const [books] = useState<Book[]>(() => get<Book[]>(KEYS.books, []));
  const [categories] = useState<Category[]>(() =>
    get<Category[]>(KEYS.categories, []),
  );
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("todas");

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();

    return books.filter((book) => {
      const matchesTitle = book.titulo.toLocaleLowerCase().includes(term);
      const matchesCategory =
        categoryId === "todas" || book.categoryId === categoryId;

      return matchesTitle && matchesCategory;
    });
  }, [books, search, categoryId]);

  const getCategoryName = (id: string) =>
    categories.find((category) => category.id === id)?.nombre ??
    "Categoría no disponible";

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-3 text-white">
              <Library size={25} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Biblioteca universitaria
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Catálogo de libros
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-zinc-600">
            Explora los libros registrados y consulta su disponibilidad antes de
            solicitar un préstamo.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div>
              <label
                htmlFor="book-search"
                className="mb-2 block text-sm font-semibold text-zinc-700"
              >
                Buscar por título
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-300 px-4 focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-zinc-200">
                <Search size={20} className="shrink-0 text-zinc-500" />
                <input
                  id="book-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Escribe el título de un libro..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="book-category"
                className="mb-2 block text-sm font-semibold text-zinc-700"
              >
                Filtrar por categoría
              </label>
              <select
                id="book-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
            <p className="text-sm text-zinc-600">
              Resultados:{" "}
              <span className="font-bold text-zinc-900">
                {filteredBooks.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryId("todas");
              }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-16 text-center">
            <BookOpen className="mx-auto mb-4 text-zinc-400" size={42} />
            <h2 className="text-lg font-bold text-zinc-800">
              No se encontraron libros
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Prueba con otro título o selecciona una categoría diferente.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => {
              const available = book.stock > 0;

              return (
                <article
                  key={book.id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-zinc-100 p-3 text-zinc-700">
                      <BookOpen size={24} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        available
                          ? "bg-zinc-100 text-zinc-700"
                          : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {available ? (
                        <CircleCheck size={14} />
                      ) : (
                        <CircleX size={14} />
                      )}
                      {available ? "Disponible" : "Sin stock"}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold leading-snug text-zinc-900">
                    {book.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">{book.autor}</p>

                  <div className="mt-5 space-y-3 border-t border-zinc-100 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-500">Categoría</span>
                      <span className="text-right font-medium text-zinc-800">
                        {getCategoryName(book.categoryId)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-500">ISBN</span>
                      <span className="text-right text-zinc-700">
                        {book.isbn}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-zinc-500">Stock disponible</span>
                      <span className="font-bold text-zinc-900">
                        {book.stock}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 pt-5">
                    <p className="rounded-lg bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-600">
                      {available
                        ? "Disponible para solicitar un préstamo"
                        : "No es posible solicitar este libro"}
                    </p>

                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => navigate(`/prestamo/${book.id}`)}
                      className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                    >
                      {available ? "Solicitar préstamo" : "Sin stock"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
