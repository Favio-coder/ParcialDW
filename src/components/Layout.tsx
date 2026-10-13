import { BookOpen, LogOut, ShieldCheck, Users } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import type { Session } from '../features/users/types'
import { ROUTES } from '../lib/routes'

interface LayoutProps {
  session: Session | null
  onSignOut: () => void
}

export function Layout({ session, onSignOut }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-emerald-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to={session?.role === 'admin' ? ROUTES.adminUsers : ROUTES.login} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-amber-300">
              <BookOpen size={23} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-wide text-emerald-950">BIBLIOTECA CENTRAL</span>
              <span className="block text-xs font-medium text-slate-500">Universidad Nacional del Centro del Perú</span>
            </span>
          </Link>
          {session && (
            <div className="flex items-center gap-3">
              {session.role === 'admin' ? (
                <NavLink to={ROUTES.adminUsers} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 sm:flex">
                  <Users size={17} /> Usuarios
                </NavLink>
              ) : (
                <span className="hidden items-center gap-2 text-sm font-medium text-slate-600 sm:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <ShieldCheck size={16} />
                  </span>
                  {session.email}
                </span>
              )}
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Biblioteca Central · Universidad Nacional del Centro del Perú</span>
          <span>Plataforma de gestión bibliotecaria</span>
        </div>
      </footer>
    </div>
  )
}
