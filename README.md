# Magic Spa

Base inicial para HU-01 (Autenticación de administrador) con:

- Frontend: React + Axios + JWT
- Backend: Node.js + Express + JWT + Sequelize
- DB: MariaDB

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API disponible en `http://localhost:4000`.

Credenciales iniciales (seed automático en primer arranque):
- Email: valor de `ADMIN_EMAIL`
- Password: valor de `ADMIN_PASSWORD`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

UI disponible en `http://localhost:5173`.

Si el backend corre en otra URL, define `VITE_API_URL`.


## HU-02 (Empleados)

Endpoints protegidos con JWT:
- `POST /api/employees`
- `GET /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

En frontend:
- Página `/employees` con alta, edición, listado y eliminación.


## HU-03 (Clientes)

Endpoints protegidos con JWT:
- `POST /api/clients`
- `GET /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

Extra:
- `GET /api/clients?q=texto` para búsqueda por nombre o teléfono.

En frontend:
- Página `/clients` con alta, edición, listado, eliminación y filtro de búsqueda.


## HU-04 (Servicios)

Endpoints protegidos con JWT:
- `POST /api/services`
- `GET /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

Reglas:
- `precio >= 0`
- `duracionMin > 0`

En frontend:
- Página `/services` con alta, edición, listado y eliminación.


## HU-05 (Citas)

Endpoints protegidos con JWT:
- `POST /api/appointments`
- `GET /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

Reglas:
- Validación de existencia de cliente, empleado y servicio.
- Validación de solapamiento de horario por empleado (según `duracionMin` del servicio).

En frontend:
- Página `/appointments` con formulario de cita y agenda en tabla.


## HU-06 (Pagos)

Endpoints protegidos con JWT:
- `POST /api/payments`
- `GET /api/payments`
- `PUT /api/payments/:id`
- `DELETE /api/payments/:id`

Reglas:
- Una cita no puede tener más de un pago registrado.
- El monto debe coincidir con el precio del servicio de la cita.

En frontend:
- Página `/payments` con registro e historial de pagos.


## HU-07 (Reportes Básicos)

Endpoints protegidos con JWT:
- `GET /api/reports/appointments-summary`
- `GET /api/reports/revenue-summary`
- `GET /api/reports/top-services`
- `GET /api/reports/top-employees`

Opcional para todos:
- query params `start` y `end` (YYYY-MM-DD) para filtrar por fecha.

En frontend:
- Página `/reports` con filtros por rango y visualización básica en listas.
