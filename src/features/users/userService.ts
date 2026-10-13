import { v4 as uuid } from 'uuid'
import type { User } from '../../types'
import { get, KEYS, set } from '../../lib/storage'
import type { RegistrationData, Session } from './types'

export const ADMIN_CREDENTIALS = {
  email: 'admin@biblioteca.edu.pe',
  password: 'Admin2026!',
}

export function getUsers(): User[] {
  return get<User[]>(KEYS.users, [])
}

async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
    : crypto.getRandomValues(new Uint8Array(16))
  const saltValue = Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120_000, hash: 'SHA-256' },
    key,
    256,
  )
  const hash = Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${saltValue}:${hash}`
}

export async function registerUser(data: RegistrationData): Promise<Session> {
  const users = getUsers()
  const code = data.codigo.trim().toUpperCase()
  const email = data.email.trim().toLowerCase()

  if (users.some((user) => user.codigo.trim().toUpperCase() === code)) {
    throw new Error('Ya existe una cuenta con ese código universitario.')
  }
  if (users.some((user) => user.email.trim().toLowerCase() === email)) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.')
  }

  const user: User = {
    id: uuid(),
    nombres: data.nombres.trim(),
    apellidos: data.apellidos.trim(),
    codigo: data.codigo.trim(),
    email,
    tipo: data.tipo,
    passwordHash: await hashPassword(data.password),
    createdAt: new Date().toISOString(),
  }

  set(KEYS.users, [...users, user])
  return { userId: user.id, email: user.email, role: 'user' }
}

export async function authenticate(emailInput: string, password: string): Promise<Session> {
  const email = emailInput.trim().toLowerCase()
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return { userId: 'admin', email: ADMIN_CREDENTIALS.email, role: 'admin' }
  }

  const user = getUsers().find((candidate) => candidate.email.trim().toLowerCase() === email)
  const [salt, storedHash] = user?.passwordHash?.split(':') ?? []
  if (!user || !salt || !storedHash || (await hashPassword(password, salt)).split(':')[1] !== storedHash) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  return { userId: user.id, email: user.email, role: 'user' }
}
