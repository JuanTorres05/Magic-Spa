import { Op } from 'sequelize';
import { Client } from '../models/Client.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePayload = ({ nombre, telefono, email }, isCreate = true) => {
  if (isCreate && (!nombre || !telefono)) {
    return 'Nombre y teléfono son obligatorios';
  }

  if (nombre !== undefined && !String(nombre).trim()) {
    return 'Nombre inválido';
  }

  if (telefono !== undefined && !String(telefono).trim()) {
    return 'Teléfono inválido';
  }

  if (email !== undefined && email !== null && String(email).trim() && !emailRegex.test(String(email).trim())) {
    return 'Email inválido';
  }

  return null;
};

export const createClient = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, true);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const client = await Client.create({
      nombre: req.body.nombre.trim(),
      telefono: req.body.telefono.trim(),
      email: req.body.email?.trim() || null,
      notas: req.body.notas?.trim() || null
    });

    return res.status(201).json(client);
  } catch (err) {
    return next(err);
  }
};

export const listClients = async (req, res, next) => {
  try {
    const q = req.query.q?.trim();
    const where = q
      ? {
          [Op.or]: [{ nombre: { [Op.like]: `%${q}%` } }, { telefono: { [Op.like]: `%${q}%` } }]
        }
      : undefined;

    const clients = await Client.findAll({ where, order: [['id', 'DESC']] });
    return res.json(clients);
  } catch (err) {
    return next(err);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, false);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado', code: 'NOT_FOUND' });
    }

    await client.update({
      nombre: req.body.nombre !== undefined ? req.body.nombre.trim() : client.nombre,
      telefono: req.body.telefono !== undefined ? req.body.telefono.trim() : client.telefono,
      email: req.body.email !== undefined ? (req.body.email?.trim() || null) : client.email,
      notas: req.body.notas !== undefined ? (req.body.notas?.trim() || null) : client.notas
    });

    return res.json(client);
  } catch (err) {
    return next(err);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado', code: 'NOT_FOUND' });
    }

    await client.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
