import { useState } from 'react';
import { BookMarked, FolderTree, Library, Plus, RotateCcw } from 'lucide-react';
import { useCategorias } from '../../hooks/useCategorias';
import { useLibros } from '../../hooks/useLibros';
import { useLoans } from '../../../loans/hooks/useLoans';
import LoanCard from '../../../history/LoanCard';
import { get, KEYS } from '../../../../lib/storage';
import FormularioCategoria from '../FormularioCategoria';
import ListaCategorias from '../ListaCategorias';
import FormularioLibro from '../FormularioLibro';
import ListaLibros from '../ListaLibros';
import type { Category, Book, User } from '../../../../types';

interface PaginaAdminProps {
  showLoansOnly?: boolean;
}

export default function PaginaAdmin({ showLoansOnly = false }: PaginaAdminProps) {
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
  const { loans, returnLoan } = useLoans();
  const users = get<User[]>(KEYS.users, []);

  const [catEditar, setCatEditar] = useState<Category | null>(null);
  const [libroEditar, setLibroEditar] = useState<Book | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-plomo-800">
        {showLoansOnly ? 'Gestión de préstamos' : 'Gestión de Libros y Categorías'}
      </h1>

      {!showLoansOnly && <>
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
      </>}

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-uncp-700">
          <BookMarked size={20} /> Gestión de préstamos
        </h2>
        {loans.length === 0 ? (
          <p className="rounded-lg border border-dashed border-plomo-300 bg-plomo-50 px-4 py-8 text-center text-sm text-plomo-500">
            Aún no hay préstamos registrados.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...loans]
              .sort((a, b) => b.fechaPrestamo.localeCompare(a.fechaPrestamo))
              .map((loan) => {
                const user = users.find((item) => item.id === loan.userId);
                const book = libros.find((item) => item.id === loan.bookId);
                return (
                  <div key={loan.id} className="space-y-2">
                    <p className="px-1 text-sm font-semibold text-plomo-700">
                      {user ? `${user.nombres} ${user.apellidos} · ${user.codigo}` : 'Usuario no encontrado'}
                    </p>
                    <LoanCard
                      loan={loan}
                      book={book}
                      actions={loan.estado === 'activo' ? (
                        <button
                          type="button"
                          onClick={() => void returnLoan(loan.id)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                        >
                          <RotateCcw size={14} /> Registrar devolución
                        </button>
                      ) : undefined}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}