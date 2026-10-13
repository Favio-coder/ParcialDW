export interface Category {
  id: string;
  nombre: string;
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoryId: string;
  stock: number;
}

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  codigo: string;       // único
  email: string;
  tipo: 'estudiante' | 'docente';
}

export interface Loan {
  id: string;
  codigo: string;       // único del préstamo
  userId: string;
  bookId: string;
  fechaPrestamo: string;
  fechaLimite: string;
  fechaDevolucion?: string;
  estado: 'activo' | 'devuelto';
}