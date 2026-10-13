import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import type { Book, Category } from '../../../types';

interface Props {
  categorias: Category[];
  onGuardar: (libro: Omit<Book, 'id'>) => boolean;
  libroEditar?: Book | null;
  onCancelarEdicion?: () => void;
}

const inicial = (categorias: Category[]): Omit<Book, 'id'> => ({
  titulo: '',
  autor: '',
  isbn: '',
  categoryId: categorias[0]?.id ?? '',
  stock: 1,
});

export default function FormularioLibro({
  categorias,
  onGuardar,
  libroEditar,
  onCancelarEdicion,
}: Props) {
  const [form, setForm] = useState<Omit<Book, 'id'>>(inicial(categorias));

  useEffect(() => {
    if (libroEditar) {
      const { id, ...resto } = libroEditar;
      setForm(resto);
    } else {
      setForm(inicial(categorias));
    }
  }, [libroEditar, categorias]);

  const cambiar = (campo: keyof Omit<Book, 'id'>, valor: string | number) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onGuardar(form);
    if (ok && !libroEditar) setForm(inicial(categorias));
  };

  const inputCls =
    'w-full px-4 py-2 rounded-lg bg-plomo-900 border border-plomo-600 text-plomo-50 focus:border-amarillo-500 outline-none';

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 bg-plomo-800 p-4 rounded-xl border border-plomo-600"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputCls}
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => cambiar('titulo', e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="Autor"
          value={form.autor}
          onChange={(e) => cambiar('autor', e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => cambiar('isbn', e.target.value)}
        />
        <select
          className={inputCls}
          value={form.categoryId}
          onChange={(e) => cambiar('categoryId', e.target.value)}
        >
          <option value="">-- Categoría --</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          className={inputCls}
          type="number"
          min={0}
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => cambiar('stock', Number(e.target.value))}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amarillo-500 hover:bg-amarillo-600 text-plomo-900 font-semibold transition"
        >
          {libroEditar ? <Save size={18} /> : <Plus size={18} />}
          {libroEditar ? 'Guardar cambios' : 'Registrar libro'}
        </button>
        {libroEditar && (
          <button
            type="button"
            onClick={() => {
              setForm(inicial(categorias));
              onCancelarEdicion?.();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-plomo-700 hover:bg-plomo-600 text-plomo-50 transition"
          >
            <X size={18} /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}