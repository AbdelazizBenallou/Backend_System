# Users

Base URL: `http://localhost:3000/v1/users`

All endpoints require `Authorization: Bearer <accessToken>` header and `manage_users` permission.

---

## List Users

**GET** `/users`

### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| cursor | integer | User ID to start from (cursor pagination) |
| limit | integer | Items per page (1-200, default 100) |
| page | integer | Page number (offset pagination) |
| perPage | integer | Items per page for offset (1-200) |

### Request
```
GET /v1/users?page=1&perPage=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200 (offset pagination)
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "data": [
      {
        "user_id": 1,
        "email": "admin@email.com",
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-15T00:00:00.000Z",
        "profile": {
          "first_name": "Admin",
          "last_name": "User",
          "date_birth": null,
          "address": null,
          "level_id": null,
          "specialization_id": null
        },
        "roles": ["Admin"]
      }
    ],
    "total": 45,
    "page": 1,
    "perPage": 10,
    "totalPages": 5
  }
}
```

### Response — 200 (cursor pagination)
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "data": [
      {
        "user_id": 1,
        "email": "admin@email.com",
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-15T00:00:00.000Z",
        "profile": {
          "first_name": "Admin",
          "last_name": "User",
          "date_birth": null,
          "address": null,
          "level_id": null,
          "specialization_id": null
        },
        "roles": ["Admin"]
      }
    ],
    "nextCursor": 11,
    "hasMore": true
  }
}
```

---

## Get User by ID

**GET** `/users/:id`

### Request
```
GET /v1/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user_id": 1,
    "email": "admin@email.com",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z",
    "profile": {
      "first_name": "Admin",
      "last_name": "User",
      "date_birth": null,
      "address": null,
      "level_id": null,
      "specialization_id": null
    },
    "roles": ["Admin"]
  }
}
```

### Response — 404
```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

---

## Update User

**PATCH** `/users/:id`

### Request
```json
{
  "status": "inactive",
  "first_name": "Updated",
  "last_name": "Name"
}
```

All fields optional. Status values: `active`, `inactive`, `locked`, `suspended`.

### Response — 200
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user_id": 1,
    "email": "admin@email.com",
    "status": "inactive",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z",
    "profile": {
      "first_name": "Updated",
      "last_name": "Name",
      "date_birth": null,
      "address": null,
      "level_id": null,
      "specialization_id": null
    },
    "roles": ["Admin"]
  }
}
```

---

## Delete User

**DELETE** `/users/:id`

### Request
```
DELETE /v1/users/5
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```
