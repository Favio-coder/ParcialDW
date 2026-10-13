import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FolderTree,
  Users,
  BookMarked,
  History,
  Bell,
  ChevronRight,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  breadcrumb: string;
  userName?: string;
  userRole?: string;
}

const menu = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/admin/libros', label: 'Libros', icon: BookOpen },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/prestamos', label: 'Préstamos', icon: BookMarked },
  { to: '/historial', label: 'Historial', icon: History },
];

export default function Layout({
  children,
  breadcrumb,
  userName = 'GONZALES QUIÑONEZ BRITTANY',
  userRole = 'Administrador',
}: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-plomo-100">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 bg-uncp-900 flex flex-col shrink-0 shadow-xl">
        <div className="bg-white px-5 py-4 flex items-center gap-3 border-b-4 border-amarillo-500">
          <img
            src="/logo-uncp.png"
            alt="UNCP"
            className="h-12 w-12 object-contain shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="leading-tight">
            <p className="text-2xl font-black text-uncp-900 tracking-tight">
              UNCP
            </p>
            <p className="text-[10px] text-plomo-500 font-medium uppercase tracking-wide">
              Biblioteca Central
            </p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menu.map(({ to, label, icon: Icon }) => {
            const activo = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-1.5 py-3.5 px-3 mx-3 my-1 rounded-lg text-center text-xs font-medium transition-all ${
                  activo
                    ? 'bg-uncp-700 text-white shadow-lg'
                    : 'text-white/75 hover:bg-uncp-800 hover:text-white'
                }`}
              >
                {activo && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-1 bg-amarillo-500 rounded-r" />
                )}
                <Icon size={22} strokeWidth={activo ? 2.4 : 2} />
                <span className="leading-tight">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 bg-uncp-950 text-[10px] text-white/50 text-center border-t border-uncp-800">
          © {new Date().getFullYear()} UNCP — Todos los derechos reservados
        </div>
      </aside>

      {/* ============ CONTENIDO ============ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-plomo-200 h-16 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <Home size={16} className="text-plomo-400" />
            <ChevronRight size={14} className="text-plomo-300" />
            <span className="text-plomo-800 font-medium">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="relative text-plomo-500 hover:text-uncp-700 transition"
              title="Notificaciones"
            >
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amarillo-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-8 w-px bg-plomo-200" />

            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-xs font-bold text-plomo-800 uppercase">
                  {userName}
                </p>
                <p className="text-[10px] text-uncp-600 font-semibold">
                  {userRole}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-uncp-700 text-white flex items-center justify-center font-bold text-sm ring-2 ring-amarillo-500">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main con más respiración */}
        <main className="flex-1 overflow-y-auto bg-plomo-100 px-10 py-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}