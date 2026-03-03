import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const initialForm = {
  clientId: '', employeeId: '', serviceId: '',
  fecha: '', estado: 'pendiente', notas: ''
};

const ESTADO_LABELS = {
  pendiente: { label: 'Pendiente', emoji: '🕐' },
  confirmada: { label: 'Confirmada', emoji: '✅' },
  completada: { label: 'Completada', emoji: '🎉' },
  cancelada: { label: 'Cancelada', emoji: '❌' },
};

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    const [a, c, e, s] = await Promise.all([
      api.get('/appointments'), api.get('/clients'),
      api.get('/employees'), api.get('/services')
    ]);
    setAppointments(a.data); setClients(c.data);
    setEmployees(e.data); setServices(s.data);
  };

  useEffect(() => { loadData().catch(() => setError('No se pudo cargar información')); }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      editingId
        ? await api.put(`/appointments/${editingId}`, form)
        : await api.post('/appointments', form);
      setForm(initialForm); setEditingId(null); await loadData();
    } catch (err) { setError(err.response?.data?.message || 'No se pudo guardar cita'); }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      clientId: String(item.clientId), employeeId: String(item.employeeId),
      serviceId: String(item.serviceId),
      fecha: new Date(item.fecha).toISOString().slice(0, 16),
      estado: item.estado, notas: item.notas || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancel = () => { setEditingId(null); setForm(initialForm); setError(''); };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    setError('');
    try { await api.delete(`/appointments/${id}`); await loadData(); }
    catch (err) { setError(err.response?.data?.message || 'No se pudo eliminar'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📅 Citas</h1>
        <p>Agenda y gestión de citas</p>
      </div>

      <div className="card">
        <h2>{editingId ? '✏️ Editar cita' : '➕ Nueva cita'}</h2>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-group">
            <label>Clienta</label>
            <select name="clientId" value={form.clientId} onChange={onChange} required>
              <option value="">Selecciona clienta</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Empleada</label>
            <select name="employeeId" value={form.employeeId} onChange={onChange} required>
              <option value="">Selecciona empleada</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Servicio</label>
            <select name="serviceId" value={form.serviceId} onChange={onChange} required>
              <option value="">Selecciona servicio</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha y hora</label>
            <input name="fecha" type="datetime-local" value={form.fecha} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={onChange}>
              {Object.entries(ESTADO_LABELS).map(([k, v]) =>
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Notas</label>
            <input name="notas" placeholder="Observaciones..." value={form.notas} onChange={onChange} />
          </div>
          <div className="form-group" style={{ alignSelf: 'end', display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Actualizar' : '✨ Crear'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={cancel}>Cancelar</button>}
          </div>
        </form>
        {error && <div className="alert-error">⚠️ {error}</div>}
      </div>

      <div className="card">
        <h2>📋 Agenda</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Clienta</th>
                <th>Empleada</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No hay citas agendadas
                </td></tr>
              ) : appointments.map((item) => {
                const est = ESTADO_LABELS[item.estado] || { label: item.estado, emoji: '❓' };
                return (
                  <tr key={item.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      📅 {new Date(item.fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td><div className="avatar-cell">
                      <div className="avatar" style={{ width: 26, height: 26, fontSize: '.75rem' }}>
                        {(item.client?.nombre || '?').charAt(0).toUpperCase()}
                      </div>
                      {item.client?.nombre || item.clientId}
                    </div></td>
                    <td>{item.employee?.nombre || item.employeeId}</td>
                    <td>{item.service?.nombre || item.serviceId}</td>
                    <td><span className={`badge badge-${item.estado}`}>{est.emoji} {est.label}</span></td>
                    <td>
                      <div className="btn-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => edit(item)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
