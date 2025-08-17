// Usage examples for the API client and queries

import { api, apiClient } from './index';


// Example 1: Direct API usage
export async function directApiExample() {
  try {
    // Get current user
    const user = await api.user.getCurrentUser();
    console.log('Current user:', user);

    // Create a webhook
    const webhook = await api.webhook.createWebhook({
      name: 'My Webhook',
      url: 'https://discord.com/api/webhooks/123/abc',
      description: 'Test webhook'
    });
    console.log('Created webhook:', webhook);

    // Get all webhooks
    const webhooks = await api.webhook.getAllWebhooks();
    console.log('All webhooks:', webhooks);

  } catch (error) {
    console.error('API Error:', error);
  }
}

// Example 2: Using React hooks in components


// Example 3: Setting up authentication
export function authExample() {
  // Check if user is authenticated
  const isAuthenticated = api.auth.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login
    api.auth.loginWithDiscord();
    return;
  }

  // User is authenticated, proceed with app
  console.log('User is authenticated');
}

// Example 4: Manual token management
export function tokenExample() {
  // Set token after receiving it from login callback
  const token = 'your-access-token-here';
  apiClient.setAccessToken(token);

  // Clear token on logout
  apiClient.clearAccessToken();
}

// Example 5: Error handling
export async function errorHandlingExample() {
  try {
    const webhooks = await api.webhook.getAllWebhooks();
    return webhooks;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status: number; data?: { message: string } }; message?: string };
    if (axiosError.response?.status === 401) {
      // Handle authentication error
      console.log('User not authenticated, redirecting to login');
      api.auth.loginWithDiscord();
    } else if (axiosError.response?.status === 403) {
      // Handle authorization error
      console.log('User not authorized for this action');
    } else {
      // Handle other errors
      console.error('API Error:', axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}