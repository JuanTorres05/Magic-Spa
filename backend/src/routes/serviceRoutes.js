import { Router } from 'express';
import { createService, deleteService, listServices, updateService } from '../controllers/serviceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const serviceRoutes = Router();

serviceRoutes.use(authMiddleware);
serviceRoutes.post('/', createService);
serviceRoutes.get('/', listServices);
serviceRoutes.put('/:id', updateService);
serviceRoutes.delete('/:id', deleteService);
