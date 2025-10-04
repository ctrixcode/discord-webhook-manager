## Health Check and Root Endpoints

### 1. Health Check

- **Endpoint:** `GET /healthz`
- **Description:** Checks the health and status of the API server.
- **Authentication:** Not required

#### Request Payload:
No payload.

#### Successful Response (Status: 200 OK):
```json
{
  "success": true
}
```

#### Error Responses:

**a) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

### 2. Root Endpoint

- **Endpoint:** `GET /`
- **Description:** A simple endpoint to confirm the server is live.
- **Authentication:** Not required

#### Request Payload:
No payload.

#### Successful Response (Status: 200 OK):
```
Server is live!
```

#### Error Responses:

**a) Internal Server Error (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```
