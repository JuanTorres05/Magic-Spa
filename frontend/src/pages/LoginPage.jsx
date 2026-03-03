import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <h1>💅 Magic Spa</h1>
          <p>Panel de administración</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@magicspa.local"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <div className="pass-wrap">
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : '✨ Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};
