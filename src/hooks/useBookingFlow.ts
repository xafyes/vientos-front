import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LODGE_IDS, type LodgeId } from '../content/lodges';
import { findRoom, type Room } from '../content/rooms';
import { nightsBetween, priceFor } from '../lib/format';
import { bookingRepository } from '../services';
import type { ArrivalWindow, PaymentMethod } from '../types/domain';

export interface BookingForm {
  lodge: LodgeId;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  arrival: ArrivalWindow;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  terms: boolean;
  pay: PaymentMethod;
  company: string;
}

export type BookingStatus = 'idle' | 'sending' | 'done' | 'error';
export const STEP_LABELS = ['Cuarto', 'Fechas', 'Tus datos', 'Confirmar'] as const;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const today = () => new Date().toISOString().slice(0, 10);

function initialForm(params: URLSearchParams): BookingForm {
  const room = findRoom(params.get('room') ?? '');
  const lodgeParam = params.get('lodge') as LodgeId | null;
  const guests = Number(params.get('guests'));
  return {
    lodge: room?.lodge ?? (lodgeParam && LODGE_IDS.includes(lodgeParam) ? lodgeParam : 'vientos'),
    roomId: room?.id ?? '',
    checkIn: params.get('checkIn') ?? '',
    checkOut: params.get('checkOut') ?? '',
    guests: guests >= 1 && guests <= 4 ? guests : 2,
    arrival: '17-20',
    firstName: '', lastName: '', email: '', phone: '', notes: '',
    terms: false,
    pay: 'transfer',
    company: '',
  };
}

/** Why the given step cannot advance, or null when it can. Mirrors the design's checks. */
function stepError(step: number, form: BookingForm, room: Room | undefined): string | null {
  if (step === 1) return room ? null : 'Elige un cuarto.';
  if (step === 2) {
    if (nightsBetween(form.checkIn, form.checkOut) < 1) return 'Elige fechas de llegada y salida válidas.';
    if (form.checkIn < today()) return 'La llegada no puede ser en el pasado.';
    if (room && form.guests > room.cap) return `${room.name} recibe hasta ${room.cap} huéspedes.`;
    return null;
  }
  if (step === 3) {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Falta tu nombre y apellido.';
    if (!EMAIL_RE.test(form.email.trim())) return 'Revisa el correo.';
    if (!form.phone.trim()) return 'Necesitamos un teléfono de contacto.';
    if (!form.terms) return 'Debes aceptar la política de cancelación.';
  }
  return null;
}

/** Booking flow state machine: 4 steps, then sending → done | error. */
export function useBookingFlow() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<BookingForm>(() => initialForm(params));
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<BookingStatus>('idle');
  const [err, setErr] = useState('');
  const [code, setCode] = useState('');
  const [picking, setPicking] = useState(() => !form.roomId);

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [step, status]);

  const room = findRoom(form.roomId);
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const nightly = priceFor(room, form.guests);
  const total = nightly * (nights || 1);

  function set<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErr('');
  }

  function selectLodge(lodge: LodgeId) {
    setForm((f) => ({ ...f, lodge, roomId: f.lodge === lodge ? f.roomId : '' }));
    setErr('');
  }

  function selectRoom(r: Room) {
    setForm((f) => ({ ...f, lodge: r.lodge, roomId: r.id }));
    setPicking(false);
    setErr('');
  }

  async function submit() {
    if (!room) return;
    setStatus('sending');
    setErr('');
    try {
      const result = await bookingRepository.submit({
        lodgeId: room.lodge,
        roomId: room.id,
        roomName: room.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        guests: form.guests,
        arrival: form.arrival,
        paymentMethod: form.pay,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim(),
        company: form.company,
      });
      setCode(result.code);
      setStatus('done');
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'No pudimos enviar tu reserva.');
      setStatus('error');
    }
  }

  function next() {
    const problem = stepError(step, form, room);
    if (problem) return setErr(problem);
    if (step < 4) {
      setStep(step + 1);
      setErr('');
    } else if (!form.company) {
      void submit();
    }
  }

  return {
    form, set, step, status, err, code, room, nights, nightly, total,
    picking: picking || !room,
    startPicking: () => setPicking(true),
    selectLodge, selectRoom, next, submit,
    goStep: (n: number) => n < step && (setStep(n), setErr('')),
    back: () => (setStep(step - 1), setErr('')),
    restart: () => (setStatus('idle'), setStep(1), setPicking(true)),
  };
}
