import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/employees', icon: '👩‍🎨', label: 'Empleadas', desc: 'Gestión del equipo' },
  { to: '/clients', icon: '💝', label: 'Clientas', desc: 'Base de clientas' },
  { to: '/services', icon: '✨', label: 'Servicios', desc: 'Catálogo de servicios' },
  { to: '/appointments', icon: '📅', label: 'Citas', desc: 'Agenda del día' },
  { to: '/payments', icon: '💳', label: 'Pagos', desc: 'Historial de cobros' },
  { to: '/reports', icon: '📊', label: 'Reportes', desc: 'Estadísticas' },
];

export const DashboardPage = () => (
  <div>
    <div className="page-header">
      <h1>¡Bienvenida a Magic Spa! ✨</h1>
      <p>Selecciona una sección para comenzar</p>
    </div>

    <div className="stat-grid">
      {QUICK_LINKS.map((item) => (
        <Link key={item.to} to={item.to} className="stat-card">
          <div className="stat-card-icon">{item.icon}</div>
          <div className="stat-card-label">{item.label}</div>
          <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {item.desc}
          </div>
          <div className="stat-card-arrow">→ Ver más</div>
        </Link>
      ))}
    </div>
  </div>
);
