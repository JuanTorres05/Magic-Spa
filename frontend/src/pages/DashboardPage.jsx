import { Link, useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <section className="centered-container">
      <div className="card">
        <h1>Dashboard</h1>
        <p>Autenticación HU-01 completada.</p>
        <p><Link to="/employees">Ir a HU-02 · Gestión de Empleados</Link></p>
        <p><Link to="/clients">Ir a HU-03 · Gestión de Clientes</Link></p>
        <p><Link to="/services">Ir a HU-04 · Gestión de Servicios</Link></p>
        <p><Link to="/appointments">Ir a HU-05 · Gestión de Citas</Link></p>
        <p><Link to="/payments">Ir a HU-06 · Registro de Pagos</Link></p>
        <p><Link to="/reports">Ir a HU-07 · Reportes Básicos</Link></p>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </div>
    </section>
  );
};
