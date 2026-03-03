/**
 * Magic Spa — Seed Script
 * Simula 4 meses de operación (Nov 2025 – Feb 2026)
 * 8 empleadas, 30 clientas, 10 servicios, citas diarias Mon–Dom
 *
 * Uso: node seed.js  (desde la carpeta backend/)
 */
import { sequelize } from './src/config/database.js';
import { AdminUser } from './src/models/AdminUser.js';
import { Employee } from './src/models/Employee.js';
import { Client } from './src/models/Client.js';
import { Service } from './src/models/Service.js';
import { Appointment } from './src/models/Appointment.js';
import { Payment } from './src/models/Payment.js';
import bcrypt from 'bcrypt';

// ─── Datos base ───────────────────────────────────────────────────────────────

const EMPLOYEES_DATA = [
    { nombre: 'Ana García', telefono: '555-1001', estado: 'activo' },
    { nombre: 'María López', telefono: '555-1002', estado: 'activo' },
    { nombre: 'Sofía Martínez', telefono: '555-1003', estado: 'activo' },
    { nombre: 'Laura Rodríguez', telefono: '555-1004', estado: 'activo' },
    { nombre: 'Isabel Hernández', telefono: '555-1005', estado: 'activo' },
    { nombre: 'Valentina Pérez', telefono: '555-1006', estado: 'activo' },
    { nombre: 'Daniela Sánchez', telefono: '555-1007', estado: 'activo' },
    { nombre: 'Andrea Torres', telefono: '555-1008', estado: 'activo' },
];

const SERVICES_DATA = [
    { nombre: 'Manicure Tradicional', precio: 18000, duracionMin: 45, estado: 'activo' },
    { nombre: 'Manicure Gel', precio: 35000, duracionMin: 60, estado: 'activo' },
    { nombre: 'Pedicure Tradicional', precio: 25000, duracionMin: 60, estado: 'activo' },
    { nombre: 'Pedicure Spa', precio: 45000, duracionMin: 90, estado: 'activo' },
    { nombre: 'Uñas Acrílicas', precio: 80000, duracionMin: 120, estado: 'activo' },
    { nombre: 'Retoque Acrílicas', precio: 50000, duracionMin: 90, estado: 'activo' },
    { nombre: 'Nail Art', precio: 20000, duracionMin: 30, estado: 'activo' },
    { nombre: 'Encapsulado', precio: 95000, duracionMin: 120, estado: 'activo' },
    { nombre: 'Manicure + Pedicure', precio: 55000, duracionMin: 120, estado: 'activo' },
    { nombre: 'Semipermanente', precio: 40000, duracionMin: 75, estado: 'activo' },
];


const CLIENTS_DATA = [
    { nombre: 'Carmen Ruiz', telefono: '555-2001', email: 'carmen@gmail.com', notas: '' },
    { nombre: 'Patricia Morales', telefono: '555-2002', email: '', notas: 'Alergia a acrílico' },
    { nombre: 'Diana Castro', telefono: '555-2003', email: 'diana@gmail.com', notas: '' },
    { nombre: 'Rosa Jiménez', telefono: '555-2004', email: '', notas: '' },
    { nombre: 'Elena Vargas', telefono: '555-2005', email: 'elena.v@gmail.com', notas: 'VIP' },
    { nombre: 'Sandra Méndez', telefono: '555-2006', email: '', notas: '' },
    { nombre: 'Lucía Ramírez', telefono: '555-2007', email: 'lucia@gmail.com', notas: '' },
    { nombre: 'Gabriela Cruz', telefono: '555-2008', email: '', notas: 'Prefiere gel' },
    { nombre: 'Mónica Flores', telefono: '555-2009', email: 'monica@gmail.com', notas: '' },
    { nombre: 'Fernanda Ortega', telefono: '555-2010', email: '', notas: '' },
    { nombre: 'Alejandra Reyes', telefono: '555-2011', email: 'ale@gmail.com', notas: '' },
    { nombre: 'Beatriz Guzmán', telefono: '555-2012', email: '', notas: '' },
    { nombre: 'Claudia Navarro', telefono: '555-2013', email: 'claudia@gmail.com', notas: 'Uñas largas' },
    { nombre: 'Verónica Aguilar', telefono: '555-2014', email: '', notas: '' },
    { nombre: 'Adriana Mendoza', telefono: '555-2015', email: '', notas: '' },
    { nombre: 'Rebeca Álvarez', telefono: '555-2016', email: 'rebeca@gmail.com', notas: '' },
    { nombre: 'Nathalia Ríos', telefono: '555-2017', email: '', notas: '' },
    { nombre: 'Mariana Campos', telefono: '555-2018', email: 'mariana@gmail.com', notas: 'Pedicure cada mes' },
    { nombre: 'Cynthia Delgado', telefono: '555-2019', email: '', notas: '' },
    { nombre: 'Paola Cabrera', telefono: '555-2020', email: 'paola@gmail.com', notas: '' },
    { nombre: 'Angélica Torres', telefono: '555-2021', email: '', notas: '' },
    { nombre: 'Ximena Herrera', telefono: '555-2022', email: '', notas: '' },
    { nombre: 'Yolanda Cervantes', telefono: '555-2023', email: 'yoli@gmail.com', notas: '' },
    { nombre: 'Liliana Espinosa', telefono: '555-2024', email: '', notas: '' },
    { nombre: 'Norma Ibarra', telefono: '555-2025', email: 'norma@gmail.com', notas: 'Alergia al gel' },
    { nombre: 'Rocío Santillán', telefono: '555-2026', email: '', notas: '' },
    { nombre: 'Esperanza Luna', telefono: '555-2027', email: '', notas: '' },
    { nombre: 'Ivonne Millán', telefono: '555-2028', email: 'ivonne@gmail.com', notas: '' },
    { nombre: 'Tania Soto', telefono: '555-2029', email: '', notas: '' },
    { nombre: 'Karla Vega', telefono: '555-2030', email: 'karla@gmail.com', notas: 'VIP' },
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function setHourMin(date, hour, minute) {
    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);
    return d;
}

// ─── Seed principal ──────────────────────────────────────────────────────────

const seed = async () => {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();

    console.log('📦 Sincronizando tablas...');
    await sequelize.sync();

    // Limpiar datos anteriores (en orden por FK)
    console.log('🗑️  Limpiando datos anteriores...');
    await Payment.destroy({ where: {} });
    await Appointment.destroy({ where: {} });
    await Service.destroy({ where: {} });
    await Client.destroy({ where: {} });
    await Employee.destroy({ where: {} });

    // ── Empleadas ──
    console.log('👩‍🎨 Creando 8 empleadas...');
    const employees = await Employee.bulkCreate(EMPLOYEES_DATA, { returning: true });

    // ── Clientas ──
    console.log('💝 Creando 30 clientas...');
    const clients = await Client.bulkCreate(CLIENTS_DATA, { returning: true });

    // ── Servicios ──
    console.log('✨ Creando 10 servicios...');
    const services = await Service.bulkCreate(SERVICES_DATA, { returning: true });

    // ── Citas (4 meses) ──
    const START = new Date('2025-11-01');
    const END = new Date('2026-02-28');
    const TODAY = new Date('2026-03-02');

    const METODOS = ['efectivo', 'efectivo', 'efectivo', 'tarjeta', 'transferencia'];

    const appointments = [];
    const payments = [];

    console.log('📅 Generando citas Nov 2025 – Feb 2026 (esto tarda un momento)...');

    let currentDay = new Date(START);
    while (currentDay <= END) {
        // Cada empleada trabaja todos los días (lunes a domingo como pidió el usuario)
        for (const employee of employees) {
            // Empleadas ocasionalmente faltan (15% de probabilidad de no trabajar ese día)
            if (Math.random() < 0.15) continue;

            // Horario: 9:00am, espaciamos por duración del servicio + 10 min de break
            let slotMinutes = 9 * 60; // 540 min desde medianoche

            // Número de citas ese día para esta empleada
            const numAppts = randInt(3, 6);

            for (let i = 0; i < numAppts; i++) {
                if (slotMinutes >= 19 * 60) break; // No más allá de las 7pm

                const service = rand(services);
                const client = rand(clients);
                const fecha = setHourMin(currentDay, Math.floor(slotMinutes / 60), slotMinutes % 60);

                // Estado según antigüedad
                const daysAgo = Math.floor((TODAY - fecha) / (1000 * 60 * 60 * 24));
                let estado;
                if (daysAgo > 14) {
                    estado = Math.random() < 0.88 ? 'completada' : 'cancelada';
                } else if (daysAgo > 0) {
                    estado = Math.random() < 0.65 ? 'completada' : 'confirmada';
                } else {
                    estado = Math.random() < 0.6 ? 'confirmada' : 'pendiente';
                }

                appointments.push({
                    clientId: client.id,
                    employeeId: employee.id,
                    serviceId: service.id,
                    fecha,
                    estado,
                    notas: null,
                });

                slotMinutes += Number(service.duracionMin) + 10;
            }
        }

        currentDay = addDays(currentDay, 1);
    }

    console.log(`💾 Insertando ${appointments.length} citas en lotes...`);
    const BATCH = 200;
    const createdAppointments = [];

    for (let i = 0; i < appointments.length; i += BATCH) {
        const batch = await Appointment.bulkCreate(appointments.slice(i, i + BATCH), { returning: true });
        createdAppointments.push(...batch);
        process.stdout.write(`   ${Math.min(i + BATCH, appointments.length)} / ${appointments.length}\r`);
    }
    console.log('\n✅ Citas insertadas');

    // ── Pagos para citas completadas ──
    console.log('💳 Generando pagos para citas completadas...');
    for (const appt of createdAppointments) {
        if (appt.estado !== 'completada') continue;

        // Buscar el servicio para obtener el precio
        const svc = services.find((s) => s.id === appt.serviceId);
        if (!svc) continue;

        // Variación de ±10% sobre el precio del servicio
        const base = Number(svc.precio);
        const variation = base * (0.9 + Math.random() * 0.2);
        const monto = Math.round(variation * 100) / 100;

        // Pago hecho el mismo día o hasta 2 días después
        const fechaPago = new Date(appt.fecha);
        fechaPago.setHours(fechaPago.getHours() + randInt(0, 2));

        payments.push({
            appointmentId: appt.id,
            monto,
            metodoPago: rand(METODOS),
            fecha: fechaPago,
            referencia: null,
        });
    }

    console.log(`💾 Insertando ${payments.length} pagos en lotes...`);
    for (let i = 0; i < payments.length; i += BATCH) {
        await Payment.bulkCreate(payments.slice(i, i + BATCH));
        process.stdout.write(`   ${Math.min(i + BATCH, payments.length)} / ${payments.length}\r`);
    }
    console.log('\n✅ Pagos insertados');

    // ── Admin (si no existe) ──
    const existing = await AdminUser.findOne({ where: { email: 'admin@magicspa.local' } });
    if (!existing) {
        const hash = await bcrypt.hash('Admin123*', 10);
        await AdminUser.create({ email: 'admin@magicspa.local', passwordHash: hash });
        console.log('👤 Admin creado');
    }

    // ── Resumen ──
    const completadas = createdAppointments.filter((a) => a.estado === 'completada').length;
    const canceladas = createdAppointments.filter((a) => a.estado === 'cancelada').length;
    const pendientes = createdAppointments.filter((a) => a.estado === 'pendiente').length;
    const confirmadas = createdAppointments.filter((a) => a.estado === 'confirmada').length;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed completado con éxito 🎉');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👩‍🎨  Empleadas:     ${employees.length}`);
    console.log(`💝   Clientas:      ${clients.length}`);
    console.log(`✨   Servicios:     ${services.length}`);
    console.log(`📅   Citas total:   ${createdAppointments.length}`);
    console.log(`     ├ Completadas: ${completadas}`);
    console.log(`     ├ Confirmadas: ${confirmadas}`);
    console.log(`     ├ Pendientes:  ${pendientes}`);
    console.log(`     └ Canceladas:  ${canceladas}`);
    console.log(`💳   Pagos:         ${payments.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await sequelize.close();
    process.exit(0);
};

seed().catch((err) => {
    console.error('❌ Error en el seed:', err.message);
    console.error(err);
    process.exit(1);
});
