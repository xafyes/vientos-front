export interface BookingRequestBody {
  lodgeId: 'vientos' | 'yareta';
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  /** Honeypot: must arrive empty. A filled value means a bot filled every field. */
  company: string;
}

export type ValidationResult =
  | { valid: true; data: BookingRequestBody; nights: number }
  | { valid: false; message: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_SHORT_LEN = 120;
const MAX_NOTES_LEN = 1000;

function isNonEmptyString(value: unknown, maxLen: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000;
  return Math.round(diff);
}

/** Server-side validation — the frontend's checks are UX, this is the actual boundary. */
export function validateBookingRequest(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, message: 'Cuerpo de la solicitud inválido.' };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.company === 'string' && b.company.trim().length > 0) {
    return { valid: false, message: 'Solicitud inválida.' };
  }

  if (b.lodgeId !== 'vientos' && b.lodgeId !== 'yareta') {
    return { valid: false, message: 'Hospedaje inválido.' };
  }
  if (!isNonEmptyString(b.roomId, MAX_SHORT_LEN)) return { valid: false, message: 'Falta el cuarto elegido.' };
  if (!isNonEmptyString(b.roomName, MAX_SHORT_LEN)) return { valid: false, message: 'Falta el cuarto elegido.' };

  if (typeof b.checkIn !== 'string' || !ISO_DATE_RE.test(b.checkIn)) {
    return { valid: false, message: 'Fecha de llegada inválida.' };
  }
  if (typeof b.checkOut !== 'string' || !ISO_DATE_RE.test(b.checkOut)) {
    return { valid: false, message: 'Fecha de salida inválida.' };
  }
  const nights = nightsBetween(b.checkIn, b.checkOut);
  if (!Number.isFinite(nights) || nights < 1 || nights > 60) {
    return { valid: false, message: 'El rango de fechas no es válido.' };
  }

  const guests = Number(b.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
    return { valid: false, message: 'Número de huéspedes inválido.' };
  }

  if (!isNonEmptyString(b.firstName, MAX_SHORT_LEN)) return { valid: false, message: 'Falta tu nombre.' };
  if (!isNonEmptyString(b.lastName, MAX_SHORT_LEN)) return { valid: false, message: 'Falta tu apellido.' };
  if (typeof b.email !== 'string' || !EMAIL_RE.test(b.email) || b.email.length > MAX_SHORT_LEN) {
    return { valid: false, message: 'Correo inválido.' };
  }
  if (!isNonEmptyString(b.phone, 40)) return { valid: false, message: 'Falta un teléfono de contacto.' };

  const notes = typeof b.notes === 'string' ? b.notes : '';
  if (notes.length > MAX_NOTES_LEN) return { valid: false, message: 'El comentario es demasiado largo.' };

  return {
    valid: true,
    nights,
    data: {
      lodgeId: b.lodgeId,
      roomId: b.roomId.trim(),
      roomName: b.roomName.trim(),
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests,
      firstName: b.firstName.trim(),
      lastName: b.lastName.trim(),
      email: b.email.trim(),
      phone: b.phone.trim(),
      notes: notes.trim(),
      company: '',
    },
  };
}
