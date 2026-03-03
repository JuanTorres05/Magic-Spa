import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '/dashboard', icon: '💅', label: 'Inicio' },
    { to: '/employees', icon: '👩‍🎨', label: 'Empleadas' },
    { to: '/clients', icon: '💝', label: 'Clientas' },
    { to: '/services', icon: '✨', label: 'Servicios' },
    { to: '/appointments', icon: '📅', label: 'Citas' },
    { to: '/payments', icon: '💳', label: 'Pagos' },
    { to: '/reports', icon: '📊', label: 'Reportes' },
];

export const Layout = ({ children }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>💅 Magic Spa</h2>
                    <span>Panel de administración</span>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? ' active' : ''}`
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button type="button" className="sidebar-logout" onClick={logout}>
                        <span className="sidebar-icon">🚪</span>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};
