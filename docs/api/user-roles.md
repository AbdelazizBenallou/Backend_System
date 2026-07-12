# User-Role Assignment

Base URL: `http://localhost:3000/v1/users`

All endpoints require `Authorization: Bearer <accessToken>` header and `manage_roles` permission.

---

## Get User Roles

**GET** `/users/:id/roles`

### Request
```
GET /v1/users/1/roles
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Roles fetched successfully",
  "data": [
    {
      "role_id": 1,
      "name": "Admin"
    },
    {
      "role_id": 4,
      "name": "Customer"
    }
  ]
}
```

---

## Assign Role to User

**POST** `/users/:id/roles`

### Request
```json
{
  "role_id": 2
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": [
    {
      "role_id": 1,
      "name": "Admin"
    },
    {
      "role_id": 2,
      "name": "Manager"
    },
    {
      "role_id": 4,
      "name": "Customer"
    }
  ]
}
```

### Response — 409
```json
{
  "success": false,
  "message": "User already has this role",
  "data": null
}
```

---

## Remove Role from User

**DELETE** `/users/:id/roles/:roleId`

### Request
```
DELETE /v1/users/1/roles/4
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Role removed successfully",
  "data": [
    {
      "role_id": 1,
      "name": "Admin"
    },
    {
      "role_id": 2,
      "name": "Manager"
    }
  ]
}
```

### Response — 404
```json
{
  "success": false,
  "message": "User does not have this role",
  "data": null
}
```
