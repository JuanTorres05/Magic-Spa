import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

const initialForm = { nombre: '', telefono: '', email: '', notas: '' };

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadClients = async (query = '') => {
    const { data } = await api.get('/clients', { params: query ? { q: query } : {} });
    setClients(data);
  };

  useEffect(() => {
    loadClients().catch(() => setError('No se pudo cargar clientes'));
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
      } else {
        await api.post('/clients', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadClients(search);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar');
    }
  };

  const edit = (client) => {
    setEditingId(client.id);
    setForm({
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.email || '',
      notas: client.notas || ''
    });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/clients/${id}`);
      await loadClients(search);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar');
    }
  };

  const onSearch = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await loadClients(search);
    } catch {
      setError('No se pudo filtrar clientes');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-03 · Gestión de Clientes</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="grid" onSubmit={submit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={onChange} required />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email (opcional)" value={form.email} onChange={onChange} />
          <input name="notas" placeholder="Notas (opcional)" value={form.notas} onChange={onChange} />
          <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        </form>
        {error ? <small className="error">{error}</small> : null}
      </div>

      <div className="card">
        <h2>Listado</h2>
        <form className="search-row" onSubmit={onSearch}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o teléfono" />
          <button type="submit">Buscar</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.nombre}</td>
                <td>{client.telefono}</td>
                <td>{client.email || '-'}</td>
                <td>{client.notas || '-'}</td>
                <td>
                  <button type="button" onClick={() => edit(client)}>Editar</button>{' '}
                  <button type="button" className="danger" onClick={() => remove(client.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
