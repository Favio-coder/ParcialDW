import { Pencil, Trash2, BookOpen } from 'lucide-react';
import type { Book, Category } from '../../../types';

interface Props {
  libros: Book[];
  categorias: Category[];
  onEditar: (b: Book) => void;
  onEliminar: (id: string) => void;
}

export default function ListaLibros({
  libros,
  categorias,
  onEditar,
  onEliminar,
}: Props) {
  const nombreCategoria = (id: string) =>
    categorias.find((c) => c.id === id)?.nombre ?? 'Sin categoría';

  if (libros.length === 0) {
    return (
      <p className="text-plomo-300 text-sm italic p-4 bg-plomo-800 rounded-xl border border-plomo-600">
        No hay libros registrados.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {libros.map((b) => (
        <article
          key={b.id}
          className="bg-plomo-800 border border-plomo-600 rounded-xl p-4 flex flex-col gap-2"
        >
          <header className="flex items-start justify-between gap-2">
            <h3 className="text-plomo-50 font-semibold flex items-center gap-2">
              <BookOpen size={18} className="text-amarillo-500" />
              {b.titulo}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                b.stock > 0
                  ? 'bg-amarillo-500 text-plomo-900 font-semibold'
                  : 'bg-red-600 text-white'
              }`}
            >
              Stock: {b.stock}
            </span>
          </header>
          <p className="text-sm text-plomo-300">Autor: {b.autor}</p>
          <p className="text-sm text-plomo-300">ISBN: {b.isbn}</p>
          <p className="text-sm text-plomo-300">
            Categoría: {nombreCategoria(b.categoryId)}
          </p>

          <footer className="flex gap-2 mt-auto pt-2">
            <button
              onClick={() => onEditar(b)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-plomo-700 hover:bg-plomo-600 text-amarillo-400 transition"
            >
              <Pencil size={16} /> Editar
            </button>
            <button
              onClick={() => onEliminar(b.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-plomo-700 hover:bg-red-600 text-red-300 hover:text-white transition"
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}