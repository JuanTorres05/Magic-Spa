import { Router } from 'express';
import { createClient, deleteClient, listClients, updateClient } from '../controllers/clientController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const clientRoutes = Router();

clientRoutes.use(authMiddleware);
clientRoutes.post('/', createClient);
clientRoutes.get('/', listClients);
clientRoutes.put('/:id', updateClient);
clientRoutes.delete('/:id', deleteClient);
