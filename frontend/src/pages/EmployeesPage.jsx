import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const initialForm = { nombre: '', telefono: '', estado: 'activo' };

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/employees');
    setEmployees(data);
  };

  useEffect(() => { load().catch(() => setError('No se pudo cargar empleadas')); }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      editingId
        ? await api.put(`/employees/${editingId}`, form)
        : await api.post('/employees', form);
      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar');
    }
  };

  const edit = (emp) => {
    setEditingId(emp.id);
    setForm({ nombre: emp.nombre, telefono: emp.telefono, estado: emp.estado });
  };

  const cancel = () => { setEditingId(null); setForm(initialForm); setError(''); };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta empleada?')) return;
    setError('');
    try { await api.delete(`/employees/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'No se pudo eliminar'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>👩‍🎨 Empleadas</h1>
        <p>Gestión del equipo de trabajo</p>
      </div>

      <div className="card">
        <h2>{editingId ? '✏️ Editar empleada' : '➕ Nueva empleada'}</h2>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="emp-nombre">Nombre</label>
            <input id="emp-nombre" name="nombre" placeholder="Nombre completo"
              value={form.nombre} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="emp-tel">Teléfono</label>
            <input id="emp-tel" name="telefono" placeholder="Ej. 555-1234"
              value={form.telefono} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="emp-estado">Estado</label>
            <select id="emp-estado" name="estado" value={form.estado} onChange={onChange}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="form-group" style={{ alignSelf: 'end', display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Actualizar' : '✨ Crear'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={cancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
        {error && <div className="alert-error">⚠️ {error}</div>}
      </div>

      <div className="card">
        <h2>📋 Listado</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Empleada</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No hay empleadas registradas
                </td></tr>
              ) : employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="avatar-cell">
                      <div className="avatar">{emp.nombre.charAt(0).toUpperCase()}</div>
                      <strong>{emp.nombre}</strong>
                    </div>
                  </td>
                  <td>{emp.telefono}</td>
                  <td><span className={`badge badge-${emp.estado}`}>{emp.estado}</span></td>
                  <td>
                    <div className="btn-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => edit(emp)}>✏️ Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(emp.id)}>🗑️ Eliminar</button>
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
