import { useState } from 'react';
import { FolderTree, Library, Plus } from 'lucide-react';
import { useCategorias } from '../../hooks/useCategorias';
import { useLibros } from '../../hooks/useLibros';
import FormularioCategoria from '../FormularioCategoria';
import ListaCategorias from '../ListaCategorias';
import FormularioLibro from '../FormularioLibro';
import ListaLibros from '../ListaLibros';
import type { Category, Book } from '../../../../types';

export default function PaginaAdmin() {
  const {
    categorias,
    agregar: agregarCat,
    editar: editarCat,
    eliminar: eliminarCat,
  } = useCategorias();

  const {
    libros,
    agregar: agregarLibro,
    editar: editarLibro,
    eliminar: eliminarLibro,
  } = useLibros();

  const [catEditar, setCatEditar] = useState<Category | null>(null);
  const [libroEditar, setLibroEditar] = useState<Book | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-plomo-800">
        Gestión de Libros y Categorías
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ==== CATEGORÍAS ==== */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-uncp-700">
            <FolderTree size={20} /> Categorías
          </h2>
          <FormularioCategoria
            key={catEditar?.id ?? 'nueva-cat'}
            categoriaEditar={catEditar}
            onCancelarEdicion={() => setCatEditar(null)}
            onGuardar={(nombre) =>
              catEditar ? editarCat(catEditar.id, nombre) : agregarCat(nombre)
            }
          />
          <ListaCategorias
            categorias={categorias}
            onEditar={(c) => setCatEditar(c)}
            onEliminar={eliminarCat}
          />
        </section>

        {/* ==== LIBROS ==== */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-uncp-700">
            <Plus size={20} /> Nuevo Libro
          </h2>
          <FormularioLibro
            key={libroEditar?.id ?? 'nuevo-libro'}
            categorias={categorias}
            libroEditar={libroEditar}
            onCancelarEdicion={() => setLibroEditar(null)}
            onGuardar={(libro) =>
              libroEditar
                ? editarLibro(libroEditar.id, libro)
                : agregarLibro(libro)
            }
          />
        </section>
      </div>

      {/* ==== LISTADO ==== */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-uncp-700">
          <Library size={20} /> Listado de libros
        </h2>
        <ListaLibros
          libros={libros}
          categorias={categorias}
          onEditar={(b) => setLibroEditar(b)}
          onEliminar={eliminarLibro}
        />
      </section>
    </div>
  );
}