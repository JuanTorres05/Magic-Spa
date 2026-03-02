import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    telefono: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo'
    }
  },
  {
    sequelize,
    tableName: 'employees',
    modelName: 'Employee',
    underscored: true,
    timestamps: true
  }
);
