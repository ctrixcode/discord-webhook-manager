## Authentication Endpoints (`/auth`)

### 1. Refresh Access Token

- **Endpoint:** `POST /auth/refresh`
- **Description:** Refreshes the user's access token using a valid refresh token.
- **Authentication:** Not required (refresh token is sent in cookie)

#### Request Payload:
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkdW1teVVzZXJJZDEyMyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkdW1teVVzZXJJZDEyMyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwNjA0ODAwLCJqdGkiOiJkdW1teUp0aTEyMyJ9.another_signature"
  }
}
```

#### Error Responses:

**a) Unauthorized (Status: 401 Unauthorized)**
```json
{
  "success": false,
  "code": "NO_TOKEN_ERROR",
  "message": "No token provided"
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

### 2. Logout User

- **Endpoint:** `POST /auth/logout`
- **Description:** Logs out the current user by clearing their session and invalidating tokens.
- **Authentication:** Not required (clears existing session)

#### Request Payload:
No payload.

#### Successful Response (Status: 200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
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

### 3. Discord Login

- **Endpoint:** `GET /auth/discord`
- **Description:** Initiates the Discord OAuth2 login flow. The user will be redirected to Discord's authorization page.
- **Authentication:** Not required

#### Request Payload:
No payload.

#### Successful Response:
This endpoint performs a redirect to Discord. There is no direct JSON response.

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

### 4. Discord Callback

- **Endpoint:** `GET /auth/discord/callback`
- **Description:** Callback URL for Discord OAuth2. After successful authorization on Discord, the user is redirected here. This endpoint handles the token exchange and user session creation.
- **Authentication:** Not required

#### Request Payload:
No direct payload. Discord sends `code` and `state` as query parameters.

#### Successful Response:
This endpoint typically performs a redirect to the frontend application with session information or a success indicator. There is no direct JSON response.

#### Error Responses:

**a) Missing Discord Code (Status: 400 Bad Request)**
```json
{
  "success": false,
  "code": "MISSING_CODE_ERROR",
  "message": "Missing authorization code"
}
```

**b) Failed Token Exchange (Status: 500 Internal Server Error)**
```json
{
  "success": false,
  "code": "FAILED_TOKEN_EXCHANGE_ERROR",
  "message": "Failed to exchange Discord code for token"
}
```

**c) Failed to Fetch Discord User Info (Status: 502 Bad Gateway)**
```json
{
  "success": false,
  "code": "FAILED_FETCH_USER_INFO_ERROR",
  "message": "Failed to fetch Discord user info",
  "details": {
    "source": "discord"
  }
}
```