# Magic Spa — Plan de ejecución por Historias de Usuario

Este documento convierte tus HU en un plan técnico ejecutable usando:

- **Frontend:** React + Axios + JWT
- **Backend:** Node.js + Express + REST API + JWT
- **BD:** MariaDB + Sequelize

---

## 1) Orden recomendado de implementación

1. **HU-01 Autenticación Administrador**
2. **HU-02 Gestión de Empleados**
3. **HU-03 Gestión de Clientes**
4. **HU-04 Gestión de Servicios**
5. **HU-05 Gestión de Citas**
6. **HU-06 Registro de Pagos**
7. **HU-07 Reportes Básicos**

> Este orden reduce retrabajo porque Citas depende de Empleados, Clientes y Servicios; Pagos depende de Citas; Reportes depende de todo.

---

## 2) Estructura inicial del proyecto (monorepo)

```text
Magic-Spa/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  └─ app.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ App.jsx
│  └─ package.json
└─ PLAN_DE_TRABAJO.md
```

---

## 3) Backlog técnico por HU

### HU-01 — Autenticación Administrador

**Backend**
- Tabla `admin_users`: id, email, password_hash, created_at.
- Endpoint `POST /api/auth/login`.
- Hash de contraseñas con `bcrypt`.
- Emisión de JWT (`access token`) con expiración.
- Middleware `authMiddleware` para validar token.

**Frontend**
- Vista de Login.
- Guardado de token (preferible en memoria + refresh strategy; mínimo localStorage para MVP).
- Rutas protegidas para dashboard.
- Logout y limpieza de sesión.

**DoD**
- Login correcto devuelve token y permite entrar al dashboard.
- Login inválido responde 401.
- Endpoint protegido sin token responde 401.

---

### HU-02 — Gestión de Empleados

**Modelo**
- `employees`: id, nombre, telefono, estado, created_at.

**API**
- `POST /api/employees`
- `GET /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id` (o soft delete por `estado`)

**Frontend**
- Tabla con listado.
- Formulario alta/edición.
- Botones editar/eliminar.
- Validaciones de campos obligatorios.

**DoD**
- CRUD completo con validaciones y mensajes de error.

---

### HU-03 — Gestión de Clientes

**Modelo**
- `clients`: id, nombre, telefono, email, notas, created_at.

**API**
- CRUD completo en `/api/clients`.

**Frontend**
- Tabla + formulario.
- Búsqueda rápida por nombre/teléfono.

**DoD**
- Validaciones mínimas (`nombre`, `telefono`), email opcional con formato válido.

---

### HU-04 — Gestión de Servicios

**Modelo**
- `services`: id, nombre, precio, duracion_min, estado, created_at.

**API**
- CRUD completo en `/api/services`.

**Frontend**
- Vista de catálogo de servicios.
- Activar/desactivar servicio.

**DoD**
- No se permite precio negativo ni duración <= 0.

---

### HU-05 — Gestión de Citas

**Modelo**
- `appointments`: id, client_id, employee_id, service_id, fecha, estado, notas, created_at.

**Reglas clave**
- Verificar existencia de cliente/empleado/servicio.
- Evitar solapamiento para el mismo empleado en el mismo rango horario.

**API**
- CRUD en `/api/appointments`.
- Endpoints auxiliares para agenda por día/semana.

**Frontend**
- Calendario o listado por fecha.
- Formulario con selects (cliente, empleado, servicio).
- Estado de cita: pendiente, confirmada, cancelada, completada.

**DoD**
- Creación y edición con reglas de negocio activas.

---

### HU-06 — Registro de Pagos

**Modelo**
- `payments`: id, appointment_id, monto, metodo_pago, fecha, referencia, created_at.

**Reglas clave**
- Una cita no debe pagarse dos veces sin control (definir parcial/total según negocio).
- Monto debe coincidir con servicio (o registrar descuento/recargo).

**API**
- CRUD en `/api/payments`.

**Frontend**
- Registrar pago desde la cita.
- Historial de pagos con filtros.

**DoD**
- Se puede registrar y consultar pagos de forma consistente.

---

### HU-07 — Reportes Básicos

**Reportes iniciales**
- Citas por día/semana.
- Ingresos por día/mes.
- Servicios más vendidos.
- Empleado con más citas.

**API**
- `/api/reports/appointments-summary`
- `/api/reports/revenue-summary`
- `/api/reports/top-services`
- `/api/reports/top-employees`

**Frontend**
- Dashboard con tarjetas + tablas.
- Filtros por rango de fechas.

**DoD**
- Reportes coherentes y comparables contra datos base.

---

## 4) Criterios transversales (todas las HU)

- Validación de datos en backend (obligatorio) y frontend (UX).
- Manejo de errores homogéneo (`{ message, code }`).
- Versionado de API (`/api/v1` opcional, recomendado).
- Uso de migraciones y seeders con Sequelize.
- Variables de entorno para secretos (`JWT_SECRET`, credenciales DB).
- Registro de auditoría básico (`created_at`, `updated_at`).

---

## 5) Plan de trabajo sugerido (iterativo)

### Sprint 1
- Base backend + conexión MariaDB + auth (HU-01).
- Frontend login + ruta protegida.

### Sprint 2
- CRUD Empleados (HU-02) + CRUD Clientes (HU-03).

### Sprint 3
- CRUD Servicios (HU-04) + Gestión de Citas (HU-05).

### Sprint 4
- Pagos (HU-06) + Reportes básicos (HU-07).

---

## 6) Siguiente paso recomendado

Comenzar por **HU-01** y dejar listo un esqueleto funcional (backend + frontend + JWT) para que el resto de módulos reutilicen la autenticación y rutas protegidas.
