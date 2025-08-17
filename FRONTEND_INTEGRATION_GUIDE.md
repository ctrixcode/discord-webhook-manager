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

- **Access Token:** The `accessToken` is returned in the response body for login and registration (both email/password and Discord). You should store this token in memory (e.g., a state management solution like Redux, React Context, or a simple variable) and include it in the `Authorization` header of all subsequent authenticated requests.

- **Refresh Token:** The `refreshToken` is automatically managed by the browser as an `httpOnly` cookie. Your frontend code does not need to directly access or send this cookie. The backend will automatically use it to refresh your `accessToken` when it expires.

- **Token Refresh Mechanism:** If your `accessToken` expires, the backend's authentication middleware will attempt to use the `refreshToken` from the cookie to issue a new `accessToken`. If a new `accessToken` is issued, it will be sent back in the `X-Access-Token` response header. Your frontend should check for this header on every authenticated API response and update its stored `accessToken` accordingly.

**Example (using `fetch` and handling `X-Access-Token` header):**

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  let currentAccessToken = localStorage.getItem('accessToken'); // Or from your state management

  const headers = {
    'Content-Type': 'application/json',
    ...
    ...(currentAccessToken && { 'Authorization': `Bearer ${currentAccessToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Check for new access token in headers
  const newAccessToken = response.headers.get('X-Access-Token');
  if (newAccessToken) {
    localStorage.setItem('accessToken', newAccessToken); // Update stored token
    console.log('Access token refreshed!');
  }

  if (!response.ok) {
    // Handle errors, e.g., if refresh token is also invalid (401)
    if (response.status === 401) {
      console.error('Authentication failed. Redirect to login.');
      // Redirect to login page or trigger re-authentication flow
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}

// Example usage:
makeAuthenticatedRequest('/api/user')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

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
