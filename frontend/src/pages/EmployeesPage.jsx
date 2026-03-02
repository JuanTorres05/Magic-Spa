import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

const initialForm = { nombre: '', telefono: '', estado: 'activo' };

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    const { data } = await api.get('/employees');
    setEmployees(data);
  };

  useEffect(() => {
    loadEmployees().catch(() => setError('No se pudo cargar empleados'));
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
      } else {
        await api.post('/employees', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadEmployees();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar');
    }
  };

  const edit = (employee) => {
    setEditingId(employee.id);
    setForm({ nombre: employee.nombre, telefono: employee.telefono, estado: employee.estado });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-02 · Gestión de Empleados</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="grid" onSubmit={submit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={onChange} required />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={onChange} required />
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
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.nombre}</td>
                <td>{employee.telefono}</td>
                <td>{employee.estado}</td>
                <td>
                  <button type="button" onClick={() => edit(employee)}>Editar</button>{' '}
                  <button type="button" className="danger" onClick={() => remove(employee.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
