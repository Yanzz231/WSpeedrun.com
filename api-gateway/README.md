# WSpeedrun API Gateway

NestJS API Gateway for WSpeedrun.com. It exposes one HTTP entrypoint on port
3003 and forwards requests to the Auth, Game, and Run services with Axios.

## Routes

| Route group | Target service |
|---|---|
| `/auth`, `/users` | Auth Service |
| `/games`, `/categories`, `/admin/games`, `/admin/categories` | Game Service |
| `/runs`, `/comments`, `/admin/runs` | Run Service |

## Setup

```bash
npm install
npm run start:dev
```

Swagger is available at `http://localhost:3003/api`.
