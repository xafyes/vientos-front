export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Abstraction every consumer depends on (Dependency Inversion) instead of
 * calling `fetch` directly. This is the single, protected entry point for
 * all outbound HTTP calls the frontend makes to our own API handlers:
 * it owns timeouts, aborts, JSON handling and error normalization so no
 * component or hook has to duplicate that logic or forget it.
 */
export interface HttpClient {
  request<T>(path: string, options?: HttpRequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(path: string, body: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T>;
}
