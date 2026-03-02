import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios', code: 'VALIDATION_ERROR' });
    }

    const admin = await AdminUser.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas', code: 'INVALID_CREDENTIALS' });
    }

    const passwordOk = await admin.comparePassword(password);

    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales inválidas', code: 'INVALID_CREDENTIALS' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    return res.json({ token, user: { id: admin.id, email: admin.email } });
  } catch (error) {
    return next(error);
  }
};

export const seedAdmin = async () => {
  const admin = await AdminUser.findOne({ where: { email: env.adminEmail } });

  if (admin) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);

  await AdminUser.create({
    email: env.adminEmail,
    passwordHash
  });
};
