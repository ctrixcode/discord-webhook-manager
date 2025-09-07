## Webhook Endpoints (`/webhook`)

### 1. Create Webhook

- **Endpoint:** `POST /webhook`
- **Description:** Creates a new Discord webhook for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Payload:
```json
{
  "name": "My Discord Webhook",
  "url": "https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz",
  "description": "Webhook for general notifications.",
  "defaultAvatarId": "avatar_12345"
}
```

#### Successful Response (Status: 201 Created):
```json
{
  "success": true,
  "message": "Webhook created successfully",
  "data": {
    "id": "webhookId123",
    "userId": "userId123",
    "name": "My Discord Webhook",
    "url": "https://discord.com/api/webhooks/12345/abcdef",
    "status": "active",
    "createdAt": "2025-09-07T13:00:00.000Z",
    "updatedAt": "2025-09-07T13:00:00.000Z"
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

**b) Unauthorized (Status: 401 Unauthorized)**
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

### 2. Get All Webhooks

- **Endpoint:** `GET /webhook`
- **Description:** Retrieves all webhooks for the authenticated user, with optional pagination and status filtering.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter webhooks by status (e.g., `active`, `inactive`, `error`)

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Webhooks fetched successfully",
  "data": {
    "webhooks": [
      {
        "id": "webhookId1",
        "userId": "userId123",
        "name": "Webhook A",
        "url": "https://discord.com/api/webhooks/1/a",
        "status": "active",
        "createdAt": "2025-09-07T12:00:00.000Z",
        "updatedAt": "2025-09-07T12:00:00.000Z"
      },
      {
        "id": "webhookId2",
        "userId": "userId123",
        "name": "Webhook B",
        "url": "https://discord.com/api/webhooks/2/b",
        "status": "inactive",
        "createdAt": "2025-09-07T12:15:00.000Z",
        "updatedAt": "2025-09-07T12:15:00.000Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10
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

**b) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

### 3. Get Single Webhook by ID

- **Endpoint:** `GET /webhook/:id`
- **Description:** Retrieves a specific webhook by its ID for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the webhook to retrieve (e.g., `webhook_12345`)

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Webhook fetched successfully",
  "data": {
    "id": "webhookId123",
    "userId": "userId123",
    "name": "My Discord Webhook",
    "url": "https://discord.com/api/webhooks/12345/abcdef",
    "status": "active",
    "createdAt": "2025-09-07T13:00:00.000Z",
    "updatedAt": "2025-09-07T13:00:00.000Z"
  }
}
```

#### Error Responses:

**a) Webhook Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Webhook not found"
}
```

**b) Unauthorized (Status: 401 Unauthorized)**
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

### 4. Update Webhook by ID

- **Endpoint:** `PUT /webhook/:id`
- **Description:** Updates an existing webhook's details for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the webhook to update (e.g., `webhook_12345`)

#### Request Payload:
```json
{
  "name": "Updated Discord Webhook",
  "description": "Updated description for notifications.",
  "defaultAvatarId": null,
  "status": "inactive"
}
```

#### Successful Response (Status: 200 OK):
```json
{
  "id": "webhookId123",
  "userId": "userId123",
  "name": "Updated Discord Webhook",
  "url": "https://discord.com/api/webhooks/12345/abcdef",
  "status": "inactive",
  "createdAt": "2025-09-07T13:00:00.000Z",
  "updatedAt": "2025-09-07T13:45:00.000Z"
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

**b) Webhook Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Webhook not found"
}
```

**c) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
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

### 5. Delete Webhook by ID

- **Endpoint:** `DELETE /webhook/:id`
- **Description:** Deletes a specific webhook by its ID for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the webhook to delete (e.g., `webhook_12345`)

#### Request Payload:
No payload.

#### Successful Response (Status: 204 No Content):
No payload.

#### Error Responses:

**a) Webhook Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Webhook not found"
}
```

**b) Unauthorized (Status: 401 Unauthorized)**
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

### 6. Test Webhook

- **Endpoint:** `POST /webhook/:id/test`
- **Description:** Sends a test message to a specific webhook to verify its functionality.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the webhook to test (e.g., `webhook_12345`)

#### Request Payload:
No payload. A default test message will be sent.

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Webhook tested successfully"
}
```

#### Error Responses:

**a) Webhook Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Webhook not found"
}
```

**b) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**c) Discord API Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "SEND_FAILED_ALL_ERROR",
  "message": "Failed to send message to any webhook."
}
```

---

### 7. Send Message to Webhooks

- **Endpoint:** `POST /webhook/send-message`
- **Description:** Sends a message to one or more specified webhooks.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Payload:
```json
{
  "webhookIds": ["webhook_12345", "webhook_67890"],
  "messageData": {
    "content": "This is a message sent to multiple webhooks.",
    "username": "My Bot",
    "avatarUrl": "https://example.com/bot_avatar.png",
    "embeds": [
      {
        "title": "Important Update",
        "description": "A new feature has been released!",
        "color": 5763719
      }
    ]
}
```

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": [
    {
      "webhookId": "webhookId1",
      "status": "success",
      "message": "Message sent to webhookId1"
    },
    {
      "webhookId": "webhookId2",
      "status": "failed",
      "message": "Failed to send message to webhookId2: Invalid webhook URL"
    }
  ]
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

**b) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "User not found"
}
```

**d) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "SEND_FAILED_ALL_ERROR",
  "message": "Failed to send message to any webhook."
}
```
