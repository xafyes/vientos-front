import type { HttpClient } from '../http/HttpClient';
import type { BookingConfirmation, BookingRequestPayload } from '../../types/domain';
import type { BookingRepository } from './BookingRepository';

/**
 * Sends booking requests to our own protected API handler (Azure Functions,
 * under /api/booking) rather than to Supabase or any third party directly.
 * That handler is the one place secrets (e.g. an email/CRM API key) live,
 * and the one place that validates input server-side — the frontend never
 * has to be trusted for that.
 */
export class ApiBookingRepository implements BookingRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  submit(payload: BookingRequestPayload): Promise<BookingConfirmation> {
    return this.http.post<BookingConfirmation>('/booking', payload);
  }
}
