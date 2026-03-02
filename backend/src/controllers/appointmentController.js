import { Op } from 'sequelize';
import { Appointment } from '../models/Appointment.js';
import { Client } from '../models/Client.js';
import { Employee } from '../models/Employee.js';
import { Service } from '../models/Service.js';

const validEstado = new Set(['pendiente', 'confirmada', 'cancelada', 'completada']);

const validatePayload = ({ clientId, employeeId, serviceId, fecha, estado }, isCreate = true) => {
  if (isCreate && (!clientId || !employeeId || !serviceId || !fecha)) {
    return 'Cliente, empleado, servicio y fecha son obligatorios';
  }

  for (const [key, value] of Object.entries({ clientId, employeeId, serviceId })) {
    if (value !== undefined) {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return `${key} inválido`;
      }
    }
  }

  if (fecha !== undefined) {
    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) {
      return 'Fecha inválida';
    }
  }

  if (estado !== undefined && !validEstado.has(estado)) {
    return 'Estado inválido';
  }

  return null;
};

const hasEmployeeOverlap = async ({ appointmentId, employeeId, startDate, durationMin }) => {
  const otherAppointments = await Appointment.findAll({
    where: {
      employeeId,
      estado: { [Op.in]: ['pendiente', 'confirmada'] },
      ...(appointmentId ? { id: { [Op.ne]: appointmentId } } : {})
    },
    include: [{ model: Service, as: 'service', attributes: ['duracionMin'] }]
  });

  const startMs = startDate.getTime();
  const endMs = startMs + durationMin * 60 * 1000;

  return otherAppointments.some((item) => {
    const itemStart = new Date(item.fecha).getTime();
    const itemDuration = Number(item.service?.duracionMin || 0);
    const itemEnd = itemStart + itemDuration * 60 * 1000;
    return startMs < itemEnd && itemStart < endMs;
  });
};

const resolveEntities = async ({ clientId, employeeId, serviceId }) => {
  const [client, employee, service] = await Promise.all([
    clientId ? Client.findByPk(clientId) : null,
    employeeId ? Employee.findByPk(employeeId) : null,
    serviceId ? Service.findByPk(serviceId) : null
  ]);

  return { client, employee, service };
};

export const createAppointment = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, true);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const payload = {
      clientId: Number(req.body.clientId),
      employeeId: Number(req.body.employeeId),
      serviceId: Number(req.body.serviceId),
      fecha: new Date(req.body.fecha),
      estado: req.body.estado || 'pendiente',
      notas: req.body.notas?.trim() || null
    };

    const { client, employee, service } = await resolveEntities(payload);

    if (!client || !employee || !service) {
      return res.status(400).json({ message: 'Cliente/empleado/servicio no válido', code: 'RELATION_ERROR' });
    }

    const overlap = await hasEmployeeOverlap({
      employeeId: payload.employeeId,
      startDate: payload.fecha,
      durationMin: Number(service.duracionMin)
    });

    if (overlap) {
      return res.status(409).json({ message: 'El empleado ya tiene una cita en ese horario', code: 'SCHEDULE_CONFLICT' });
    }

    const appointment = await Appointment.create(payload);
    return res.status(201).json(appointment);
  } catch (err) {
    return next(err);
  }
};

export const listAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Client, as: 'client', attributes: ['id', 'nombre', 'telefono'] },
        { model: Employee, as: 'employee', attributes: ['id', 'nombre'] },
        { model: Service, as: 'service', attributes: ['id', 'nombre', 'duracionMin'] }
      ],
      order: [['fecha', 'ASC']]
    });

    return res.json(appointments);
  } catch (err) {
    return next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, false);
    if (error) {
      return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });
    }

    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada', code: 'NOT_FOUND' });
    }

    const payload = {
      clientId: req.body.clientId !== undefined ? Number(req.body.clientId) : appointment.clientId,
      employeeId: req.body.employeeId !== undefined ? Number(req.body.employeeId) : appointment.employeeId,
      serviceId: req.body.serviceId !== undefined ? Number(req.body.serviceId) : appointment.serviceId,
      fecha: req.body.fecha !== undefined ? new Date(req.body.fecha) : new Date(appointment.fecha),
      estado: req.body.estado || appointment.estado,
      notas: req.body.notas !== undefined ? req.body.notas?.trim() || null : appointment.notas
    };

    const { client, employee, service } = await resolveEntities(payload);
    if (!client || !employee || !service) {
      return res.status(400).json({ message: 'Cliente/empleado/servicio no válido', code: 'RELATION_ERROR' });
    }

    if (payload.estado !== 'cancelada') {
      const overlap = await hasEmployeeOverlap({
        appointmentId: appointment.id,
        employeeId: payload.employeeId,
        startDate: payload.fecha,
        durationMin: Number(service.duracionMin)
      });

      if (overlap) {
        return res.status(409).json({ message: 'El empleado ya tiene una cita en ese horario', code: 'SCHEDULE_CONFLICT' });
      }
    }

    await appointment.update(payload);
    return res.json(appointment);
  } catch (err) {
    return next(err);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada', code: 'NOT_FOUND' });
    }

    await appointment.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
