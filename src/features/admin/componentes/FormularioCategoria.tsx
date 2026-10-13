import { useEffect, useState } from 'react';
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
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    setNombre(categoriaEditar?.nombre ?? '');
  }, [categoriaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onGuardar(nombre);
    if (ok) setNombre('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 bg-plomo-800 p-4 rounded-xl border border-plomo-600"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de categoría"
        className="flex-1 px-4 py-2 rounded-lg bg-plomo-900 border border-plomo-600 text-plomo-50 focus:border-amarillo-500 outline-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amarillo-500 hover:bg-amarillo-600 text-plomo-900 font-semibold transition"
      >
        {categoriaEditar ? <Save size={18} /> : <Plus size={18} />}
        {categoriaEditar ? 'Guardar' : 'Agregar'}
      </button>
      {categoriaEditar && (
        <button
          type="button"
          onClick={() => {
            setNombre('');
            onCancelarEdicion?.();
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-plomo-700 hover:bg-plomo-600 text-plomo-50 transition"
        >
          <X size={18} /> Cancelar
        </button>
      )}
    </form>
  );
}