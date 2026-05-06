# WSpeedrun Run Service

Run Service untuk WSpeedrun.com. Service ini menangani submit run, leaderboard, detail run, komentar, dan proses review admin.

## Service Info

| Item | Value |
|---|---|
| Framework | NestJS |
| Default Port | 3002 |
| Database | MySQL |
| ORM | Prisma |
| Auth | Passport JWT |
| Swagger | `http://localhost:3002/api` |

## Setup

Pastikan database dari `../database.sql` sudah di-import ke MySQL/XAMPP. Service ini juga perlu Auth Service dan Game Service berjalan untuk validasi user/category.

```bash
npm install
```

Buat `.env`:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
RUN_SERVICE_PORT=3002
AUTH_SERVICE_URL=http://localhost:3000
GAME_SERVICE_URL=http://localhost:3001
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
| GET | `/runs/:id/category` | Public | Leaderboard kategori, hanya run `ACCEPTED`, urut durasi tercepat |
| GET | `/runs/:id/user` | User | Riwayat run user. Owner melihat semua status, user lain hanya `ACCEPTED` |
| GET | `/runs/:id` | Public | Detail run yang sudah `ACCEPTED` beserta category, game, comment, dan runner |
| POST | `/runs` | User | Submit run baru dengan status `PENDING` |
| POST | `/comments` | User | Tambah comment pada run |
| DELETE | `/comments/:id` | User | Hapus comment sendiri |
| GET | `/admin/runs/:status` | Admin | List run berdasarkan `PENDING`, `ACCEPTED`, atau `REJECTED` |
| POST | `/admin/runs/:id/accept` | Admin | Accept run |
| POST | `/admin/runs/:id/reject` | Admin | Reject run |

## Authentication

Endpoint User/Admin wajib memakai header:

```http
Authorization: Bearer <jwt_token>
```

Token dibuat oleh Auth Service dan payload berisi `user_id` dan `role`.

## Validation

| Feature | Rule |
|---|---|
| Submit run | `run_category_id` harus valid, `vod_url` wajib diisi, `run_duration` harus angka |
| Create comment | `run_id` dan `user_id` harus valid, `user_id` harus sama dengan user dari token, `comment` wajib diisi |
| Review run | Status admin filter hanya `PENDING`, `ACCEPTED`, atau `REJECTED` |
