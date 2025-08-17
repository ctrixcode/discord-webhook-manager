# API Client Documentation

This directory contains a centralized API client setup for the Discord Webhook Manager frontend application.

## Structure

```
src/lib/api/
├── client.ts           # Centralized axios client with auth handling
├── types.ts           # TypeScript types for API responses
├── queries/           # API query functions organized by feature
│   ├── auth.ts        # Authentication queries
│   ├── user.ts        # User management queries
│   ├── webhook.ts     # Webhook management queries
│   └── discord-token.ts # Discord token management queries
├── index.ts           # Main exports
├── examples.ts        # Usage examples
└── README.md          # This file
```

## Features

### 🔐 Authentication Handling
- Automatic token management (access token + refresh token)
- Token refresh via response headers
- Automatic logout on 401 errors
- Discord OAuth integration

### 🚀 Centralized Client
- Single axios instance with consistent configuration
- Request/response interceptors for auth
- Error handling and token refresh
- Base URL configuration via environment variables

### 📝 Type Safety
- Full TypeScript support
- Typed API responses
- Request/response interfaces

### 🎣 React Hooks
- `useApi` hook for general API calls
- `useMutation` hook for POST/PUT/DELETE operations
- `useQuery` hook for GET operations with auto-execution
- Built-in loading states and error handling

## Quick Start

### 1. Environment Setup

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 2. Basic Usage

```typescript
import { api } from '@/lib/api';

// Get current user
const user = await api.user.getCurrentUser();

// Create a webhook
const webhook = await api.webhook.createWebhook({
  name: 'My Webhook',
  url: 'https://discord.com/api/webhooks/123/abc'
});

// Login with Discord
api.auth.loginWithDiscord();
```

### 3. Using React Hooks

```typescript
import { useApi, useMutation } from '@/hooks/useApi';
import { api } from '@/lib/api';

function MyComponent() {
  // For queries
  const { data: user, loading, error, execute: fetchUser } = useApi(api.user.getCurrentUser);
  
  // For mutations
  const { execute: createWebhook, loading: creating } = useMutation(api.webhook.createWebhook);

  const handleCreate = async () => {
    await createWebhook({
      name: 'New Webhook',
      url: 'https://discord.com/api/webhooks/456/def'
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.username}!</p>}
      <button onClick={handleCreate} disabled={creating}>
        Create Webhook
      </button>
    </div>
  );
}
```

## Authentication Flow

### 1. Discord Login
```typescript
// Redirect to Discord OAuth
api.auth.loginWithDiscord();
```

### 2. Token Management
The client automatically:
- Stores access tokens in localStorage
- Includes tokens in request headers
- Refreshes tokens via response headers
- Clears tokens on authentication errors

### 3. Check Authentication Status
```typescript
const isAuthenticated = api.auth.isAuthenticated();
```

## API Endpoints

### Authentication
- `api.auth.getCurrentUser()` - Get current user
- `api.auth.loginWithDiscord()` - Redirect to Discord login
- `api.auth.logout()` - Clear tokens and logout
- `api.auth.isAuthenticated()` - Check auth status

### User Management
- `api.user.getCurrentUser()` - Get current user
- `api.user.getUserById(id)` - Get user by ID
- `api.user.updateUser(id, data)` - Update user
- `api.user.deleteUser(id)` - Delete user

### Webhook Management
- `api.webhook.getAllWebhooks()` - Get all webhooks
- `api.webhook.getWebhookById(id)` - Get webhook by ID
- `api.webhook.createWebhook(data)` - Create webhook
- `api.webhook.updateWebhook(id, data)` - Update webhook
- `api.webhook.deleteWebhook(id)` - Delete webhook

### Discord Token Management
- `api.discordToken.getDiscordTokenByUserId(userId)` - Get Discord token
- `api.discordToken.createDiscordToken(data)` - Create Discord token
- `api.discordToken.updateDiscordToken(userId, data)` - Update Discord token
- `api.discordToken.deleteDiscordToken(userId)` - Delete Discord token

## Error Handling

The client automatically handles:
- 401 errors (clears tokens, triggers logout)
- Network errors
- Response parsing errors

Custom error handling:
```typescript
try {
  const data = await api.webhook.getAllWebhooks();
} catch (error) {
  if (error.response?.status === 403) {
    // Handle authorization error
  } else {
    // Handle other errors
    console.error(error.response?.data?.message);
  }
}
```

## Configuration

### Base URL
Set via environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Request Timeout
Modify in `client.ts`:
```typescript
this.client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  // ...
});
```

## Best Practices

1. **Always use the centralized client** - Don't create separate axios instances
2. **Use TypeScript types** - Import types from `./types.ts`
3. **Handle errors gracefully** - Use try/catch or the useApi hook error states
4. **Check authentication** - Use `api.auth.isAuthenticated()` before making authenticated requests
5. **Use React hooks** - Prefer `useApi` and `useMutation` in components for better UX

## Troubleshooting

### Token Issues
- Check localStorage for `accessToken`
- Verify refresh token cookies are being sent
- Check network tab for `X-Access-Token` response headers

### CORS Issues
- Ensure `withCredentials: true` is set in client
- Verify backend CORS configuration allows credentials

### Environment Variables
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Restart development server after changing env vars