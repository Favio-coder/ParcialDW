
// ============ EXPRESIONES ============
const SOLO_TEXTO = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.,'-]+$/;
const ISBN_PERMITIDO = /^[0-9-\s]+$/;

// ============ CATEGORÍA ============
export const validarCategoria = (nombre: string): string | null => {
  const v = nombre.trim();
  if (!v) return 'El nombre es obligatorio';
  if (v.length < 3) return 'Mínimo 3 caracteres';
  if (v.length > 50) return 'Máximo 50 caracteres';
  if (!SOLO_TEXTO.test(v)) return 'Solo letras, espacios y . , - \'';
  return null;
};

// para el libro
export const validarTitulo = (titulo: string): string | null => {
  const v = titulo.trim();
  if (!v) return 'El título es obligatorio';
  if (v.length < 2) return 'Mínimo 2 caracteres';
  if (v.length > 120) return 'Máximo 120 caracteres';
  if (!SOLO_TEXTO.test(v))
    return 'Solo letras, números, espacios y . , - \'';
  return null;
};

export const validarAutor = (autor: string): string | null => {
  const v = autor.trim();
  if (!v) return 'El autor es obligatorio';
  if (v.length < 3) return 'Mínimo 3 caracteres';
  if (v.length > 80) return 'Máximo 80 caracteres';
  if (!SOLO_TEXTO.test(v)) return 'Solo letras, espacios y . \' -';
  return null;
};

export const validarIsbn = (isbn: string): string | null => {
  const v = isbn.trim();
  if (!v) return 'El ISBN es obligatorio';
  if (!ISBN_PERMITIDO.test(v)) return 'Solo números y guiones';
  const soloDigitos = v.replace(/[-\s]/g, '');
  if (soloDigitos.length !== 10 && soloDigitos.length !== 13)
    return 'El ISBN debe tener 10 o 13 dígitos';
  return null;
};

export const validarStock = (stock: number): string | null => {
  if (stock === null || stock === undefined || Number.isNaN(stock))
    return 'El stock es obligatorio';
  if (!Number.isInteger(stock)) return 'Debe ser un número entero';
  if (stock < 0) return 'No puede ser negativo';
  if (stock > 9999) return 'Máximo 9999';
  return null;
};

export const validarCategoriaSeleccionada = (id: string): string | null => {
  if (!id) return 'Debes seleccionar una categoría';
  return null;
};

// inputs
export const limpiarTexto = (valor: string, max = 120) =>
  valor.replace(/[0-9]/g, '').slice(0, max);

export const limpiarTextoConNumeros = (valor: string, max = 120) =>
  valor.slice(0, max);

export const limpiarIsbn = (valor: string) =>
  valor.replace(/[^0-9-\s]/g, '').slice(0, 20);

export const limpiarEntero = (valor: string) =>
  valor.replace(/[^0-9]/g, '').slice(0, 4);