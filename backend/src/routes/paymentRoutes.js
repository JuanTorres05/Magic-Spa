import { Router } from 'express';
import { createPayment, deletePayment, listPayments, updatePayment } from '../controllers/paymentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const paymentRoutes = Router();

paymentRoutes.use(authMiddleware);
paymentRoutes.post('/', createPayment);
paymentRoutes.get('/', listPayments);
paymentRoutes.put('/:id', updatePayment);
paymentRoutes.delete('/:id', deletePayment);
