import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const initialForm = { nombre: '', telefono: '', email: '', notas: '' };

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async (q = '') => {
    const { data } = await api.get('/clients', { params: q ? { q } : {} });
    setClients(data);
  };

  useEffect(() => { load().catch(() => setError('No se pudo cargar clientas')); }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      editingId
        ? await api.put(`/clients/${editingId}`, form)
        : await api.post('/clients', form);
      setForm(initialForm); setEditingId(null);
      await load(search);
    } catch (err) { setError(err.response?.data?.message || 'No se pudo guardar'); }
  };

  const edit = (c) => {
    setEditingId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email || '', notas: c.notas || '' });
  };

  const cancel = () => { setEditingId(null); setForm(initialForm); setError(''); };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta clienta?')) return;
    setError('');
    try { await api.delete(`/clients/${id}`); await load(search); }
    catch (err) { setError(err.response?.data?.message || 'No se pudo eliminar'); }
  };

  const onSearch = async (e) => {
    e.preventDefault(); setError('');
    try { await load(search); }
    catch { setError('No se pudo filtrar'); }
  };

  const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#db2777', '#9333ea'];
  const avatarColor = (name) => colors[name.charCodeAt(0) % colors.length];

  return (
    <div>
      <div className="page-header">
        <h1>💝 Clientas</h1>
        <p>Base de datos de clientas del spa</p>
      </div>

      <div className="card">
        <h2>{editingId ? '✏️ Editar clienta' : '➕ Nueva clienta'}</h2>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input name="telefono" placeholder="Ej. 555-1234" value={form.telefono} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email (opcional)</label>
            <input name="email" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Notas</label>
            <input name="notas" placeholder="Alergias, preferencias..." value={form.notas} onChange={onChange} />
          </div>
          <div className="form-group" style={{ alignSelf: 'end', display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Actualizar' : '✨ Crear'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={cancel}>Cancelar</button>}
          </div>
        </form>
        {error && <div className="alert-error">⚠️ {error}</div>}
      </div>

      <div className="card">
        <h2>📋 Listado</h2>
        <form className="search-row" onSubmit={onSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar por nombre o teléfono..."
          />
          <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Clienta</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No hay clientas registradas
                </td></tr>
              ) : clients.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="avatar-cell">
                      <div className="avatar" style={{ background: avatarColor(c.nombre) }}>
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <strong>{c.nombre}</strong>
                    </div>
                  </td>
                  <td>{c.telefono}</td>
                  <td>{c.email || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.notas || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <div className="btn-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => edit(c)}>✏️ Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>🗑️ Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
