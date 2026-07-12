# API Documentation

Base URL: `http://localhost:3000`

## Endpoints

| File | Endpoints |
|------|-----------|
| [auth.md](auth.md) | POST /v1/auth/login, /register, /refresh-token, /logout |
| [users.md](users.md) | GET/PATCH/DELETE /v1/users |
| [roles.md](roles.md) | CRUD /v1/roles + permission assignment + users by role |
| [permissions.md](permissions.md) | CRUD /v1/permissions + roles by permission |
| [user-roles.md](user-roles.md) | GET/POST/DELETE /v1/users/:id/roles |
| [errors.md](errors.md) | Error response format + status codes |

## Response Format

All successful responses:
```json
{
  "success": true,
  "message": "Action completed",
  "data": { ... }
}
```

All error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Authentication

- Most endpoints require `Authorization: Bearer <accessToken>` header
- Access tokens expire after 1 hour
- Use refresh token to get a new access token (see [auth.md](auth.md))
- Refresh tokens expire after 7 days
