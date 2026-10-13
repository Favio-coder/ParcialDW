import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LibraryBig,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import type { User } from '../../types'
import { ROUTES } from '../../lib/routes'
import type { RegistrationData, Session } from './types'
import { ADMIN_CREDENTIALS, authenticate, getUsers, registerUser } from './userService'

interface AuthPageProps {
  onSignIn: (session: Session) => void
}

function AuthMessage({ children }: { children: string }) {
  return (
    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
      {children}
    </div>
  )
}

function BrandIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-10">
      {/* <span className="flex h-25 w-25 items-center justify-center align-middle">
              <img src="/logo/logoUncp.png" alt="Logo de la UNCP" />
      </span> */}

      <span className="flex h-25 w-25 items-center justify-center">
        <img src="/logo/logoUncp.png" alt="Logo de la UNCP" className="h-auto w-auto" />
      </span>

      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Biblioteca universitaria</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

export function LoginPage({ onSignIn }: AuthPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const session = await authenticate(email, password)
      onSignIn(session)
      navigate(session.role === 'admin' ? ROUTES.adminUsers : ROUTES.catalog, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[min(720px,calc(100vh-220px))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[1.05fr_0.95fr]">


      <section className="flex items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-md">
          <BrandIntro title="Bienvenido de nuevo" description="Inicia sesión para acceder a los servicios de tu biblioteca." />
          {error && <AuthMessage>{error}</AuthMessage>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</span>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@uncp.edu.pe"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
            >
              <LockKeyhole size={17} /> {isSubmitting ? 'Validando acceso…' : 'Iniciar sesión'} <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            ¿Aún no tienes una cuenta?{' '}
            <Link to={ROUTES.register} className="font-bold text-emerald-800 hover:text-emerald-950">Regístrate aquí</Link>
          </p>
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-900">Acceso de administrador · demostración</p>
            <p className="mt-2 text-sm text-amber-950"><span className="font-semibold">Correo:</span> {ADMIN_CREDENTIALS.email}</p>
            <p className="text-sm text-amber-950"><span className="font-semibold">Contraseña:</span> {ADMIN_CREDENTIALS.password}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export function RegisterPage({ onSignIn }: AuthPageProps) {
  
  /* Constantes de cambio */
  const navigate = useNavigate()
  const [form, setForm] = useState<RegistrationData>({
    nombres: '',
    apellidos: '',
    codigo: '',
    email: '',
    tipo: 'estudiante',
    password: '',
  })
  const[confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)



  function updateField<K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (form.password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)
    try {
      const session = await registerUser(form)
      onSignIn(session)
      navigate(ROUTES.catalog, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo completar el registro. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="relative hidden overflow-hidden bg-emerald-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-38 border-amber-300/10" />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-300 text-emerald-950"><UserPlus size={23} /></span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Únete a la comunidad</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">Tu próxima gran lectura empieza aquí.</h1>
          <p className="mt-4 text-sm leading-6 text-emerald-100/80">Registra tu cuenta institucional y accede a los servicios de la Biblioteca Central.</p>
        </div>
        <div className="relative space-y-3 text-sm text-emerald-100/85">
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" /> Catálogo de la biblioteca</p>
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" /> Solicitud de préstamos</p>
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" /> Historial personal</p>
        </div>
      </aside>
      <section className="px-6 py-9 sm:px-10 lg:px-12">
        <BrandIntro title="Crea tu cuenta" description="Completa tus datos universitarios para registrarte en la biblioteca." />
        {error && <AuthMessage>{error}</AuthMessage>}
        <form onSubmit={handleSubmit} className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Nombres</span>
            <input required autoComplete="given-name" minLength={2} maxLength={60} value={form.nombres} onChange={(event) => updateField('nombres', event.target.value)} placeholder="Tus nombres" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Apellidos</span>
            <input required autoComplete="family-name" minLength={2} maxLength={60} value={form.apellidos} onChange={(event) => updateField('apellidos', event.target.value)} placeholder="Tus apellidos" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Código universitario</span>
            <input required autoComplete="username" minLength={3} maxLength={20} value={form.codigo} onChange={(event) => updateField('codigo', event.target.value)} placeholder="Ej. 202410001" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Tipo de usuario</span>
            <select value={form.tipo} onChange={(event) => updateField('tipo', event.target.value as RegistrationData['tipo'])} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10">
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Correo electrónico</span>
            <input required type="email" autoComplete="email" maxLength={120} value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="nombre@uncp.edu.pe" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Contraseña</span>
            <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Mínimo 8 caracteres" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Confirmar contraseña</span>
            <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite tu contraseña" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
          </label>
          <button type="submit" disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
            <UserPlus size={17} /> {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta gratuita'} <ArrowRight size={17} />
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">¿Ya tienes una cuenta? <Link to={ROUTES.login} className="font-bold text-emerald-800 hover:text-emerald-950">Inicia sesión</Link></p>
      </section>
    </div>
  )
}

function exportUsers(users: User[]) {
  const rows = [
    ['Nombres', 'Apellidos', 'Código universitario', 'Correo electrónico', 'Tipo de usuario'],
    ...users.map((user) => [user.nombres, user.apellidos, user.codigo, user.email, user.tipo === 'estudiante' ? 'Estudiante' : 'Docente']),
  ]
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'usuarios-biblioteca.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

export function UsersPage() {
  const [users] = useState(getUsers)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'todos' | User['tipo']>('todos')
  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    return users.filter((user) => {
      const matchesTerm = !term || `${user.nombres} ${user.apellidos} ${user.codigo} ${user.email}`.toLowerCase().includes(term)
      return matchesTerm && (typeFilter === 'todos' || user.tipo === typeFilter)
    })
  }, [query, typeFilter, users])
  const students = users.filter((user) => user.tipo === 'estudiante').length
  const teachers = users.filter((user) => user.tipo === 'docente').length

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Panel de administración</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Usuarios registrados</h1>
          <p className="mt-2 text-sm text-slate-600">Consulta y administra las cuentas de la comunidad universitaria.</p>
        </div>
        <button type="button" onClick={() => exportUsers(filteredUsers)} disabled={filteredUsers.length === 0} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-800 px-4 py-2.5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto">
          <UsersRound size={17} /> Exportar listado
        </button>
      </div>

      <section aria-label="Resumen de usuarios" className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Total de usuarios</span><UsersRound size={19} className="text-emerald-700" /></div>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">{users.length}</p>
          <p className="mt-1 text-xs text-slate-500">Cuentas registradas</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Estudiantes</span><GraduationCap size={19} className="text-emerald-700" /></div>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">{students}</p>
          <p className="mt-1 text-xs text-slate-500">Usuarios académicos</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Docentes</span><BookOpen size={19} className="text-emerald-700" /></div>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">{teachers}</p>
          <p className="mt-1 text-xs text-slate-500">Personal docente</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-slate-900">Directorio de usuarios</h2>
            <p className="mt-1 text-xs text-slate-500">Mostrando {filteredUsers.length} de {users.length} cuentas</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
              <span className="sr-only">Buscar usuario</span>
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nombre, código o correo" className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 sm:w-64" />
            </label>
            <select aria-label="Filtrar por tipo de usuario" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10">
              <option value="todos">Todos los tipos</option>
              <option value="estudiante">Estudiantes</option>
              <option value="docente">Docentes</option>
            </select>
          </div>
        </div>
        {filteredUsers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Usuario</th>
                  <th className="px-5 py-3.5 font-semibold">Código</th>
                  <th className="px-5 py-3.5 font-semibold">Correo electrónico</th>
                  <th className="px-5 py-3.5 font-semibold">Tipo</th>
                  <th className="px-5 py-3.5 font-semibold">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-emerald-50/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold uppercase text-emerald-900">{user.nombres.charAt(0)}{user.apellidos.charAt(0)}</span>
                        <span className="font-semibold text-slate-900">{user.nombres} {user.apellidos}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">{user.codigo}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.tipo === 'estudiante' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                        {user.tipo === 'estudiante' ? 'Estudiante' : 'Docente'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user.createdAt ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(user.createdAt)) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><UsersRound size={25} /></span>
            <h3 className="mt-4 font-bold text-slate-900">{users.length ? 'No se encontraron usuarios' : 'Aún no hay usuarios registrados'}</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">{users.length ? 'Prueba con otro término de búsqueda o cambia el filtro seleccionado.' : 'Cuando un estudiante o docente cree su cuenta, aparecerá en este directorio.'}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export function WelcomePage() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white px-7 py-12 text-center shadow-sm sm:px-12">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-800 text-amber-300"><BookOpen size={30} /></span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Biblioteca Central · UNCP</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">¡Bienvenido a la biblioteca!</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Tu cuenta está lista. Desde aquí podrás explorar el catálogo, gestionar tus préstamos y consultar tu historial.</p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
        <CheckCircle2 size={18} /> Sesión iniciada correctamente
      </div>
    </div>
  )
}
