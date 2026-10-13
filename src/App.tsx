import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage, RegisterPage, UsersPage } from './features/users/UsersPages'
import { get, KEYS, set } from './lib/storage'
import { ROUTES } from './lib/routes'
import type { Session } from './features/users/types'
import PaginaAdmin from './features/admin/componentes/paginas/PaginaAdmin'
import Catalog from './features/loans/Catalog'
import LoanRequest from './features/loans/LoanRequest'
import MyLoans from './features/history/MyLoans'
import ReceiptView from './features/receipt/ReceiptView'

function App() {
  const [session, setSession] = useState<Session | null>(() => get<Session | null>(KEYS.session, null))

  const signIn = (nextSession: Session) => {
    set(KEYS.session, nextSession)
    setSession(nextSession)
  }

  const signOut = () => {
    localStorage.removeItem(KEYS.session)
    setSession(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout session={session} onSignOut={signOut} />}>
          <Route
            path={ROUTES.login}
            element={session ? <Navigate to={session.role === 'admin' ? ROUTES.adminUsers : ROUTES.catalog} replace /> : <LoginPage onSignIn={signIn} />}
          />
          <Route path={ROUTES.register} element={session ? <Navigate to={session.role === 'admin' ? ROUTES.adminUsers : ROUTES.catalog} replace /> : <RegisterPage onSignIn={signIn} />} />
          <Route
            path={ROUTES.adminUsers}
            element={
              <ProtectedRoute session={session} requiredRole="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminBooks}
            element={
              <ProtectedRoute session={session} requiredRole="admin">
                <PaginaAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminCategories}
            element={
              <ProtectedRoute session={session} requiredRole="admin">
                <PaginaAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminLoans}
            element={
              <ProtectedRoute session={session} requiredRole="admin">
                <PaginaAdmin showLoansOnly />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.catalog}
            element={
              <ProtectedRoute session={session} requiredRole="user">
                <Catalog />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.loan}
            element={
              <ProtectedRoute session={session} requiredRole="user">
                <LoanRequest userId={session?.userId ?? ''} />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.myLoans}
            element={
              <ProtectedRoute session={session} requiredRole="user">
                <MyLoans userId={session?.userId} />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.receipt}
            element={session
              ? <ReceiptView session={session} />
              : <Navigate to={ROUTES.login} replace />}
          />
          <Route path="*" element={<Navigate to={session ? (session.role === 'admin' ? ROUTES.adminUsers : ROUTES.catalog) : ROUTES.login} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
