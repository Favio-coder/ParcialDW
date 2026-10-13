import { useState } from 'react';
import Swal from 'sweetalert2';
import { KEYS, get, set } from '../../../lib/storage';
import { validarCategoria } from '../../../lib/validaciones';
import type { Book, Category } from '../../../types';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Category[]>(() =>
    get<Category[]>(KEYS.categories, [])
  );

  const agregar = (nombre: string) => {
    const error = validarCategoria(nombre);
    if (error) {
      Swal.fire('Validación', error, 'warning');
      return false;
    }
    const limpio = nombre.trim();
    const existe = categorias.some(
      (c) => c.nombre.toLowerCase() === limpio.toLowerCase()
    );
    if (existe) {
      Swal.fire('Duplicado', 'Esa categoría ya existe', 'warning');
      return false;
    }
    const nueva: Category = { id: crypto.randomUUID(), nombre: limpio };
    const lista = [...categorias, nueva];
    set(KEYS.categories, lista);
    setCategorias(lista);
    Swal.fire({
      icon: 'success',
      title: 'Categoría registrada',
      timer: 1400,
      showConfirmButton: false,
    });
    return true;
  };

  const editar = (id: string, nombre: string) => {
    const error = validarCategoria(nombre);
    if (error) {
      Swal.fire('Validación', error, 'warning');
      return false;
    }
    const limpio = nombre.trim();
    const duplicado = categorias.some(
      (c) => c.id !== id && c.nombre.toLowerCase() === limpio.toLowerCase()
    );
    if (duplicado) {
      Swal.fire('Duplicado', 'Ya existe otra categoría con ese nombre', 'warning');
      return false;
    }
    const lista = categorias.map((c) =>
      c.id === id ? { ...c, nombre: limpio } : c
    );
    set(KEYS.categories, lista);
    setCategorias(lista);
    Swal.fire({
      icon: 'success',
      title: 'Categoría actualizada',
      timer: 1400,
      showConfirmButton: false,
    });
    return true;
  };

  const eliminar = async (id: string) => {
    const hasBooks = get<Book[]>(KEYS.books, []).some((book) => book.categoryId === id);
    if (hasBooks) {
      await Swal.fire('Categoría en uso', 'Reasigna o elimina sus libros antes de eliminar esta categoría.', 'warning');
      return;
    }
    const res = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Los libros asociados quedarán sin categoría válida',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0f5540',
      cancelButtonColor: '#707c78',
    });
    if (!res.isConfirmed) return;
    const lista = categorias.filter((c) => c.id !== id);
    set(KEYS.categories, lista);
    setCategorias(lista);
    Swal.fire({
      icon: 'success',
      title: 'Categoría eliminada',
      timer: 1400,
      showConfirmButton: false,
    });
  };

  return { categorias, agregar, editar, eliminar };
};