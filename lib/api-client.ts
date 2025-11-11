/**
 * API Client for North API
 * Handles all HTTP requests to the internal microservice
 */

const NORTH_API_URL = process.env.NORTH_API_URL;

if (!NORTH_API_URL) {
  throw new Error(
    'NORTH_API_URL is not defined in environment variables. Please check your .env.local file.'
  );
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${NORTH_API_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: 'no-store', // Ensure fresh data for admin operations
      });

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204) {
        return null as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors or JSON parsing errors
      throw new ApiError(
        `Failed to connect to North API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  },

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  },

  async post<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  },

  async put<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  },

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  },
};

export default apiClient;
