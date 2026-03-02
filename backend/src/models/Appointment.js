import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Client } from './Client.js';
import { Employee } from './Employee.js';
import { Service } from './Service.js';

export class Appointment extends Model {}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'client_id'
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'employee_id'
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'service_id'
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    modelName: 'Appointment',
    underscored: true,
    timestamps: true
  }
);

Appointment.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Appointment.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
