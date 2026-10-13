import { Pencil, Trash2, Tag } from 'lucide-react';
import type { Category } from '../../../types';

interface Props {
  categorias: Category[];
  onEditar: (c: Category) => void;
  onEliminar: (id: string) => void;
}

export default function ListaCategorias({ categorias, onEditar, onEliminar }: Props) {
  if (categorias.length === 0) {
    return (
      <p className="text-plomo-300 text-sm italic p-4 bg-plomo-800 rounded-xl border border-plomo-600">
        No hay categorías registradas.
      </p>
    );
  }

  return (
    <ul className="grid gap-2">
      {categorias.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between bg-plomo-800 border border-plomo-600 rounded-xl px-4 py-3"
        >
          <span className="flex items-center gap-2 text-plomo-50">
            <Tag size={16} className="text-amarillo-500" />
            {c.nombre}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEditar(c)}
              className="p-2 rounded-lg bg-plomo-700 hover:bg-plomo-600 text-amarillo-400 transition"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onEliminar(c.id)}
              className="p-2 rounded-lg bg-plomo-700 hover:bg-red-600 text-red-300 hover:text-white transition"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}