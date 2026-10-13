import { Pencil, Trash2, Tag } from 'lucide-react';
import type { Category } from '../../../types';

interface Props {
  categorias: Category[];
  onEditar: (c: Category) => void;
  onEliminar: (id: string) => void;
}

export default function ListaCategorias({
  categorias,
  onEditar,
  onEliminar,
}: Props) {
  if (categorias.length === 0) {
    return (
      <div className="text-center py-8 bg-plomo-50 border border-dashed border-plomo-300 rounded-lg">
        <Tag size={32} className="mx-auto text-plomo-300 mb-2" />
        <p className="text-sm text-plomo-500">
          No hay categorías registradas
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {categorias.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between bg-white border border-plomo-200 rounded-lg px-4 py-3 hover:border-uncp-300 hover:shadow-sm transition"
        >
          <span className="flex items-center gap-3 text-plomo-800 text-sm font-medium">
            <span className="w-8 h-8 rounded-md bg-uncp-50 text-uncp-700 flex items-center justify-center">
              <Tag size={16} />
            </span>
            {c.nombre}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onEditar(c)}
              className="p-2 rounded-md bg-plomo-100 hover:bg-uncp-50 text-plomo-600 hover:text-uncp-700 transition"
              title="Editar"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onEliminar(c.id)}
              className="p-2 rounded-md bg-plomo-100 hover:bg-red-50 text-plomo-600 hover:text-red-600 transition"
              title="Eliminar"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}