import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Appointment } from './Appointment.js';

export class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    appointmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'appointment_id'
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    metodoPago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
      allowNull: false,
      field: 'metodo_pago'
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    referencia: {
      type: DataTypes.STRING(120),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
    underscored: true,
    timestamps: true
  }
);

Payment.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
