import { useState } from 'react';
import Swal from 'sweetalert2';
import { KEYS, get, set } from '../../../lib/storage';
import type { Category } from '../../../types';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Category[]>(() =>
    get<Category[]>(KEYS.categories, [])
  );

  const agregar = (nombre: string) => {
    const limpio = nombre.trim();
    if (!limpio) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return false;
    }
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
    Swal.fire('Listo', 'Categoría registrada', 'success');
    return true;
  };

  const editar = (id: string, nombre: string) => {
    const limpio = nombre.trim();
    if (!limpio) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return false;
    }
    const lista = categorias.map((c) =>
      c.id === id ? { ...c, nombre: limpio } : c
    );
    set(KEYS.categories, lista);
    setCategorias(lista);
    Swal.fire('Actualizado', 'Categoría modificada', 'success');
    return true;
  };

  const eliminar = async (id: string) => {
    const res = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Los libros asociados quedarán sin categoría válida',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });
    if (!res.isConfirmed) return;
    const lista = categorias.filter((c) => c.id !== id);
    set(KEYS.categories, lista);
    setCategorias(lista);
    Swal.fire('Eliminado', 'Categoría borrada', 'success');
  };

  return { categorias, agregar, editar, eliminar };
};