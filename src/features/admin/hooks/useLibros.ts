import { useState } from 'react';
import Swal from 'sweetalert2';
import { KEYS, get, set } from '../../../lib/storage';
import { validarAutor, validarCategoriaSeleccionada, validarIsbn, validarStock, validarTitulo } from '../../../lib/validaciones';
import type { Book, Loan } from '../../../types';

export const useLibros = () => {
  const [libros, setLibros] = useState<Book[]>(() =>
    get<Book[]>(KEYS.books, [])
  );

  const validar = (libro: Omit<Book, 'id'>, idEditar?: string) => {
    const error = validarTitulo(libro.titulo)
      ?? validarAutor(libro.autor)
      ?? validarIsbn(libro.isbn)
      ?? validarCategoriaSeleccionada(libro.categoryId)
      ?? validarStock(libro.stock);
    if (error) return error;
    if (!get<{ id: string }[]>(KEYS.categories, []).some((category) => category.id === libro.categoryId)) {
      return 'La categoría seleccionada ya no existe';
    }

    const actuales = get<Book[]>(KEYS.books, []);
    const isbnDuplicado = actuales.some(
      (b) => b.isbn.replace(/\D/g, '') === libro.isbn.replace(/\D/g, '') && b.id !== idEditar
    );
    if (isbnDuplicado) return 'Ya existe un libro con ese ISBN';
    return null;
  };

  const agregar = (libro: Omit<Book, 'id'>) => {
    const error = validar(libro);
    if (error) {
      Swal.fire('Error de validación', error, 'error');
      return false;
    }
    const nuevo: Book = { ...libro, id: crypto.randomUUID() };
    const lista = [...libros, nuevo];
    set(KEYS.books, lista);
    setLibros(lista);
    Swal.fire({
      icon: 'success',
      title: 'Libro registrado',
      timer: 1500,
      showConfirmButton: false,
    });
    return true;
  };

  const editar = (id: string, libro: Omit<Book, 'id'>) => {
    const error = validar(libro, id);
    if (error) {
      Swal.fire('Error de validación', error, 'error');
      return false;
    }
    const lista = libros.map((b) => (b.id === id ? { ...b, ...libro } : b));
    set(KEYS.books, lista);
    setLibros(lista);
    Swal.fire({
      icon: 'success',
      title: 'Libro actualizado',
      timer: 1500,
      showConfirmButton: false,
    });
    return true;
  };

  const eliminar = async (id: string) => {
    const hasActiveLoan = get<Loan[]>(KEYS.loans, []).some(
      (loan) => loan.bookId === id && loan.estado === 'activo',
    );
    if (hasActiveLoan) {
      await Swal.fire('Libro en préstamo', 'No se puede eliminar mientras tenga préstamos activos.', 'warning');
      return;
    }
    const res = await Swal.fire({
      title: '¿Eliminar libro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0f5540',
      cancelButtonColor: '#707c78',
    });
    if (!res.isConfirmed) return;
    const lista = libros.filter((b) => b.id !== id);
    set(KEYS.books, lista);
    setLibros(lista);
    Swal.fire({
      icon: 'success',
      title: 'Libro eliminado',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return { libros, agregar, editar, eliminar };
};