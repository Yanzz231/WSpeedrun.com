# WSpeedrun.com

Backend platform untuk tracking dan managing video game speedruns, dibangun dengan NestJS microservice architecture.

## Services

| Service | Port | Responsibility |
|---|---|---|
| Auth Service | 3000 | Register, login, JWT auth, user profile |
| Game Service | 3001 | Games and run categories CRUD |
| Run Service | 3002 | Submit runs, leaderboard, comments, verification |
| API Gateway | 3003 | Optional single entrypoint that forwards requests to services |

## User Roles

| Role | Access |
|---|---|
| Guest | View games, categories, leaderboards, and user profiles |
| User | Guest access + submit runs, view run history, create/delete own comments |
| Admin | Full access + manage games/categories, accept/reject runs |

## Tech Stack

- NestJS
- MySQL
- Prisma
- Passport JWT
- Swagger
- bcrypt
- class-validator
- Axios for API Gateway

## Run with Docker

Cara paling cepat untuk menjalankan semua service:

Prerequisite: Docker Desktop sudah running.

```bash
docker compose up --build
```

Docker Compose akan menjalankan service NestJS dan memakai `.env` di folder masing-masing service.

| Container | Host Port | Internal URL |
|---|---:|---|
| Auth Service | 3000 | `http://auth-service:3000` |
| Game Service | 3001 | `http://game-service:3001` |
| Run Service | 3002 | `http://run-service:3002` |
| API Gateway | 3003 | `http://api-gateway:3003` |

Pastikan `DATABASE_URL` di `auth-service/.env`, `game-service/.env`, dan `run-service/.env` sudah mengarah ke database yang bisa diakses dari container. Jika memakai database lokal di host machine, gunakan `host.docker.internal`, bukan `localhost`.

Contoh:

```env
DATABASE_URL=mysql://root:password@host.docker.internal:3306/wspeedrun
```

`AUTH_SERVICE_URL`, `GAME_SERVICE_URL`, dan `RUN_SERVICE_URL` di Docker Compose akan dioverride ke nama container supaya antar-service bisa saling terhubung.

Swagger URLs:

| Service | Swagger URL |
|---|---|
| Auth Service | `http://localhost:3000/api` |
| Game Service | `http://localhost:3001/api` |
| Run Service | `http://localhost:3002/api` |
| API Gateway | `http://localhost:3003/api` |

Untuk stop semua container:

```bash
docker compose down
```

## Manual Setup

### 1. Prerequisites

- Node.js
- XAMPP with MySQL running
- Visual Studio Code or another editor

### 2. Import Database

Open `http://localhost/phpmyadmin`, go to Import, select `database.sql` from the project root, then click Go.

### 3. Configure Environment

Each service has its own `.env`. Use the `.env.example` files as reference, or create them manually:

Auth Service:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
AUTH_SERVICE_PORT=3000
```

Game Service:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
GAME_SERVICE_PORT=3001
```

Run Service:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
RUN_SERVICE_PORT=3002
AUTH_SERVICE_URL=http://localhost:3000
GAME_SERVICE_URL=http://localhost:3001
```

API Gateway:

```env
API_GATEWAY_PORT=3003
AUTH_SERVICE_URL=http://localhost:3000
GAME_SERVICE_URL=http://localhost:3001
RUN_SERVICE_URL=http://localhost:3002
```

### 4. Install Dependencies and Generate Prisma Client

Run these commands in `auth-service`, `game-service`, and `run-service`:

```bash
npm install
npm run db:generate
```

Run this in `api-gateway`:

```bash
npm install
```

### 5. Run the Services

Open separate terminals:

```bash
cd auth-service
npm run start:dev
```

```bash
cd game-service
npm run start:dev
```

```bash
cd run-service
npm run start:dev
```

Optional gateway:

```bash
cd api-gateway
npm run start:dev
```

## Swagger

| Service | Swagger URL |
|---|---|
| Auth Service | `http://localhost:3000/api` |
| Game Service | `http://localhost:3001/api` |
| Run Service | `http://localhost:3002/api` |
| API Gateway | `http://localhost:3003/api` |

## Authentication

1. Register or login via Auth Service.
2. Copy the `access_token`.
3. In Swagger, click Authorize and enter `Bearer <token>`.

To use admin endpoints, update role in database and login again:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## API Endpoints

### Auth Service - `localhost:3000`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and get JWT token |
| GET | `/users/:id/profile` | Public | Get user profile |

### Game Service - `localhost:3001`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/games` | Public | List all games |
| GET | `/games/:id` | Public | Game detail with categories |
| GET | `/categories/:id` | Public | Category detail |
| POST | `/admin/games` | Admin | Create game |
| PATCH | `/admin/games/:id/update` | Admin | Update game |
| DELETE | `/admin/games/:id/delete` | Admin | Delete game |
| POST | `/admin/categories` | Admin | Create run category |
| PATCH | `/admin/categories/:id/update` | Admin | Update category |
| DELETE | `/admin/categories/:id/delete` | Admin | Delete category |

### Run Service - `localhost:3002`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/runs/:id/category` | Public | Leaderboard by category, accepted runs only |
| GET | `/runs/:id/user` | User | Run history |
| GET | `/runs/:id` | Public | Accepted run detail with comments |
| POST | `/runs` | User | Submit new run with PENDING status |
| POST | `/comments` | User | Post a comment |
| DELETE | `/comments/:id` | User | Delete own comment |
| GET | `/admin/runs/:status` | Admin | Filter runs by status |
| POST | `/admin/runs/:id/accept` | Admin | Accept a run |
| POST | `/admin/runs/:id/reject` | Admin | Reject a run |
