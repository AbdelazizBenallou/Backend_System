# Error Responses

All API errors follow this format:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "data": null
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request (invalid ID, validation failed) |
| 401 | Unauthorized (no token or expired token) |
| 403 | Forbidden (valid token but missing permission) |
| 404 | Resource not found |
| 409 | Conflict (duplicate name, already assigned) |
| 429 | Rate limited (too many requests) |
| 500 | Internal server error |

## Error Message Examples

```json
// 400 - Invalid ID
{ "success": false, "message": "Invalid user ID", "data": null }

// 401 - No token
{ "success": false, "message": "Unauthorized", "data": null }

// 403 - Missing permission
{ "success": false, "message": "Forbidden", "data": null }

// 404 - Not found
{ "success": false, "message": "User not found", "data": null }

// 409 - Conflict
{ "success": false, "message": "Role name already exists", "data": null }

// 429 - Rate limited
{ "success": false, "message": "Too many requests, please try again later", "data": null }

// 500 - Server error
{ "success": false, "message": "Internal server error", "data": null }
```

## Validation Errors (if any Zod validation fails)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    { "field": "email", "message": "Invalid email" },
    { "field": "password", "message": "String must contain at least 8 character(s)" }
  ]
}
```

## Token Expiry

When the access token expires, the API returns 401. The frontend should:

1. Intercept the 401 response
2. Call `POST /v1/auth/refresh-token` with the stored refresh token
3. If refresh succeeds → store new access token → retry the original request
4. If refresh fails (refresh token also expired) → redirect to login page
