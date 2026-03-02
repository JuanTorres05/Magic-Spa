import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Service extends Model {}

Service.init(
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    duracionMin: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'duracion_min',
      validate: {
        min: 1
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
    tableName: 'services',
    modelName: 'Service',
    underscored: true,
    timestamps: true
  }
);
