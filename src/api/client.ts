import axios, { AxiosInstance, AxiosError } from 'axios';

// Create Axios instance with configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://web-production-c72b1.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Increased for ML processing
  // Performance optimizations
  decompress: true,
  maxRedirects: 3,
  validateStatus: (status) => status < 500,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Short-circuit requests when offline to avoid long timeouts
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator && !navigator.onLine) {
      const offlineError: any = new Error('Offline');
      offlineError.code = 'OFFLINE';
      offlineError.config = config;
      return Promise.reject(offlineError);
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      requestData: error.config?.data,
      responseData: error.response?.data,
    });

    // Normalize offline errors
    // @ts-expect-error code may be attached dynamically
    if (error.code === 'OFFLINE' || (typeof window !== 'undefined' && navigator && !navigator.onLine)) {
      return Promise.reject({
        code: 'OFFLINE',
        message: 'Offline',
        url: error.config?.url,
      });
    }

    // Never throw non-JSON errors, return a structured error instead
    if (error.response?.data && typeof error.response.data === 'object') {
      return Promise.reject(error);
    }

    // For non-JSON errors, create a structured error response
    const structuredError = {
      message: error.message || 'Network error',
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Unknown error',
      url: error.config?.url || 'Unknown URL',
    };

    return Promise.reject(structuredError);
  }
);

export default apiClient;
