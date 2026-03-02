import { Payment } from '../models/Payment.js';
import { Appointment } from '../models/Appointment.js';
import { Service } from '../models/Service.js';

const validMethods = new Set(['efectivo', 'tarjeta', 'transferencia', 'otro']);

const validatePayload = ({ appointmentId, monto, metodoPago, fecha }, isCreate = true) => {
  if (isCreate && (!appointmentId || monto === undefined || !metodoPago || !fecha)) {
    return 'appointmentId, monto, metodoPago y fecha son obligatorios';
  }

  if (appointmentId !== undefined) {
    const id = Number(appointmentId);
    if (!Number.isInteger(id) || id <= 0) return 'appointmentId inválido';
  }

  if (monto !== undefined) {
    const amount = Number(monto);
    if (Number.isNaN(amount) || amount < 0) return 'Monto inválido';
  }

  if (metodoPago !== undefined && !validMethods.has(metodoPago)) {
    return 'Método de pago inválido';
  }

  if (fecha !== undefined) {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return 'Fecha inválida';
  }

  return null;
};

const getAppointmentAndService = async (appointmentId) => {
  return Appointment.findByPk(appointmentId, {
    include: [{ model: Service, as: 'service', attributes: ['id', 'precio'] }]
  });
};

export const createPayment = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, true);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const payload = {
      appointmentId: Number(req.body.appointmentId),
      monto: Number(req.body.monto),
      metodoPago: req.body.metodoPago,
      fecha: new Date(req.body.fecha),
      referencia: req.body.referencia?.trim() || null
    };

    const appointment = await getAppointmentAndService(payload.appointmentId);
    if (!appointment) {
      return res.status(400).json({ message: 'Cita no válida', code: 'RELATION_ERROR' });
    }

    const existing = await Payment.findOne({ where: { appointmentId: payload.appointmentId } });
    if (existing) {
      return res.status(409).json({ message: 'La cita ya tiene un pago registrado', code: 'PAYMENT_EXISTS' });
    }

    const servicePrice = Number(appointment.service?.precio || 0);
    if (payload.monto !== servicePrice) {
      return res.status(400).json({ message: 'El monto debe coincidir con el precio del servicio', code: 'AMOUNT_MISMATCH' });
    }

    const payment = await Payment.create(payload);
    return res.status(201).json(payment);
  } catch (err) {
    return next(err);
  }
};

export const listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Appointment, as: 'appointment', attributes: ['id', 'fecha', 'estado', 'serviceId'] }],
      order: [['fecha', 'DESC']]
    });
    return res.json(payments);
  } catch (err) {
    return next(err);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const error = validatePayload(req.body, false);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado', code: 'NOT_FOUND' });

    const appointmentId = req.body.appointmentId !== undefined ? Number(req.body.appointmentId) : payment.appointmentId;
    const appointment = await getAppointmentAndService(appointmentId);
    if (!appointment) return res.status(400).json({ message: 'Cita no válida', code: 'RELATION_ERROR' });

    const newAmount = req.body.monto !== undefined ? Number(req.body.monto) : Number(payment.monto);
    const servicePrice = Number(appointment.service?.precio || 0);
    if (newAmount !== servicePrice) {
      return res.status(400).json({ message: 'El monto debe coincidir con el precio del servicio', code: 'AMOUNT_MISMATCH' });
    }

    if (appointmentId !== payment.appointmentId) {
      const duplicated = await Payment.findOne({ where: { appointmentId } });
      if (duplicated) {
        return res.status(409).json({ message: 'La cita ya tiene un pago registrado', code: 'PAYMENT_EXISTS' });
      }
    }

    await payment.update({
      appointmentId,
      monto: newAmount,
      metodoPago: req.body.metodoPago || payment.metodoPago,
      fecha: req.body.fecha !== undefined ? new Date(req.body.fecha) : payment.fecha,
      referencia: req.body.referencia !== undefined ? req.body.referencia?.trim() || null : payment.referencia
    });

    return res.json(payment);
  } catch (err) {
    return next(err);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado', code: 'NOT_FOUND' });
    await payment.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
