# Frontend Integration Guide

This guide provides instructions on how to integrate your frontend application with the Discord Webhook Manager Backend API.

## Base URL

The base URL for all API requests is typically `http://localhost:4000/api` during development. Please refer to your backend deployment for the production URL.

## Authentication

The backend uses a combination of access tokens and refresh tokens for authentication. The access token is sent in the `Authorization` header as a Bearer token, while the refresh token is managed via `httpOnly` cookies.

### 1. Login with Discord

This flow involves redirecting the user to Discord for authorization and then handling the callback.

- **Initiate Discord Login:**
  When the user clicks a "Login with Discord" button, redirect them to the backend endpoint:
  `GET /api/auth/discord`

  The backend will then redirect the user to Discord's authorization page. After the user authorizes your application on Discord, Discord will redirect them back to the `DISCORD_REDIRECT_URI` configured in your backend (e.g., `http://localhost:4000/api/auth/discord/callback`).

- **Handling the Callback:**
  Your frontend doesn't directly interact with the Discord callback. The backend handles the exchange of the authorization code for Discord tokens, fetches user data, and then either creates a new user or logs in an existing one. Upon successful processing, the backend will set the `refreshToken` cookie and return an `accessToken` in the response body (or potentially redirect to your frontend application with the `accessToken` in the URL or a cookie, depending on your frontend setup).

  **Example (Frontend action for Discord Login Button):**

  ```javascript
  function handleDiscordLogin() {
    window.location.href = 'http://localhost:4000/api/auth/discord';
  }
  ```

### 2. Token Handling

- **Access Token:** The `accessToken` is returned in the response body for login and refresh operations. **It should be stored only in memory** (e.g., a state management solution like Redux, React Context, or a simple variable) and included in the `Authorization` header of all subsequent authenticated requests. **Do NOT store it in `localStorage` or `sessionStorage`**.

- **Refresh Token:** The `refreshToken` is automatically managed by the browser as an `httpOnly` cookie. Your frontend code does not need to directly access or send this cookie. The backend uses a **single-use rotation mechanism** for refresh tokens:
    *   When a refresh token is used to obtain a new access token, the old refresh token is immediately invalidated on the backend.
    *   A new refresh token is issued and set in a new `httpOnly` cookie.
    *   If a compromised (already used) refresh token is detected, all active sessions for that user are immediately revoked on the backend.

- **Token Refresh Mechanism:**
    *   If your frontend detects it does not have an access token in memory, or if an API call returns a 401 Unauthorized status (indicating an expired or invalid access token), the frontend should explicitly call the refresh endpoint:
        `POST /api/auth/refresh`
    *   This endpoint will return a new `accessToken` in the **JSON response payload**.
    *   If the refresh attempt results in a 401 (meaning the refresh token itself is invalid, expired, or compromised), the frontend should redirect the user to the login page to re-authenticate.

**Example (Frontend logic for token refresh):**

```javascript
async function refreshAndRetry(originalRequest) {
  try {
    const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
    if (!refreshResponse.ok) {
      // Refresh token invalid or compromised, redirect to login
      window.location.href = '/login'; // Or your specific login route
      return;
    }
    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.data.accessToken;
    // Store newAccessToken in memory (e.g., update your state management)
    // Then retry the original request with the new token
    originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
    return fetch(originalRequest);
  } catch (error) {
    console.error('Error during token refresh:', error);
    window.location.href = '/login';
  }
}

// Example usage in an API client:
async function makeAuthenticatedRequest(url, options = {}) {
  let accessToken = getAccessTokenFromMemory(); // Function to retrieve token from memory

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const request = new Request(url, { ...options, headers });
  let response = await fetch(request);

  if (response.status === 401) {
    // Access token expired, try to refresh
    response = await refreshAndRetry(request.clone()); // Clone request to retry
  }

  if (!response || !response.ok) {
    // Handle other errors or failed refresh
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}

// Placeholder for your in-memory token storage
let inMemoryAccessToken = null;
function getAccessTokenFromMemory() {
  return inMemoryAccessToken;
}
function setAccessTokenInMemory(token) {
  inMemoryAccessToken = token;
}

// Example usage:
// On app load, or when token is missing:
// makeAuthenticatedRequest('/api/user')
//   .then(data => {
//     setAccessTokenInMemory(data.data.accessToken); // Assuming /api/user returns it on first call
//     console.log(data);
//   })
//   .catch(error => console.error('Error:', error));


## User Management

### 1. Get Current Authenticated User

- **Endpoint:** `GET /api/user/`
- **Authentication:** Required
- **Success Response:** User object

### 2. Get User by ID

- **Endpoint:** `GET /api/user/:id`
- **Authentication:** Required
- **Success Response:** User object

### 3. Update User

- **Endpoint:** `PUT /api/user/:id`
- **Authentication:** Required
- **Body:** (Partial user object with fields to update)
  ```json
  {
    "username": "NewUsername",
    "email": "new_email@example.com"
  }
  ```
- **Success Response:** Updated user object

### 4. Delete User

- **Endpoint:** `DELETE /api/user/:id`
- **Authentication:** Required
- **Success Response:** `{ success: true, message: "User deleted successfully" }`

## Webhook Management

### 1. Create Webhook

- **Endpoint:** `POST /api/webhook/`
- **Authentication:** Required
- **Body:**
  ```json
  {
    "name": "My New Webhook",
    "url": "https://discord.com/api/webhooks/your-webhook-id/your-webhook-token",
    "description": "Optional description"
  }
  ```
- **Success Response:** Created webhook object

### 2. Get All Webhooks

- **Endpoint:** `GET /api/webhook/`
- **Authentication:** Required
- **Success Response:** Array of webhook objects

### 3. Get Webhook by ID

- **Endpoint:** `GET /api/webhook/:id`
- **Authentication:** Required
- **Success Response:** Webhook object

### 4. Update Webhook

- **Endpoint:** `PUT /api/webhook/:id`
- **Authentication:** Required
- **Body:** (Partial webhook object with fields to update)
  ```json
  {
    "name": "Updated Webhook Name"
  }
  ```
- **Success Response:** Updated webhook object

### 5. Delete Webhook

- **Endpoint:** `DELETE /api/webhook/:id`
- **Authentication:** Required
- **Success Response:** `{ success: true, message: "Webhook deleted successfully" }`

## Discord Token Management

### 1. Create Discord Token

- **Endpoint:** `POST /api/discord-token/`
- **Authentication:** Required
- **Body:**
  ```json
  {
    "access_token": "your_access_token",
    "refresh_token": "your_refresh_token",
    "expires_in": 3600,
    "user_id": "the_user_id_this_token_belongs_to"
  }
  ```
- **Success Response:** Created Discord token object

### 2. Get Discord Token by User ID

- **Endpoint:** `GET /api/discord-token/:id` (where `:id` is the user ID)
- **Authentication:** Required
- **Success Response:** Discord token object

### 3. Update Discord Token

- **Endpoint:** `PUT /api/discord-token/:id` (where `:id` is the user ID)
- **Authentication:** Required
- **Body:** (Partial Discord token object with fields to update)
  ```json
  {
    "access_token": "new_access_token",
    ""expires_in": 7200
  }
  ```
- **Success Response:** Updated Discord token object

### 4. Delete Discord Token

- **Endpoint:** `DELETE /api/discord-token/:id` (where `:id` is the user ID)
- **Authentication:** Required
- **Success Response:** `{ success: true, message: "Discord token deleted successfully" }`

## Error Handling

The API will return appropriate HTTP status codes for errors (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error). The response body for errors will typically follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Your frontend application should handle these error responses gracefully, displaying user-friendly messages as needed.
