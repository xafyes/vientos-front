/** Normalized error shape for every failed request, regardless of cause. */
export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }
}
