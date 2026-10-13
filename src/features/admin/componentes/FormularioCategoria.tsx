import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import type { Category } from '../../../types';

interface Props {
  onGuardar: (nombre: string) => boolean;
  categoriaEditar?: Category | null;
  onCancelarEdicion?: () => void;
}

export default function FormularioCategoria({
  onGuardar,
  categoriaEditar,
  onCancelarEdicion,
}: Props) {
  const [nombre, setNombre] = useState(categoriaEditar?.nombre ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onGuardar(nombre);
    if (ok) setNombre('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 bg-plomo-50 p-4 rounded-lg border border-plomo-200"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la categoría"
        className="flex-1 px-3 py-2 text-sm rounded-md border border-plomo-300 bg-white text-plomo-800 placeholder-plomo-400 focus:border-uncp-500 focus:ring-2 focus:ring-uncp-500/20 outline-none transition"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-uncp-700 hover:bg-uncp-800 text-white text-sm font-semibold transition shadow-sm"
      >
        {categoriaEditar ? <Save size={16} /> : <Plus size={16} />}
        {categoriaEditar ? 'Guardar' : 'Agregar'}
      </button>
      {categoriaEditar && (
        <button
          type="button"
          onClick={() => {
            setNombre('');
            onCancelarEdicion?.();
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-plomo-200 hover:bg-plomo-300 text-plomo-700 text-sm font-medium transition"
        >
          <X size={16} /> Cancelar
        </button>
      )}
    </form>
  );
}