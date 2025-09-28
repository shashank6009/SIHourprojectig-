// TODO: Phase 2 - Add retry logic, error handling, and request/response interceptors

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export async function httpRequest<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const http = {
  get: <T>(url: string, headers?: Record<string, string>) =>
    httpRequest<T>(url, { method: 'GET', headers }),
  
  post: <T>(url: string, body: any, headers?: Record<string, string>) =>
    httpRequest<T>(url, { method: 'POST', headers, body }),
  
  put: <T>(url: string, body: any, headers?: Record<string, string>) =>
    httpRequest<T>(url, { method: 'PUT', headers, body }),
  
  delete: <T>(url: string, headers?: Record<string, string>) =>
    httpRequest<T>(url, { method: 'DELETE', headers }),
};
