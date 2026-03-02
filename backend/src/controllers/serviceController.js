import { Service } from '../models/Service.js';

const validEstado = new Set(['activo', 'inactivo']);

const validatePayload = ({ nombre, precio, duracionMin, estado }, isCreate = true) => {
  if (isCreate && (nombre === undefined || precio === undefined || duracionMin === undefined)) {
    return 'Nombre, precio y duración son obligatorios';
  }

  if (nombre !== undefined && !String(nombre).trim()) {
    return 'Nombre inválido';
  }

  if (precio !== undefined) {
    const parsed = Number(precio);
    if (Number.isNaN(parsed) || parsed < 0) {
      return 'Precio inválido';
    }
  }

  if (duracionMin !== undefined) {
    const parsed = Number(duracionMin);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return 'Duración inválida';
    }
  }

  if (estado !== undefined && !validEstado.has(estado)) {
    return 'Estado inválido';
  }

  return null;
};

export const createService = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, true);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const service = await Service.create({
      nombre: req.body.nombre.trim(),
      precio: Number(req.body.precio),
      duracionMin: Number(req.body.duracionMin),
      estado: req.body.estado || 'activo'
    });

    return res.status(201).json(service);
  } catch (err) {
    return next(err);
  }
};

export const listServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({ order: [['id', 'DESC']] });
    return res.json(services);
  } catch (err) {
    return next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, false);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado', code: 'NOT_FOUND' });
    }

    await service.update({
      nombre: req.body.nombre !== undefined ? req.body.nombre.trim() : service.nombre,
      precio: req.body.precio !== undefined ? Number(req.body.precio) : service.precio,
      duracionMin: req.body.duracionMin !== undefined ? Number(req.body.duracionMin) : service.duracionMin,
      estado: req.body.estado || service.estado
    });

    return res.json(service);
  } catch (err) {
    return next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado', code: 'NOT_FOUND' });
    }

    await service.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
