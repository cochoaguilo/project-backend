# Wallet – Backend

API REST de la app de finanzas personales [Wallet](https://github.com/cochoaguilo/wallet), desarrollada con **NestJS** y **TypeORM**. Gestiona usuarios, ahorros, deudas e inversiones (cripto y acciones), y consulta cotizaciones en servicios externos.

## Tecnologías

- NestJS 11 · TypeScript
- TypeORM con MariaDB / MySQL (`mysql2`)
- Autenticación con JWT (`@nestjs/jwt`)
- `@nestjs/axios` para consumir APIs externas
- Jest para tests, ESLint + Prettier

## Estructura

```
src/
├── main.ts                  # arranque de la app (CORS habilitado, puerto 3000 por defecto)
├── app.module.ts            # conexión a la base, JWT y middleware de autenticación
├── usuarios/                # registro e inicio de sesión
├── ahorros/                 # ingresos y gastos
├── deudas/                  # deudas
├── inversiones/             # inversiones en acciones
├── cripto/                  # inversiones en criptomonedas
├── externals/               # cotizaciones: IOL, CoinGecko y dólar
├── middleware/              # JwtAuthMiddleware
├── common/                  # filtro global de excepciones
└── utils/                   # respuesta estándar, decorador @UserId, auth de IOL
```

## Variables de entorno

Se leen desde un archivo `.env` en la raíz del proyecto.

| Variable                     | Descripción                                             | Por defecto  |
| ---------------------------- | ------------------------------------------------------- | ------------ |
| `PORT`                       | Puerto del servidor                                     | `3000`       |
| `DB_TYPE`                    | Motor de base de datos (`mariadb` o `mysql`)            | `mariadb`    |
| `DB_HOST`                    | Host de la base                                         | `localhost`  |
| `DB_PORT`                    | Puerto de la base                                       | `3306`       |
| `DB_USERNAME`                | Usuario de la base                                      | `root`       |
| `DB_PASSWORD`                | Contraseña de la base                                   |              |
| `DB_NAME`                    | Nombre de la base                                       | `wallet`     |
| `DB_SYNCHRONIZE`             | `true` para que TypeORM cree/actualice las tablas       | `false`      |
| `SECRET_TOKEN`               | Clave para firmar los JWT                               |              |
| `IOL_USERNAME`               | Usuario de la API de InvertirOnline                     |              |
| `IOL_PASSWORD`               | Contraseña de la API de InvertirOnline                  |              |
| `TOKENMonedaApiMarcos`       | Token de la API de cotizaciones del dólar (monedapi.ar) |              |

Ejemplo:

```env
PORT=3000
DB_TYPE=mariadb
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_NAME=wallet
DB_SYNCHRONIZE=true
SECRET_TOKEN=una_clave_secreta
IOL_USERNAME=tu_usuario_iol
IOL_PASSWORD=tu_password_iol
TOKENMonedaApiMarcos=tu_token_monedapi
```

## Modelo de datos

| Entidad       | Campos                                                              |
| ------------- | ------------------------------------------------------------------- |
| `Usuarios`    | `id`, `name`, `mail` (único), `password`                            |
| `Ahorros`     | `id`, `name`, `quantity`, `description`, `type`, `date`, `userId`   |
| `Deudas`      | `id`, `name`, `amount`, `description`, `userId`                     |
| `Inversiones` | `id`, `name`, `hold`, `platform`, `symbol`, `purchaseDate`, `userId` |
| `Cripto`      | `id`, `name`, `hold`, `platform`, `symbol`, `purchaseDate`, `userId` |

## Autenticación

1. El usuario inicia sesión en `POST /usuarios/log-in` y recibe un `access_token`.
2. Las rutas de `/ahorros`, `/deudas`, `/inversiones` y `/cripto` requieren el header:

   ```
   Authorization: Bearer <access_token>
   ```

3. El usuario sobre el que se opera se indica con el query param `?userId=<id>`.

## Endpoints

### Usuarios

| Método | Ruta                | Descripción                                          |
| ------ | ------------------- | ---------------------------------------------------- |
| POST   | `/usuarios/sign-in` | Registra un usuario (`name`, `mail`, `password`)     |
| POST   | `/usuarios/log-in`  | Inicia sesión (`mail`, `password`) y devuelve `user`, `access_token` y `expires_in` |
| GET    | `/usuarios`         | Lista los usuarios                                   |

### Ahorros 🔒

| Método | Ruta                          | Descripción                                   |
| ------ | ----------------------------- | --------------------------------------------- |
| GET    | `/ahorros?userId=`            | Lista los movimientos del usuario             |
| GET    | `/ahorros/totales?userId=`    | Saldo total (ingresos menos egresos)          |
| POST   | `/ahorros?userId=`            | Crea un movimiento (`name`, `quantity`, `type`, `description`, `date`) |
| PATCH  | `/ahorros/:id`                | Actualiza un movimiento                       |
| DELETE | `/ahorros/:id`                | Elimina un movimiento                         |

### Deudas 🔒

| Método | Ruta                         | Descripción                                  |
| ------ | ---------------------------- | -------------------------------------------- |
| GET    | `/deudas?userId=`            | Lista las deudas del usuario                 |
| GET    | `/deudas/totales?userId=`    | Suma total de las deudas                     |
| GET    | `/deudas/:id`                | Detalle de una deuda                         |
| POST   | `/deudas?userId=`            | Crea una deuda (`name`, `amount`, `description`) |
| PUT    | `/deudas/:id`                | Actualiza una deuda                          |
| DELETE | `/deudas/:id`                | Elimina una deuda                            |

### Inversiones 🔒 y Cripto 🔒

`/inversiones` (acciones) y `/cripto` (criptomonedas) exponen los mismos endpoints:

| Método | Ruta                       | Descripción                                   |
| ------ | -------------------------- | --------------------------------------------- |
| GET    | `/{recurso}?userId=`       | Lista las inversiones del usuario             |
| POST   | `/{recurso}?userId=`       | Crea una inversión (`name`, `symbol`, `hold`, `platform`, `purchaseDate`) |
| PATCH  | `/{recurso}/:id`           | Actualiza una inversión                       |
| DELETE | `/{recurso}/:id`           | Elimina una inversión                         |

### Cotizaciones externas

| Método | Ruta                                          | Fuente                                   |
| ------ | --------------------------------------------- | ---------------------------------------- |
| GET    | `/externals/iol?symbol=GGAL`                  | Cotización de una acción en BCBA ([InvertirOnline](https://api.invertironline.com)) |
| GET    | `/externals/cripto_currency?symbols=btc,eth`  | Precios de criptomonedas en USD ([CoinGecko](https://www.coingecko.com/en/api)) |
| GET    | `/externals/dolar_exchange`                   | Cotizaciones del dólar ([monedapi.ar](https://monedapi.ar)) |

El token de InvertirOnline se obtiene y renueva automáticamente (`IolAuthService`).

### Formato de respuesta

Respuesta exitosa:

```json
{ "status": "success", "success": true, "data": { } }
```

Error (filtro global `HttpExceptionFilter`):

```json
{
  "status": 401,
  "success": false,
  "message": "Token inválido",
  "path": "/ahorros?userId=1",
  "timestamp": "2026-01-01T12:00:00.000Z"
}
```

## Cómo correrlo

Requisitos: Node.js 20+ y una base MariaDB/MySQL.

```bash
npm install
npm run start:dev      # modo desarrollo con recarga, en http://localhost:3000
```

Otros scripts:

```bash
npm run build          # compila a dist/
npm run start:prod     # corre la versión compilada
npm test               # tests unitarios
npm run test:e2e       # tests end-to-end
npm run lint           # linter
```
