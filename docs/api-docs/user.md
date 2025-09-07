## User Endpoints (`/user`)

### 1. Get Current User

- **Endpoint:** `GET /user`
- **Description:** Retrieves the profile information of the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Query Parameters:
- `page` (optional): Page number for pagination (default: 1) - *Note: This endpoint typically returns a single user, so pagination might not be directly applicable unless it's for a list of users the current user manages.*
- `limit` (optional): Number of items per page (default: 10)

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "userId123",
    "username": "dummyUser",
    "email": "dummy@example.com",
    "discordId": "discordId123",
    "discordUsername": "dummyDiscord",
    "discordAvatar": "https://cdn.discordapp.com/avatars/discordId123/dummyhash.png",
    "guilds": [
      {
        "id": "guildId1",
        "name": "My Discord Server",
        "icon": "guildIconHash"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-09-07T12:00:00.000Z"
  }
}
```

#### Error Responses:

**a) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**b) User Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**c) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

### 2. Update User by ID

- **Endpoint:** `PUT /user/:id`
- **Description:** Updates the profile information of the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the user to update (e.g., `user_abcde`) - *Note: Typically, a user can only update their own profile, so this ID should match the authenticated user's ID.*

#### Request Payload:
```json
{
  "username": "NewCandyKisu",
  "email": "new.candy.kisu@example.com"
}
```

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "userId123",
    "username": "updatedUser",
    "email": "updated@example.com",
    "discordId": "discordId123",
    "discordUsername": "dummyDiscord",
    "discordAvatar": "https://cdn.discordapp.com/avatars/discordId123/dummyhash.png",
    "guilds": [],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-09-07T12:30:00.000Z"
  }
}
```

#### Error Responses:

**a) Validation Error (Status: 400 Bad Request)**
```json
{
  "success": false,
  "code": "INVALID_INPUT_ERROR",
  "message": "Invalid input."
}
```

**b) User Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**c) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NO_TOKEN_ERROR",
  "message": "No token provided"
}
```

**d) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

### 3. Get User Usage

- **Endpoint:** `GET /user/me/usage`
- **Description:** Retrieves the usage statistics for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Payload:
No payload.

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "User usage fetched successfully",
  "data": {
    "webhookMessagesSentToday": 50,
    "totalMediaStorageUsed": 1024000,
    "dailyWebhookMessageLimit": 100,
    "overallMediaStorageLimit": 52428800
  }
}
```

#### Error Responses:

**a) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**b) User Usage Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User usage record not found"
}
```

**c) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```
