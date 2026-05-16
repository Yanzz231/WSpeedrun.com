# WSpeedrun Game Service

Game Service untuk WSpeedrun.com. Service ini menangani katalog game dan run category, termasuk CRUD khusus admin.

## Service Info

| Item | Value |
|---|---|
| Framework | NestJS |
| Default Port | 3001 |
| Database | MySQL |
| ORM | Prisma |
| Auth | Passport JWT |
| Swagger | `http://localhost:3001/api` |

## Setup

Pastikan database dari `../database.sql` sudah di-import ke MySQL/XAMPP.

```bash
npm install
```

Buat `.env`:

```env
DATABASE_URL=mysql://root:@localhost:3306/wspeedrun
JWT_SECRET=your_secret_key
GAME_SERVICE_PORT=3001
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
| GET | `/games` | Public | List semua game |
| GET | `/games/:id` | Public | Detail game beserta run category |
| GET | `/categories/:id` | Public | Detail run category beserta game |
| POST | `/admin/games` | Admin | Buat game baru |
| PATCH | `/admin/games/:id/update` | Admin | Update detail game |
| DELETE | `/admin/games/:id/delete` | Admin | Hapus game |
| POST | `/admin/categories` | Admin | Buat run category baru |
| PATCH | `/admin/categories/:id/update` | Admin | Update run category |
| DELETE | `/admin/categories/:id/delete` | Admin | Hapus run category |

## Admin Access

Endpoint `/admin/*` wajib memakai header:

```http
Authorization: Bearer <jwt_token>
```

Token harus punya role `ADMIN`.

## Validation

| Feature | Rule |
|---|---|
| Create game | `game_name` dan `description` wajib diisi |
| Create category | `game_id` wajib valid dan `run_category_name` wajib diisi |
| Update category | Jika `game_id` dikirim, ID harus ada di tabel `games` |
