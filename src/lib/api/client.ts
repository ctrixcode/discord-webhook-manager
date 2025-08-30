import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base URL from the integration guide
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: AxiosError) => void; config: InternalAxiosRequestConfig }> = [];

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  public setAccessToken(token: string | null) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response, // Success responses pass through
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and it's not the refresh request itself
        if (error.response?.status === 401 && originalRequest.url !== '/api/auth/refresh-token') {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshResponse = await fetch('/api/auth/refresh-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });

            if (!refreshResponse.ok) {
              throw new Error(`HTTP error! status: ${refreshResponse.status}`);
            }

            const { accessToken: newAccessToken } = await refreshResponse.json();

            if (!newAccessToken) {
              throw new Error('New access token not found in refresh response');
            }

            this.setAccessToken(newAccessToken);

            this.processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);

          } catch (refreshError) {
            this.processQueue(refreshError as AxiosError);
            this.clearAccessToken();
            console.error('Authentication failed. Please login again.', refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // If 401 on refresh request itself, or other errors
        // The new /api/auth/refresh-token endpoint handles the refresh token cookie directly.
        // If it returns 401, it means the refresh token is invalid/expired.
        if (error.response?.status === 401 && originalRequest.url === '/api/auth/refresh-token') {
          localStorage.removeItem('refreshToken'); // Clear refresh token from localStorage
          this.clearAccessToken();
          console.error('Refresh token invalid or expired.');
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: AxiosError | null, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        if (!prom.config.headers) {
          prom.config.headers = new AxiosHeaders();
        }
        prom.config.headers.set('Authorization', `Bearer ${token}`);
        prom.resolve(this.client(prom.config));
      }
    });
    this.failedQueue = [];
  }

  clearAccessToken() {
    this.setAccessToken(null);
  }

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

  redirectToDiscordLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = `${BASE_URL}/auth/discord`;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
