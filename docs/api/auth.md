# Authentication

Base URL: `http://localhost:3000/v1/auth`

---

## Login

**POST** `/login`

### Request
```json
{
  "email": "admin@email.com",
  "password": "Password123!"
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": 1,
      "email": "admin@email.com",
      "status": "active",
      "roles": ["Admin"]
    }
  }
}
```

### Response — 401
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

---

## Register

**POST** `/register`

### Request
```json
{
  "email": "newuser@email.com",
  "password": "Password123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Response — 201
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": 2,
      "email": "newuser@email.com",
      "status": "active",
      "roles": ["Customer"],
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### Response — 409
```json
{
  "success": false,
  "message": "Email already exists",
  "data": null
}
```

---

## Refresh Token

**POST** `/refresh-token`

### Request
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Response — 403
```json
{
  "success": false,
  "message": "Invalid refresh token",
  "data": null
}
```

---

## Logout

**POST** `/logout`

### Request
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response — 200
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```
