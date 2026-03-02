import cors from 'cors';
import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { employeeRoutes } from './routes/employeeRoutes.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { serviceRoutes } from './routes/serviceRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import { paymentRoutes } from './routes/paymentRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: 'Error interno del servidor',
    code: 'INTERNAL_ERROR'
  });
});
