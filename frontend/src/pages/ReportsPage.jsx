import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export const ReportsPage = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState({
    appointmentsSummary: [],
    revenueSummary: [],
    topServices: [],
    topEmployees: []
  });

  const loadReports = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const params = { ...(start ? { start } : {}), ...(end ? { end } : {}) };
      const [appointments, revenue, topServices, topEmployees] = await Promise.all([
        api.get('/reports/appointments-summary', { params }),
        api.get('/reports/revenue-summary', { params }),
        api.get('/reports/top-services', { params }),
        api.get('/reports/top-employees', { params })
      ]);

      setData({
        appointmentsSummary: appointments.data,
        revenueSummary: revenue.data,
        topServices: topServices.data,
        topEmployees: topEmployees.data
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudieron cargar reportes');
    }
  };

  return (
    <section className="page-container">
      <div className="card">
        <h1>HU-07 · Reportes Básicos</h1>
        <p><Link to="/dashboard">← Volver al dashboard</Link></p>
        <form className="search-row" onSubmit={loadReports}>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          <button type="submit">Cargar</button>
        </form>
        {error ? <small className="error">{error}</small> : null}
      </div>

      <div className="card">
        <h2>Citas por día</h2>
        <ul>
          {data.appointmentsSummary.map((item) => (
            <li key={`a-${item.dia}`}>{item.dia}: {item.total}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Ingresos por día</h2>
        <ul>
          {data.revenueSummary.map((item) => (
            <li key={`r-${item.dia}`}>{item.dia}: ${item.ingresos}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Top servicios</h2>
        <ul>
          {data.topServices.map((item) => (
            <li key={`s-${item.serviceId}`}>{item.service?.nombre || item.serviceId}: {item.total}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Top empleados</h2>
        <ul>
          {data.topEmployees.map((item) => (
            <li key={`e-${item.employeeId}`}>{item.employee?.nombre || item.employeeId}: {item.total}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
