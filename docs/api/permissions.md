# Permissions

Base URL: `http://localhost:3000/v1/permissions`

All endpoints require `Authorization: Bearer <accessToken>` header and `manage_roles` permission.

---

## List Permissions

**GET** `/permissions`

### Request
```
GET /v1/permissions
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
    },
    {
      "permission_id": 3,
      "name": "view_reports"
    }
  ]
}
```

---

## Get Permission by ID

**GET** `/permissions/:id`

### Request
```
GET /v1/permissions/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Permission fetched successfully",
  "data": {
    "permission_id": 1,
    "name": "manage_users"
  }
}
```

### Response — 404
```json
{
  "success": false,
  "message": "Permission not found",
  "data": null
}
```

---

## Create Permission

**POST** `/permissions`

### Request
```json
{
  "name": "view_reports"
}
```

### Response — 201
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permission_id": 4,
    "name": "view_reports"
  }
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Permission name already exists",
  "data": null
}
```

---

## Update Permission

**PATCH** `/permissions/:id`

### Request
```json
{
  "name": "view_financial_reports"
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permission_id": 4,
    "name": "view_financial_reports"
  }
}
```

---

## Delete Permission

**DELETE** `/permissions/:id`

### Request
```
DELETE /v1/permissions/4
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response — 200
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": null
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Cannot delete permission assigned to roles",
  "data": null
}
```

---

## Get Roles by Permission

**GET** `/permissions/:id/roles`

### Request
```
GET /v1/permissions/1/roles
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
    }
  ]
}
```
