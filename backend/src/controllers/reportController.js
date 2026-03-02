import { fn, col, literal, Op } from 'sequelize';
import { Appointment } from '../models/Appointment.js';
import { Payment } from '../models/Payment.js';
import { Service } from '../models/Service.js';
import { Employee } from '../models/Employee.js';

const buildDateWhere = (req) => {
  const start = req.query.start ? new Date(req.query.start) : null;
  const end = req.query.end ? new Date(req.query.end) : null;

  if ((start && Number.isNaN(start.getTime())) || (end && Number.isNaN(end.getTime()))) {
    return { error: 'Rango de fechas inválido' };
  }

  if (start && end) return { where: { fecha: { [Op.between]: [start, end] } } };
  if (start) return { where: { fecha: { [Op.gte]: start } } };
  if (end) return { where: { fecha: { [Op.lte]: end } } };
  return { where: {} };
};

export const appointmentsSummary = async (req, res, next) => {
  try {
    const { where, error } = buildDateWhere(req);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const result = await Appointment.findAll({
      where,
      attributes: [[fn('DATE', col('fecha')), 'dia'], [fn('COUNT', col('id')), 'total']],
      group: [literal('DATE(fecha)')],
      order: [[literal('dia'), 'ASC']]
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const revenueSummary = async (req, res, next) => {
  try {
    const { where, error } = buildDateWhere(req);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const result = await Payment.findAll({
      where,
      attributes: [[fn('DATE', col('fecha')), 'dia'], [fn('SUM', col('monto')), 'ingresos']],
      group: [literal('DATE(fecha)')],
      order: [[literal('dia'), 'ASC']]
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const topServices = async (req, res, next) => {
  try {
    const { where, error } = buildDateWhere(req);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const result = await Appointment.findAll({
      where,
      attributes: ['serviceId', [fn('COUNT', col('Appointment.id')), 'total']],
      include: [{ model: Service, as: 'service', attributes: ['id', 'nombre'] }],
      group: ['serviceId', 'service.id'],
      order: [[literal('total'), 'DESC']],
      limit: 10
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const topEmployees = async (req, res, next) => {
  try {
    const { where, error } = buildDateWhere(req);
    if (error) return res.status(400).json({ message: error, code: 'VALIDATION_ERROR' });

    const result = await Appointment.findAll({
      where,
      attributes: ['employeeId', [fn('COUNT', col('Appointment.id')), 'total']],
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'nombre'] }],
      group: ['employeeId', 'employee.id'],
      order: [[literal('total'), 'DESC']],
      limit: 10
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};
