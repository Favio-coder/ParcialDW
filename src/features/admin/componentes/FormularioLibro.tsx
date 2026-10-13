import { useState } from 'react';
import { Plus, Save, X, BookPlus } from 'lucide-react';
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

const aFormulario = (
  libro: Book | null | undefined,
  categorias: Category[]
): Omit<Book, 'id'> => {
  if (!libro) return inicial(categorias);
  return {
    titulo: libro.titulo,
    autor: libro.autor,
    isbn: libro.isbn,
    categoryId: libro.categoryId,
    stock: libro.stock,
  };
};

const labelCls = 'block text-xs font-semibold text-plomo-600 mb-1 uppercase tracking-wide';
const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-plomo-300 bg-white text-plomo-800 placeholder-plomo-400 focus:border-uncp-500 focus:ring-2 focus:ring-uncp-500/20 outline-none transition';

export default function FormularioLibro({
  categorias,
  onGuardar,
  libroEditar,
  onCancelarEdicion,
}: Props) {
  const [form, setForm] = useState<Omit<Book, 'id'>>(() =>
    aFormulario(libroEditar, categorias)
  );

  const cambiar = (campo: keyof Omit<Book, 'id'>, valor: string | number) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onGuardar(form);
    if (ok && !libroEditar) setForm(inicial(categorias));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 bg-plomo-50 p-5 rounded-lg border border-plomo-200"
    >
      <div className="flex items-center gap-2 text-uncp-700 pb-2 border-b border-plomo-200">
        <BookPlus size={18} />
        <span className="text-sm font-semibold uppercase tracking-wide">
          {libroEditar ? 'Editar libro' : 'Datos del libro'}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Título</label>
          <input
            required
            minLength={2}
            maxLength={120}
            aria-label="Título"
            className={inputCls}
            placeholder="Ej. Cien años de soledad"
            value={form.titulo}
            onChange={(e) => cambiar('titulo', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Autor</label>
          <input
            required
            minLength={3}
            maxLength={80}
            aria-label="Autor"
            className={inputCls}
            placeholder="Ej. Gabriel García Márquez"
            value={form.autor}
            onChange={(e) => cambiar('autor', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>ISBN</label>
          <input
            required
            aria-label="ISBN"
            inputMode="numeric"
            minLength={10}
            maxLength={20}
            className={inputCls}
            placeholder="Ej. 978-0307474728"
            value={form.isbn}
            onChange={(e) => cambiar('isbn', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Categoría</label>
          <select
            required
            aria-label="Categoría"
            className={inputCls}
            value={form.categoryId}
            onChange={(e) => cambiar('categoryId', e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Stock</label>
          <input
            className={inputCls}
            type="number"
            required
            min={0}
            max={9999}
            step={1}
            aria-label="Stock"
            value={form.stock}
            onChange={(e) => cambiar('stock', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-uncp-700 hover:bg-uncp-800 text-white text-sm font-semibold transition shadow-sm"
        >
          {libroEditar ? <Save size={16} /> : <Plus size={16} />}
          {libroEditar ? 'Guardar cambios' : 'Registrar libro'}
        </button>
        {libroEditar && (
          <button
            type="button"
            onClick={() => {
              setForm(inicial(categorias));
              onCancelarEdicion?.();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-plomo-200 hover:bg-plomo-300 text-plomo-700 text-sm font-medium transition"
          >
            <X size={16} /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}