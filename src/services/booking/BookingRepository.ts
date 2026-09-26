import type { BookingConfirmation, BookingRequestPayload } from '../../types/domain';

/** Abstraction over "submit a booking request". Never call fetch/HttpClient from a component directly. */
export interface BookingRepository {
  submit(payload: BookingRequestPayload): Promise<BookingConfirmation>;
}
