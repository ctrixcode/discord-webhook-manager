## Message Template Endpoints (`/message-template`)

### 1. Create Message Template

- **Endpoint:** `POST /message-template`
- **Description:** Creates a new message template for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Payload:
```json
{
  "name": "Welcome Message",
  "content": "Hello {{username}}, welcome to our service!",
  "embeds": [
    {
      "title": "Welcome!",
      "description": "We are glad to have you.",
      "color": 3447003
    }
  ]
}
```

#### Successful Response (Status: 201 Created):
```json
{
  "success": true,
  "message": "Message Template created",
  "data": {
    "id": "templateId123",
    "userId": "userId123",
    "name": "Welcome Message",
    "content": "Hello, {{username}}! Welcome to our service.",
    "createdAt": "2025-09-07T11:00:00.000Z",
    "updatedAt": "2025-09-07T11:00:00.000Z"
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
  "code": "USER_NOT_FOUND_ERROR",
  "message": "User not found or not authenticated."
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

### 2. Get All Message Templates

- **Endpoint:** `GET /message-template`
- **Description:** Retrieves all message templates for the authenticated user, with optional pagination.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Message Templates fetched",
  "data": {
    "messageTemplates": [
      {
        "id": "templateId1",
        "userId": "userId123",
        "name": "Template A",
        "content": "Content A",
        "createdAt": "2025-09-07T10:00:00.000Z",
        "updatedAt": "2025-09-07T10:00:00.000Z"
      },
      {
        "id": "templateId2",
        "userId": "userId123",
        "name": "Template B",
        "content": "Content B",
        "createdAt": "2025-09-07T10:30:00.000Z",
        "updatedAt": "2025-09-07T10:30:00.000Z"
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
  "code": "USER_NOT_FOUND_ERROR",
  "message": "User not found or not authenticated."
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

### 3. Get Single Message Template by ID

- **Endpoint:** `GET /message-template/:id`
- **Description:** Retrieves a specific message template by its ID for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the message template to retrieve (e.g., `template_12345`)

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Message Template fetched",
  "data": {
    "id": "templateId123",
    "userId": "userId123",
    "name": "Welcome Message",
    "content": "Hello, {{username}}! Welcome to our service.",
    "createdAt": "2025-09-07T11:00:00.000Z",
    "updatedAt": "2025-09-07T11:00:00.000Z"
  }
}
```

#### Error Responses:

**a) Message Template Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Message template not found"
}
```

**b) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "USER_NOT_FOUND_ERROR",
  "message": "User not found or not authenticated."
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

### 4. Update Message Template by ID

- **Endpoint:** `PUT /message-template/:id`
- **Description:** Updates an existing message template's details for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the message template to update (e.g., `template_12345`)

#### Request Payload:
```json
{
  "name": "Updated Welcome Message",
  "content": "Hello {{username}}, welcome to our updated service!",
  "embeds": [
    {
      "title": "Updated Welcome!",
      "description": "We are still glad to have you.",
      "color": 16711680
    }
  ]
}
```

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Message Template updated successfully",
  "data": {
    "id": "templateId123",
    "userId": "userId123",
    "name": "Updated Welcome Message",
    "content": "Hello, {{username}}! Welcome to our updated service.",
    "createdAt": "2025-09-07T11:00:00.000Z",
    "updatedAt": "2025-09-07T11:45:00.000Z"
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

**b) Message Template Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Message template not found"
}
```

**c) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "USER_NOT_FOUND_ERROR",
  "message": "User not found or not authenticated."
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

### 5. Delete Message Template by ID

- **Endpoint:** `DELETE /message-template/:id`
- **Description:** Deletes a specific message template by its ID for the authenticated user.
- **Authentication:** Required (JWT in `Authorization` header)

#### Request Parameters:
- `id`: The ID of the message template to delete (e.g., `template_12345`)

#### Request Payload:
No payload.

#### Successful Response (Status: 204 No Content):
No payload.

#### Error Responses:

**a) Message Template Not Found (Status: 404 Not Found)**
```json
{
  "success": false,
  "code": "NOT_FOUND_ERROR",
  "message": "Message template not found"
}
```

**b) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "USER_NOT_FOUND_ERROR",
  "message": "User not found or not authenticated."
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
