import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PaginaAdmin from './features/admin/componentes/paginas/PaginaAdmin';
import { ROUTES } from './lib/routes';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-plomo-800 text-plomo-50 px-6 py-3 flex gap-4 border-b border-plomo-600">
        <Link to="/" className="hover:text-amarillo-400">Inicio</Link>
        <Link to={ROUTES.adminBooks} className="hover:text-amarillo-400">
          Panel Admin
        </Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-plomo-900 text-plomo-50 p-8">
              <h1 className="text-3xl font-bold">Biblioteca Universitaria</h1>
              <p className="text-plomo-300 mt-2">
                Ve a <strong className="text-amarillo-400">Panel Admin</strong> para probar.
              </p>
            </div>
          }
        />
        <Route path={ROUTES.adminBooks} element={<PaginaAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}