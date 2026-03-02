import { Router } from 'express';
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const employeeRoutes = Router();

employeeRoutes.use(authMiddleware);
employeeRoutes.post('/', createEmployee);
employeeRoutes.get('/', listEmployees);
employeeRoutes.put('/:id', updateEmployee);
employeeRoutes.delete('/:id', deleteEmployee);
