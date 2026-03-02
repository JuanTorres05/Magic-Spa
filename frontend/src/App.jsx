import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { EmployeesPage } from './pages/EmployeesPage.jsx';
import { ClientsPage } from './pages/ClientsPage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { AppointmentsPage } from './pages/AppointmentsPage.jsx';
import { PaymentsPage } from './pages/PaymentsPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/dashboard"
      element={(
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/employees"
      element={(
        <ProtectedRoute>
          <EmployeesPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/clients"
      element={(
        <ProtectedRoute>
          <ClientsPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/services"
      element={(
        <ProtectedRoute>
          <ServicesPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/appointments"
      element={(
        <ProtectedRoute>
          <AppointmentsPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/payments"
      element={(
        <ProtectedRoute>
          <PaymentsPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/reports"
      element={(
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      )}
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
