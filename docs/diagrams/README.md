# API Sequence Diagrams

PlantUML sequence diagrams for every endpoint.

## Files

| File | Endpoint | Description |
|------|----------|-------------|
| `login.puml` | POST /v1/auth/login | Authenticate user, return JWT pair |
| `register.puml` | POST /v1/auth/register | Create new user + profile + Customer role |
| `refresh-token.puml` | POST /v1/auth/refresh-token | Exchange refresh token for new access token |
| `logout.puml` | POST /v1/auth/logout | Revoke refresh token, clear cookies |
| `list-users.puml` | GET /v1/users | Paginated user list (Admin) |
| `get-user.puml` | GET /v1/users/:id | Get single user by ID (Admin) |
| `update-user.puml` | PATCH /v1/users/:id | Update user status/profile (Admin) |
| `delete-user.puml` | DELETE /v1/users/:id | Delete user (Admin) |

## Viewing

- Online: https://www.plantuml.com/plantuml/uml/ (paste raw content)
- VS Code: install "PlantUML" extension, right-click → "Preview"
- CLI: `plantuml <file.puml>` to render PNG/SVG
