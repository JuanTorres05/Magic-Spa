import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const appointmentRoutes = Router();

appointmentRoutes.use(authMiddleware);
appointmentRoutes.post('/', createAppointment);
appointmentRoutes.get('/', listAppointments);
appointmentRoutes.put('/:id', updateAppointment);
appointmentRoutes.delete('/:id', deleteAppointment);
