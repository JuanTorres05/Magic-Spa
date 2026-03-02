import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

const initialForm = {
  clientId: '',
  employeeId: '',
  serviceId: '',
  fecha: '',
  estado: 'pendiente',
  notas: ''
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
    const [appointmentsRes, clientsRes, employeesRes, servicesRes] = await Promise.all([
      api.get('/appointments'),
      api.get('/clients'),
      api.get('/employees'),
      api.get('/services')
    ]);

    setAppointments(appointmentsRes.data);
    setClients(clientsRes.data);
    setEmployees(employeesRes.data);
    setServices(servicesRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setError('No se pudo cargar la información de citas'));
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
      } else {
        await api.post('/appointments', form);
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar cita');
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      clientId: String(item.clientId),
      employeeId: String(item.employeeId),
      serviceId: String(item.serviceId),
      fecha: new Date(item.fecha).toISOString().slice(0, 16),
      estado: item.estado,
      notas: item.notas || ''
    });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/appointments/${id}`);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar cita');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-05 · Gestión de Citas</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="grid" onSubmit={submit}>
          <select name="clientId" value={form.clientId} onChange={onChange} required>
            <option value="">Selecciona cliente</option>
            {clients.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
          <select name="employeeId" value={form.employeeId} onChange={onChange} required>
            <option value="">Selecciona empleado</option>
            {employees.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
          <select name="serviceId" value={form.serviceId} onChange={onChange} required>
            <option value="">Selecciona servicio</option>
            {services.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
          <input name="fecha" type="datetime-local" value={form.fecha} onChange={onChange} required />
          <select name="estado" value={form.estado} onChange={onChange}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="completada">Completada</option>
          </select>
          <input name="notas" placeholder="Notas" value={form.notas} onChange={onChange} />
          <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        </form>
        {error ? <small className="error">{error}</small> : null}
      </div>

      <div className="card">
        <h2>Agenda</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.fecha).toLocaleString()}</td>
                <td>{item.client?.nombre || item.clientId}</td>
                <td>{item.employee?.nombre || item.employeeId}</td>
                <td>{item.service?.nombre || item.serviceId}</td>
                <td>{item.estado}</td>
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
