import { ApiError } from './ApiError';
import type { HttpClient, HttpRequestOptions } from './HttpClient';

const DEFAULT_TIMEOUT_MS = 10_000;

async function safeParseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function messageFromErrorBody(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body && typeof (body as { message: unknown }).message === 'string') {
    return (body as { message: string }).message;
  }
  return fallback;
}

/**
 * fetch()-backed implementation of HttpClient. Every request:
 *  - is bounded by a timeout (AbortController), so a stalled network never
 *    hangs the UI forever;
 *  - normalizes non-2xx responses and network failures into `ApiError`;
 *  - never leaks raw fetch/TypeError objects to callers.
 */
export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly defaultTimeoutMs: number;

  constructor(baseUrl: string, defaultTimeoutMs = DEFAULT_TIMEOUT_MS) {
    this.baseUrl = baseUrl;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers, timeoutMs = this.defaultTimeoutMs, signal } = options;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    if (signal) {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const parsed = await safeParseJson(response);

      if (!response.ok) {
        throw new ApiError(
          messageFromErrorBody(parsed, `La solicitud falló (${response.status}).`),
          response.status,
          parsed,
        );
      }

      return parsed as T;
    } catch (error) {
      if (ApiError.isApiError(error)) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('La solicitud tardó demasiado. Intenta nuevamente.', 0);
      }
      throw new ApiError('No pudimos conectar con el servidor. Revisa tu conexión.', 0, error);
    } finally {
      clearTimeout(timeout);
    }
  }

  get<T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }
}
