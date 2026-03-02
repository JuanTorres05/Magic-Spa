import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

const initialForm = { nombre: '', precio: '', duracionMin: '', estado: 'activo' };

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadServices = async () => {
    const { data } = await api.get('/services');
    setServices(data);
  };

  useEffect(() => {
    loadServices().catch(() => setError('No se pudo cargar servicios'));
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, form);
      } else {
        await api.post('/services', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadServices();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar servicio');
    }
  };

  const edit = (service) => {
    setEditingId(service.id);
    setForm({
      nombre: service.nombre,
      precio: service.precio,
      duracionMin: service.duracionMin,
      estado: service.estado
    });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/services/${id}`);
      await loadServices();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar servicio');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-04 · Gestión de Servicios</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="grid" onSubmit={submit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={onChange} required />
          <input name="precio" type="number" min="0" step="0.01" placeholder="Precio" value={form.precio} onChange={onChange} required />
          <input name="duracionMin" type="number" min="1" step="1" placeholder="Duración (min)" value={form.duracionMin} onChange={onChange} required />
          <select name="estado" value={form.estado} onChange={onChange}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        </form>
        {error ? <small className="error">{error}</small> : null}
      </div>

      <div className="card">
        <h2>Listado</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.nombre}</td>
                <td>${service.precio}</td>
                <td>{service.duracionMin} min</td>
                <td>{service.estado}</td>
                <td>
                  <button type="button" onClick={() => edit(service)}>Editar</button>{' '}
                  <button type="button" className="danger" onClick={() => remove(service.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
