# WSpeedrun API Gateway

API Gateway opsional untuk WSpeedrun.com. Gateway ini menyediakan satu entrypoint HTTP yang meneruskan request ke Auth Service, Game Service, dan Run Service menggunakan Axios.

## Service Info

| Item | Value |
|---|---|
| Framework | NestJS |
| Default Port | 3003 |
| HTTP Client | Axios |
| Swagger | `http://localhost:3003/api` |

## Setup

Jalankan dulu service utama:

| Service | URL |
|---|---|
| Auth Service | `http://localhost:3000` |
| Game Service | `http://localhost:3001` |
| Run Service | `http://localhost:3002` |

Install dependency:

```bash
npm install
```

Buat `.env`:

```env
API_GATEWAY_PORT=3003
AUTH_SERVICE_URL=http://localhost:3000
GAME_SERVICE_URL=http://localhost:3001
RUN_SERVICE_URL=http://localhost:3002
```

Jalankan gateway:

```bash
npm run start:dev
```

## Forwarded Endpoints

| Method | Endpoint | Target Service |
|---|---|---|
| POST | `/auth/register` | Auth Service |
| POST | `/auth/login` | Auth Service |
| GET | `/users/:id/profile` | Auth Service |
| GET | `/games` | Game Service |
| GET | `/games/:id` | Game Service |
| GET | `/categories/:id` | Game Service |
| POST | `/admin/games` | Game Service |
| PATCH | `/admin/games/:id/update` | Game Service |
| DELETE | `/admin/games/:id/delete` | Game Service |
| POST | `/admin/categories` | Game Service |
| PATCH | `/admin/categories/:id/update` | Game Service |
| DELETE | `/admin/categories/:id/delete` | Game Service |
| GET | `/runs/:id/category` | Run Service |
| GET | `/runs/:id/user` | Run Service |
| GET | `/runs/:id` | Run Service |
| POST | `/runs` | Run Service |
| POST | `/comments` | Run Service |
| DELETE | `/comments/:id` | Run Service |
| GET | `/admin/runs/:status` | Run Service |
| POST | `/admin/runs/:id/accept` | Run Service |
| POST | `/admin/runs/:id/reject` | Run Service |

## Authorization Forwarding

Untuk endpoint protected, kirim header ini ke gateway. Gateway akan meneruskannya ke service tujuan:

```http
Authorization: Bearer <jwt_token>
```
