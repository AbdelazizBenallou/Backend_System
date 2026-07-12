# Backend_System

RESTful backend API with JWT authentication, RBAC, file management, and PostgreSQL.

## Tech Stack

- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- JWT (access + refresh tokens)
- Argon2 password hashing
- Zod validation
- Rate limiting (in-memory)
- Swagger / OpenAPI
- Nginx reverse proxy (X-Accel-Redirect)

## Requirements

- Node.js 18+
- PostgreSQL 16+
- Nginx (optional, for file serving)

## Setup

```bash
# Clone and install
git clone <repo-url>
cd backend-api
npm install

# Environment
cp .env.example .env
# Edit .env with your database URL and JWT secrets

# Database
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed-users.ts

# Start
npm run dev
```

## Default Admin

```
Email:    admin@email.com
Password: Admin@12345
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm run seed` | Seed 200 test users |
| `npx prisma studio` | Open DB browser |

## API Docs

```
http://localhost:3000/api-docs   # Swagger UI
http://localhost:3000/api-json   # Raw OpenAPI spec
```

## Project Structure

```
src/modules/
├── auth/       # Register, login, refresh, logout
├── files/      # Upload, download, list, delete
├── roles/      # Roles, permissions, assignments
└── users/      # CRUD users
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ACCESS_SECRET` | JWT access token secret (256-bit hex) |
| `REFRESH_SECRET` | JWT refresh token secret (256-bit hex) |
| `UPLOAD_DIR` | File storage directory |
| `CORS_ORIGINS` | Allowed CORS origins |
| `MALWARE_SCANNER_ENABLED` | Enable/disable ClamAV scanning |
