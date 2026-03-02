import { app } from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';
import './models/AdminUser.js';
import './models/Employee.js';
import './models/Client.js';
import './models/Service.js';
import './models/Appointment.js';
import './models/Payment.js';
import { seedAdmin } from './controllers/authController.js';

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedAdmin();

    app.listen(env.port, () => {
      console.log(`Magic Spa API escuchando en puerto ${env.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API', error);
    process.exit(1);
  }
};

start();
