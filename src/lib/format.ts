import type { PriceTier, Room } from '../content/rooms';

export function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

export function fmtDate(iso: string): string {
  if (!iso) return '—';
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000;
  return diff > 0 ? Math.round(diff) : 0;
}

/** Exact tier for the party size, else the next larger tier, else the largest. */
export function priceFor(room: Room | undefined, guests: number): number {
  if (!room) return 0;
  const exact = room.tiers.find(([g]) => g === guests);
  if (exact) return exact[1];
  const above = [...room.tiers].filter(([g]) => g >= guests).sort((a, b) => a[0] - b[0])[0];
  return above ? above[1] : room.tiers[room.tiers.length - 1][1];
}

export function minPrice(tiers: readonly PriceTier[]): number {
  return Math.min(...tiers.map(([, p]) => p));
}

export function capShort(cap: number): string {
  return cap === 1 ? '1 persona' : `hasta ${cap}`;
}

export function guestsLabel(n: number): string {
  return `${n} ${n === 1 ? 'huésped' : 'huéspedes'}`;
}
