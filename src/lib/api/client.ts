import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base URL from the integration guide
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for httpOnly refresh token cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Check for new access token in headers (token refresh)
        const newAccessToken = response.headers['x-access-token'];
        if (newAccessToken) {
          this.setAccessToken(newAccessToken);
          console.log('Access token refreshed');
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          this.clearAccessToken();
          // You can emit an event here or use a callback to handle logout
          console.error('Authentication failed. Please login again.');
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    // Store in localStorage for persistence across page reloads
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearAccessToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  // Initialize token from localStorage on app start
  initializeToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.accessToken = token;
      }
    }
  }

  // Expose axios methods
  get<T = unknown>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  post<T = unknown>(url: string, data = {}, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  put<T = unknown>(url: string, data = {}, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  delete<T = unknown>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }

  // Discord login redirect
  redirectToDiscordLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = `${BASE_URL}/auth/discord`;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Initialize token on import (client-side only)
if (typeof window !== 'undefined') {
  apiClient.initializeToken();
}

export default apiClient;