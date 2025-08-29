import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base URL from the integration guide
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: AxiosError) => void; config: InternalAxiosRequestConfig }> = [];

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
          console.log('Access token refreshed via x-access-token header');
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and it's not the refresh request itself
        if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh') {
          if (this.isRefreshing) {
            // If a refresh is already in progress, queue the failed request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshResponse = await this.client.post('/auth/refresh');
            const newAccessToken = refreshResponse.data.data.accessToken || refreshResponse.headers['x-access-token'];

            if (!newAccessToken) {
              throw new Error('New access token not found in refresh response');
            }
            
            this.setAccessToken(newAccessToken);
            this.isRefreshing = false;
            this.processQueue(null, newAccessToken); // Process queued requests

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.processQueue(refreshError as AxiosError); // Cast to AxiosError
            this.clearAccessToken(); // Clear token if refresh fails
            console.error('Authentication failed. Please login again.', refreshError);
            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login'; // Redirect to login page
            }
            return Promise.reject(refreshError);
          }
        }

        // If 401 on refresh request itself, or other errors
        if (error.response?.status === 401 && originalRequest.url === '/auth/refresh') {
          this.clearAccessToken();
          console.error('Refresh token invalid or expired. Redirecting to login.');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
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
        prom.resolve(this.client(prom.config)); // Retry the original request
      }
    });
    this.failedQueue = [];
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  clearAccessToken() {
    this.accessToken = null;
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

export default apiClient;