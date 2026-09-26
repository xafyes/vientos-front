import { useState } from 'react';
import { nightsBetween } from '../lib/format';
import { bookingRepository } from '../services';
import type { BookingConfirmation, BookingFormValues, LodgeId, Room } from '../types/domain';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface BookingPrefill {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function emptyBookingForm(lodgeId: LodgeId, roomId = '', prefill: BookingPrefill = {}): BookingFormValues {
  return {
    lodgeId,
    roomId,
    checkIn: prefill.checkIn ?? '',
    checkOut: prefill.checkOut ?? '',
    guests: prefill.guests ?? 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    acceptedTerms: false,
    company: '', // honeypot
  };
}

function validate(values: BookingFormValues, room: Room | undefined): string | null {
  if (!room) return 'Elige un cuarto.';
  if (nightsBetween(values.checkIn, values.checkOut) < 1) return 'Elige fechas de llegada y salida válidas.';
  if (values.guests > room.capacity) return `${room.name} recibe hasta ${room.capacity} huéspedes.`;
  if (!values.firstName.trim() || !values.lastName.trim()) return 'Falta tu nombre y apellido.';
  if (!EMAIL_RE.test(values.email)) return 'Revisa el correo.';
  if (!values.phone.trim()) return 'Necesitamos un teléfono de contacto.';
  if (!values.acceptedTerms) return 'Debes aceptar la política de cancelación.';
  return null;
}

export type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseBookingFormResult {
  values: BookingFormValues;
  setField: <K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) => void;
  status: BookingStatus;
  errorMessage: string | null;
  confirmation: BookingConfirmation | null;
  submit: (room: Room | undefined) => Promise<void>;
  reset: (lodgeId: LodgeId, roomId?: string, prefill?: BookingPrefill) => void;
}

/** Owns booking form state, client-side validation, and the submit call — kept out of UI components. */
export function useBookingForm(
  initialLodgeId: LodgeId,
  initialRoomId = '',
  initialPrefill: BookingPrefill = {},
): UseBookingFormResult {
  const [values, setValues] = useState<BookingFormValues>(
    emptyBookingForm(initialLodgeId, initialRoomId, initialPrefill),
  );
  const [status, setStatus] = useState<BookingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  function setField<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(room: Room | undefined) {
    if (values.company) return; // honeypot tripped: silently drop, no feedback to the bot

    const validationError = validate(values, room);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    if (!room) return;

    setStatus('submitting');
    setErrorMessage(null);
    try {
      const result = await bookingRepository.submit({
        lodgeId: values.lodgeId,
        roomId: values.roomId,
        roomName: room.name,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        nights: nightsBetween(values.checkIn, values.checkOut),
        guests: values.guests,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        notes: values.notes.trim(),
        company: values.company,
      });
      setConfirmation(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos enviar tu reserva.');
    }
  }

  function reset(lodgeId: LodgeId, roomId = '', prefill: BookingPrefill = {}) {
    setValues(emptyBookingForm(lodgeId, roomId, prefill));
    setStatus('idle');
    setErrorMessage(null);
    setConfirmation(null);
  }

  return { values, setField, status, errorMessage, confirmation, submit, reset };
}
