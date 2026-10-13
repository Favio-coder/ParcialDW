import { useState } from 'react';
import Swal from 'sweetalert2';
import { KEYS, get, set } from '../../../lib/storage';
import type { Book } from '../../../types';

export const useLibros = () => {
  const [libros, setLibros] = useState<Book[]>(() =>
    get<Book[]>(KEYS.books, [])
  );

  const validar = (libro: Omit<Book, 'id'>, idEditar?: string) => {
    if (!libro.titulo.trim()) return 'El título es obligatorio';
    if (!libro.autor.trim()) return 'El autor es obligatorio';
    if (!libro.isbn.trim()) return 'El ISBN es obligatorio';
    if (!libro.categoryId) return 'Debes elegir una categoría';
    if (libro.stock < 0) return 'El stock no puede ser negativo';

    const actuales = get<Book[]>(KEYS.books, []);
    const isbnDuplicado = actuales.some(
      (b) => b.isbn === libro.isbn && b.id !== idEditar
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