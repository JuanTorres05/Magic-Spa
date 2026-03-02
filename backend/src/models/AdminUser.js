import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.js';

export class AdminUser extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    }
  },
  {
    sequelize,
    tableName: 'admin_users',
    modelName: 'AdminUser',
    underscored: true,
    timestamps: true
  }
);
