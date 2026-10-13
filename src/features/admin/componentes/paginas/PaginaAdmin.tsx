import { useState } from 'react';
import { FolderTree, Library } from 'lucide-react';
import { useCategorias } from '../../hooks/useCategorias';
import { useLibros } from '../../hooks/useLibros';
import FormularioCategoria from '../FormularioCategoria';
import ListaCategorias from '../ListaCategorias';
import FormularioLibro from '../FormularioLibro';
import ListaLibros from '../ListaLibros';
import type { Category, Book } from '../.././types';

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
    <section className="min-h-screen bg-plomo-900 text-plomo-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Library className="text-amarillo-500" /> Panel de Administración
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Categorías */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-amarillo-400">
            <FolderTree size={20} /> Categorías
          </h2>
          <FormularioCategoria
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
        </div>

        {/* Libros */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-amarillo-400">
            <Library size={20} /> Libros
          </h2>
          <FormularioLibro
            categorias={categorias}
            libroEditar={libroEditar}
            onCancelarEdicion={() => setLibroEditar(null)}
            onGuardar={(libro) =>
              libroEditar
                ? editarLibro(libroEditar.id, libro)
                : agregarLibro(libro)
            }
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3 text-amarillo-400">
          Listado de libros
        </h2>
        <ListaLibros
          libros={libros}
          categorias={categorias}
          onEditar={(b) => setLibroEditar(b)}
          onEliminar={eliminarLibro}
        />
      </div>
    </section>
  );
}