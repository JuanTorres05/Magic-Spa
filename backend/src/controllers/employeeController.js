import { Employee } from '../models/Employee.js';

const validEstado = new Set(['activo', 'inactivo']);

const validatePayload = ({ nombre, telefono, estado }, isCreate = true) => {
  if (isCreate && (!nombre || !telefono)) {
    return 'Nombre y teléfono son obligatorios';
  }

  if (nombre !== undefined && !String(nombre).trim()) {
    return 'Nombre inválido';
  }

  if (telefono !== undefined && !String(telefono).trim()) {
    return 'Teléfono inválido';
  }

  if (estado !== undefined && !validEstado.has(estado)) {
    return 'Estado inválido';
  }

  return null;
};

export const createEmployee = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, true);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const employee = await Employee.create({
      nombre: req.body.nombre.trim(),
      telefono: req.body.telefono.trim(),
      estado: req.body.estado || 'activo'
    });

    return res.status(201).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({ order: [['id', 'DESC']] });
    return res.json(employees);
  } catch (err) {
    return next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, false);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado', code: 'NOT_FOUND' });
    }

    await employee.update({
      nombre: req.body.nombre !== undefined ? req.body.nombre.trim() : employee.nombre,
      telefono: req.body.telefono !== undefined ? req.body.telefono.trim() : employee.telefono,
      estado: req.body.estado || employee.estado
    });

    return res.json(employee);
  } catch (err) {
    return next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado', code: 'NOT_FOUND' });
    }

    await employee.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
