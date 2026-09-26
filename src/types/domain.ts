import type { LodgeId } from '../content/lodges';

export type ArrivalWindow = '14-17' | '17-20' | '20-23' | 'late';
export type PaymentMethod = 'transfer' | 'arrival';

export interface BookingRequestPayload {
  lodgeId: LodgeId;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  arrival: ArrivalWindow;
  paymentMethod: PaymentMethod;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  /** Honeypot: must stay empty. */
  company: string;
}

export interface BookingConfirmation {
  code: string;
  nights: number;
}
