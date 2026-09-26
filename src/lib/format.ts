const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatClp(amount: number): string {
  return clpFormatter.format(amount);
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—';
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000;
  return diff > 0 ? Math.round(diff) : 0;
}

/** Nightly rate for the highest tier whose `guests` does not exceed the party size. */
export function priceForGuests(tiers: readonly (readonly [number, number])[], guests: number): number {
  const applicable = tiers.filter(([min]) => guests >= min);
  const tier = applicable.length > 0 ? applicable[applicable.length - 1] : tiers[0];
  return tier[1];
}

export function minPrice(tiers: readonly (readonly [number, number])[]): number {
  return Math.min(...tiers.map(([, price]) => price));
}
