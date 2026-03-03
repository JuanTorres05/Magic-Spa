import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { formatCOP } from '../utils/format.js';

const initialForm = { appointmentId: '', monto: '', metodoPago: 'efectivo', fecha: '', referencia: '' };

const METODO_ICONS = {
  efectivo: '💵', tarjeta: '💳', transferencia: '🏦', otro: '💰'
};

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    const [p, a] = await Promise.all([api.get('/payments'), api.get('/appointments')]);
    setPayments(p.data); setAppointments(a.data);
  };

  useEffect(() => { loadData().catch(() => setError('No se pudo cargar pagos')); }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      editingId
        ? await api.put(`/payments/${editingId}`, form)
        : await api.post('/payments', form);
      setForm(initialForm); setEditingId(null); await loadData();
    } catch (err) { setError(err.response?.data?.message || 'No se pudo guardar pago'); }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      appointmentId: String(item.appointmentId), monto: item.monto,
      metodoPago: item.metodoPago,
      fecha: new Date(item.fecha).toISOString().slice(0, 16),
      referencia: item.referencia || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancel = () => { setEditingId(null); setForm(initialForm); setError(''); };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este pago?')) return;
    setError('');
    try { await api.delete(`/payments/${id}`); await loadData(); }
    catch (err) { setError(err.response?.data?.message || 'No se pudo eliminar'); }
  };

  const total = payments.reduce((sum, p) => sum + Number(p.monto || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>💳 Pagos</h1>
        <p>Registro y historial de cobros</p>
      </div>

      <div className="card">
        <h2>{editingId ? '✏️ Editar pago' : '➕ Registrar pago'}</h2>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-group">
            <label>Cita</label>
            <select name="appointmentId" value={form.appointmentId} onChange={onChange} required>
              <option value="">Selecciona la cita</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} · {a.client?.nombre || `Cliente ${a.clientId}`} — {new Date(a.fecha).toLocaleDateString('es-MX')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monto ($)</label>
            <input name="monto" type="number" min="0" step="0.01" placeholder="0.00"
              value={form.monto} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Método de pago</label>
            <select name="metodoPago" value={form.metodoPago} onChange={onChange}>
              <option value="efectivo">💵 Efectivo</option>
              <option value="tarjeta">💳 Tarjeta</option>
              <option value="transferencia">🏦 Transferencia</option>
              <option value="otro">💰 Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha y hora</label>
            <input name="fecha" type="datetime-local" value={form.fecha} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Referencia (opcional)</label>
            <input name="referencia" placeholder="Nro. de operación..." value={form.referencia} onChange={onChange} />
          </div>
          <div className="form-group" style={{ alignSelf: 'end', display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Actualizar' : '✨ Registrar'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={cancel}>Cancelar</button>}
          </div>
        </form>
        {error && <div className="alert-error">⚠️ {error}</div>}
      </div>

      {payments.length > 0 && (
        <div style={{
          background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)',
          padding: '16px 22px', marginBottom: 16, color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>💰 Total recaudado</span>
          <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>{formatCOP(total)}</span>
        </div>
      )}

      <div className="card">
        <h2>📋 Historial</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Cita</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Referencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No hay pagos registrados
                </td></tr>
              ) : payments.map((item) => (
                <tr key={item.id}>
                  <td>Cita #{item.appointmentId}</td>
                  <td><span className="amount">{formatCOP(item.monto)}</span></td>
                  <td>
                    <span className={`badge badge-${item.metodoPago}`}>
                      {METODO_ICONS[item.metodoPago] || '💰'} {item.metodoPago}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(item.fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td>{item.referencia || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td>
                    <div className="btn-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => edit(item)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>🗑️</button>
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
