import { useState } from 'react';
import { api } from '../api/client.js';
import { formatCOP } from '../utils/format.js';

export const ReportsPage = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    appointmentsSummary: [], revenueSummary: [], topServices: [], topEmployees: []
  });

  const loadReports = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const params = { ...(start ? { start } : {}), ...(end ? { end } : {}) };
      const [appointments, revenue, topServices, topEmployees] = await Promise.all([
        api.get('/reports/appointments-summary', { params }),
        api.get('/reports/revenue-summary', { params }),
        api.get('/reports/top-services', { params }),
        api.get('/reports/top-employees', { params })
      ]);
      setData({
        appointmentsSummary: appointments.data, revenueSummary: revenue.data,
        topServices: topServices.data, topEmployees: topEmployees.data
      });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar reportes');
    } finally { setLoading(false); }
  };

  const totalRevenue = data.revenueSummary.reduce((s, i) => s + Number(i.ingresos || 0), 0);
  const totalAppointments = data.appointmentsSummary.reduce((s, i) => s + Number(i.total || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>📊 Reportes</h1>
        <p>Estadísticas y resúmenes del negocio</p>
      </div>

      <div className="card">
        <h2>🗓️ Rango de fechas</h2>
        <form className="form-grid" onSubmit={loadReports}>
          <div className="form-group">
            <label>Desde</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Hasta</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="form-group" style={{ alignSelf: 'end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Cargando...' : '📊 Generar reporte'}
            </button>
          </div>
        </form>
        {error && <div className="alert-error">⚠️ {error}</div>}
      </div>

      {(data.appointmentsSummary.length > 0 || data.revenueSummary.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{
            background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)',
            padding: '20px 24px', color: '#fff'
          }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, opacity: .85, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Total de citas
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: 6 }}>{totalAppointments}</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, var(--purple-600), var(--purple-900))',
            borderRadius: 'var(--radius-md)', padding: '20px 24px', color: '#fff'
          }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, opacity: .85, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Ingresos totales
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: 6 }}>{formatCOP(totalRevenue)}</div>
          </div>
        </div>
      )}

      <div className="report-grid">
        <div className="report-card">
          <h3>📅 Citas por día</h3>
          {data.appointmentsSummary.length === 0
            ? <p className="report-empty">Sin datos — genera un reporte</p>
            : data.appointmentsSummary.map((item) => (
              <div key={item.dia} className="report-item">
                <span>{item.dia}</span>
                <span className="report-item-value">{item.total}</span>
              </div>
            ))}
        </div>

        <div className="report-card">
          <h3>💰 Ingresos por día</h3>
          {data.revenueSummary.length === 0
            ? <p className="report-empty">Sin datos — genera un reporte</p>
            : data.revenueSummary.map((item) => (
              <div key={item.dia} className="report-item">
                <span>{item.dia}</span>
                <span className="report-item-value">{formatCOP(item.ingresos)}</span>
              </div>
            ))}
        </div>

        <div className="report-card">
          <h3>✨ Top servicios</h3>
          {data.topServices.length === 0
            ? <p className="report-empty">Sin datos — genera un reporte</p>
            : data.topServices.map((item) => (
              <div key={item.serviceId} className="report-item">
                <span>{item.service?.nombre || `Servicio #${item.serviceId}`}</span>
                <span className="report-item-value">{item.total} citas</span>
              </div>
            ))}
        </div>

        <div className="report-card">
          <h3>👩‍🎨 Top empleadas</h3>
          {data.topEmployees.length === 0
            ? <p className="report-empty">Sin datos — genera un reporte</p>
            : data.topEmployees.map((item) => (
              <div key={item.employeeId} className="report-item">
                <div className="avatar-cell">
                  <div className="avatar" style={{ width: 26, height: 26, fontSize: '.75rem' }}>
                    {(item.employee?.nombre || '?').charAt(0).toUpperCase()}
                  </div>
                  {item.employee?.nombre || `Empleada #${item.employeeId}`}
                </div>
                <span className="report-item-value">{item.total} citas</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
