import { Router } from 'express';
import { health, me } from '../controllers/healthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const healthRoutes = Router();

healthRoutes.get('/health', health);
healthRoutes.get('/me', authMiddleware, me);
