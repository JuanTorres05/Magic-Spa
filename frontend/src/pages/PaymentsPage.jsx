import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

const initialForm = {
  appointmentId: '',
  monto: '',
  metodoPago: 'efectivo',
  fecha: '',
  referencia: ''
};

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    const [paymentsRes, appointmentsRes] = await Promise.all([api.get('/payments'), api.get('/appointments')]);
    setPayments(paymentsRes.data);
    setAppointments(appointmentsRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setError('No se pudo cargar pagos'));
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/payments/${editingId}`, form);
      } else {
        await api.post('/payments', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar pago');
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      appointmentId: String(item.appointmentId),
      monto: item.monto,
      metodoPago: item.metodoPago,
      fecha: new Date(item.fecha).toISOString().slice(0, 16),
      referencia: item.referencia || ''
    });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/payments/${id}`);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar pago');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-06 · Registro de Pagos</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="grid" onSubmit={submit}>
          <select name="appointmentId" value={form.appointmentId} onChange={onChange} required>
            <option value="">Selecciona cita</option>
            {appointments.map((item) => (
              <option key={item.id} value={item.id}>#{item.id} · {new Date(item.fecha).toLocaleString()}</option>
            ))}
          </select>
          <input name="monto" type="number" min="0" step="0.01" placeholder="Monto" value={form.monto} onChange={onChange} required />
          <select name="metodoPago" value={form.metodoPago} onChange={onChange}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="otro">Otro</option>
          </select>
          <input name="fecha" type="datetime-local" value={form.fecha} onChange={onChange} required />
          <input name="referencia" placeholder="Referencia (opcional)" value={form.referencia} onChange={onChange} />
          <button type="submit">{editingId ? 'Actualizar' : 'Registrar'}</button>
        </form>
        {error ? <small className="error">{error}</small> : null}
      </div>

      <div className="card">
        <h2>Historial</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cita</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Referencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.appointmentId}</td>
                <td>${item.monto}</td>
                <td>{item.metodoPago}</td>
                <td>{new Date(item.fecha).toLocaleString()}</td>
                <td>{item.referencia || '-'}</td>
                <td>
                  <button type="button" onClick={() => edit(item)}>Editar</button>{' '}
                  <button type="button" className="danger" onClick={() => remove(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
