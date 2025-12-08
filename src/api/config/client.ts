import { API_BASE_URL } from './constants';
import { tokenManager } from '../utils/tokenManager';
import { ApiError, handleApiError } from '../utils/errorHandler';

// Request configuration interface
export interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  skipContentType?: boolean;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * Base HTTP client with interceptors and error handling
 */
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get default headers
   */
  private getDefaultHeaders(skipContentType = false): HeadersInit {
    const headers: HeadersInit = {};

    if (!skipContentType) {
      headers['Content-Type'] = 'application/json';
    }

    const token = tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    // Try to parse JSON, but handle non-JSON responses
    let data: unknown;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      const text = await response.text();
      data = text || null;
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = 
        (data && typeof data === 'object' && 'message' in data)
          ? String((data as { message: unknown }).message)
          : `API error: ${response.status} ${response.statusText}`;

      throw new ApiError(
        response.status,
        response.statusText,
        errorMessage,
        data
      );
    }

    return data as T;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      skipContentType = false,
      headers = {},
      ...restConfig
    } = config;

    const url = `${this.baseURL}${path}`;
    const requestHeaders = skipAuth
      ? { ...(skipContentType ? {} : { 'Content-Type': 'application/json' }), ...headers }
      : { ...this.getDefaultHeaders(skipContentType), ...headers };

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      const data = await this.handleResponse<T>(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(path, {
      ...config,
      method: 'GET',
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(path, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(path, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(path, {
      ...config,
      method: 'DELETE',
    });
    return response.data;
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient(API_BASE_URL);

