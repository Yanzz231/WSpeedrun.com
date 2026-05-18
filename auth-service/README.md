# WSpeedrun Auth Service

Auth Service untuk WSpeedrun.com. Service ini menangani registrasi, login, pembuatan JWT, dan profil user.

## Service Info

| Item | Value |
|---|---|
| Framework | NestJS |
| Default Port | 3000 |
| Database | MySQL |
| ORM | Prisma |
| Auth | Passport JWT |
| Swagger | `http://localhost:3000/api` |

## Setup

Pastikan database dari `../database.sql` sudah di-import ke MySQL/XAMPP.

```bash
npm install
```

Buat `.env`:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
AUTH_SERVICE_PORT=3000
```

Generate Prisma Client:

```bash
npm run db:generate
```

Jalankan service:

```bash
npm run start:dev
```

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user baru |
| POST | `/auth/login` | Public | Login dan mendapatkan JWT |
| GET | `/users/:id/profile` | Public | Ambil profil user |

## Validation

Register:

| Field | Rule |
|---|---|
| `username` | 4 sampai 40 karakter |
| `email` | Format email valid |
| `country` | Wajib diisi |
| `password` | 8 sampai 40 karakter, minimal 1 uppercase, 1 lowercase, 1 angka, dan 1 simbol |

## Authentication

Payload JWT berisi:

```json
{
  "user_id": "uuid",
  "role": "USER"
}
```

Untuk membuat admin saat testing, update role di database lalu login ulang:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```
