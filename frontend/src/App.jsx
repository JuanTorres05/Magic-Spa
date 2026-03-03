import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { EmployeesPage } from './pages/EmployeesPage.jsx';
import { ClientsPage } from './pages/ClientsPage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { AppointmentsPage } from './pages/AppointmentsPage.jsx';
import { PaymentsPage } from './pages/PaymentsPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
    <Route path="/employees" element={<ProtectedLayout><EmployeesPage /></ProtectedLayout>} />
    <Route path="/clients" element={<ProtectedLayout><ClientsPage /></ProtectedLayout>} />
    <Route path="/services" element={<ProtectedLayout><ServicesPage /></ProtectedLayout>} />
    <Route path="/appointments" element={<ProtectedLayout><AppointmentsPage /></ProtectedLayout>} />
    <Route path="/payments" element={<ProtectedLayout><PaymentsPage /></ProtectedLayout>} />
    <Route path="/reports" element={<ProtectedLayout><ReportsPage /></ProtectedLayout>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
