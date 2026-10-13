export interface Session {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export interface RegistrationData {
  nombres: string
  apellidos: string
  codigo: string
  email: string
  tipo: 'estudiante' | 'docente'
  password: string
}
