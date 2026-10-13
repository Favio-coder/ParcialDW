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
      <div className="text-center py-10 bg-plomo-50 border border-dashed border-plomo-300 rounded-lg">
        <BookOpen size={36} className="mx-auto text-plomo-300 mb-2" />
        <p className="text-sm text-plomo-500">No hay libros registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-plomo-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-uncp-900 text-white">
          <tr>
            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              Título
            </th>
            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              Autor
            </th>
            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              ISBN
            </th>
            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              Categoría
            </th>
            <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              Stock
            </th>
            <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wide">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {libros.map((b, i) => (
            <tr
              key={b.id}
              className={`border-t border-plomo-100 hover:bg-uncp-50/40 transition ${
                i % 2 === 0 ? 'bg-white' : 'bg-plomo-50/40'
              }`}
            >
              <td className="px-4 py-3 font-medium text-plomo-800">
                {b.titulo}
              </td>
              <td className="px-4 py-3 text-plomo-600">{b.autor}</td>
              <td className="px-4 py-3 text-plomo-500 font-mono text-xs">
                {b.isbn}
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2.5 py-1 rounded-full bg-uncp-50 text-uncp-700 text-xs font-medium border border-uncp-100">
                  {nombreCategoria(b.categoryId)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block min-w-[42px] px-2.5 py-1 rounded-full text-xs font-bold ${
                    b.stock > 0
                      ? 'bg-amarillo-400 text-plomo-900'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {b.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1.5">
                  <button
                    onClick={() => onEditar(b)}
                    className="p-2 rounded-md bg-plomo-100 hover:bg-uncp-100 text-plomo-600 hover:text-uncp-700 transition"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onEliminar(b.id)}
                    className="p-2 rounded-md bg-plomo-100 hover:bg-red-100 text-plomo-600 hover:text-red-600 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}