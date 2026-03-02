import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { appointmentsSummary, revenueSummary, topEmployees, topServices } from '../controllers/reportController.js';

export const reportRoutes = Router();

reportRoutes.use(authMiddleware);
reportRoutes.get('/appointments-summary', appointmentsSummary);
reportRoutes.get('/revenue-summary', revenueSummary);
reportRoutes.get('/top-services', topServices);
reportRoutes.get('/top-employees', topEmployees);
