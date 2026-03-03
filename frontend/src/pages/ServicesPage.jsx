import { useEffect, useState } from 'react';
import { formatCOP } from '../utils/format.js';
import { api } from '../api/client.js';

const initialForm = { nombre: '', precio: '', duracionMin: '', estado: 'activo' };

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { const { data } = await api.get('/services'); setServices(data); };

  useEffect(() => { load().catch(() => setError('No se pudo cargar servicios')); }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      editingId
        ? await api.put(`/services/${editingId}`, form)
        : await api.post('/services', form);
      setForm(initialForm); setEditingId(null); setShowForm(false);
      await load();
    } catch (err) { setError(err.response?.data?.message || 'No se pudo guardar servicio'); }
  };

  const edit = (s) => {
    setEditingId(s.id);
    setForm({ nombre: s.nombre, precio: s.precio, duracionMin: s.duracionMin, estado: s.estado });
    setShowForm(true);
  };

  const cancel = () => { setEditingId(null); setForm(initialForm); setShowForm(false); setError(''); };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    setError('');
    try { await api.delete(`/services/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'No se pudo eliminar'); }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>✨ Servicios</h1>
          <p>Catálogo de tratamientos y servicios</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ Nuevo servicio
          </button>
        )}
      </div>

      {(showForm || editingId) && (
        <div className="card">
          <h2>{editingId ? '✏️ Editar servicio' : '➕ Nuevo servicio'}</h2>
          <form className="form-grid" onSubmit={submit}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" placeholder="Ej. Manicure gel" value={form.nombre} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Precio ($)</label>
              <input name="precio" type="number" min="0" step="0.01" placeholder="0.00" value={form.precio} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Duración (min)</label>
              <input name="duracionMin" type="number" min="1" placeholder="60" value={form.duracionMin} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={onChange}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'end', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">{editingId ? '💾 Actualizar' : '✨ Crear'}</button>
              <button type="button" className="btn btn-outline" onClick={cancel}>Cancelar</button>
            </div>
          </form>
          {error && <div className="alert-error">⚠️ {error}</div>}
        </div>
      )}

      {error && !showForm && <div className="alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

      {services.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✨</div>
          <p>No hay servicios registrados aún</p>
        </div>
      ) : (
        <div className="service-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-card-name">✨ {s.nombre}</div>
              <div className="service-card-price">{formatCOP(s.precio)}</div>
              <div className="service-card-meta">⏱️ {s.duracionMin} min</div>
              <span className={`badge badge-${s.estado}`}>{s.estado}</span>
              <div className="service-card-actions">
                <button className="btn btn-outline btn-sm" onClick={() => edit(s)}>✏️ Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
