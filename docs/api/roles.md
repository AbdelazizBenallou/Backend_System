# Roles

Base URL: `http://localhost:3000/v1/roles`

All endpoints require `Authorization: Bearer <accessToken>` header and `manage_roles` permission.

---

## List Roles

**GET** `/roles`

### Request
```
GET /v1/roles
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
      "role_id": 2,
      "name": "Manager"
    },
    {
      "role_id": 3,
      "name": "Vendor"
    },
    {
      "role_id": 4,
      "name": "Customer"
    }
  ]
}
```

---

## Get Role by ID

**GET** `/roles/:id`

### Request
```
GET /v1/roles/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Role fetched successfully",
  "data": {
    "role_id": 1,
    "name": "Admin"
  }
}
```

### Response — 404
```json
{
  "success": false,
  "message": "Role not found",
  "data": null
}
```

---

## Create Role

**POST** `/roles`

### Request
```json
{
  "name": "Editor"
}
```

### Response — 201
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role_id": 5,
    "name": "Editor"
  }
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Role name already exists",
  "data": null
}
```

---

## Update Role

**PATCH** `/roles/:id`

### Request
```json
{
  "name": "Super Editor"
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "role_id": 5,
    "name": "Super Editor"
  }
}
```

---

## Delete Role

**DELETE** `/roles/:id`

### Request
```
DELETE /v1/roles/5
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": null
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Cannot delete role with assigned users",
  "data": null
}
```

---

## Get Role Permissions

**GET** `/roles/:id/permissions`

### Request
```
GET /v1/roles/1/permissions
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Permissions fetched successfully",
  "data": [
    {
      "permission_id": 1,
      "name": "manage_users"
    },
    {
      "permission_id": 2,
      "name": "manage_roles"
    }
  ]
}
```

---

## Assign Permission to Role

**POST** `/roles/:id/permissions`

### Request
```json
{
  "permission_id": 3
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Permission assigned successfully",
  "data": [
    { "permission_id": 1, "name": "manage_users" },
    { "permission_id": 2, "name": "manage_roles" },
    { "permission_id": 3, "name": "view_reports" }
  ]
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Permission already assigned to this role",
  "data": null
}
```

---

## Remove Permission from Role

**DELETE** `/roles/:id/permissions/:permissionId`

### Request
```
DELETE /v1/roles/1/permissions/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Permission removed successfully",
  "data": [
    { "permission_id": 1, "name": "manage_users" },
    { "permission_id": 2, "name": "manage_roles" }
  ]
}
```

---

## Get Users by Role

**GET** `/roles/:id/users`

### Request
```
GET /v1/roles/1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "user_id": 1,
      "email": "admin@email.com",
      "first_name": "Admin",
      "last_name": "User"
    }
  ]
}
```
