import type { LodgeId } from './lodges';

export interface AreaPhoto {
  lodge: LodgeId;
  file: string;
  caption: string;
}

/**
 * Files known to exist in each bucket's "Areas comunes" folder. They are
 * addressed by public URL, which needs no listing permission, so the hero,
 * lodge cards and gallery always have images; the gallery adds any other
 * file it can list on top of these.
 */
export const AREA_PHOTOS: readonly AreaPhoto[] = [
  { lodge: 'yareta', file: 'patio central.jpeg', caption: 'Patio central, La Yareta' },
  { lodge: 'vientos', file: 'comedor principal.jpeg', caption: 'Comedor principal, Vientos' },
  { lodge: 'yareta', file: 'patio.jpeg', caption: 'Patio, La Yareta' },
  { lodge: 'vientos', file: 'Casa Sorbac1.JPG', caption: 'La casa, Vientos' },
  { lodge: 'yareta', file: 'cafeteria salon.jpeg', caption: 'Cafetería y salón, La Yareta' },
  { lodge: 'vientos', file: 'comedor principal 3.jpeg', caption: 'Comedor principal, Vientos' },
  { lodge: 'yareta', file: 'patio central 2.jpeg', caption: 'Patio central, La Yareta' },
  { lodge: 'vientos', file: 'deco.jpeg', caption: 'Detalles, Vientos' },
  { lodge: 'yareta', file: 'cafeteria salon 2.jpeg', caption: 'Cafetería y salón, La Yareta' },
  { lodge: 'vientos', file: 'cocina new.jpeg', caption: 'Cocina, Vientos' },
];

export const HERO_PHOTOS = AREA_PHOTOS.slice(0, 6);

/** Signature photo per lodge (lodge cards, fallback for rooms without photos). */
export const LODGE_PHOTO: Record<LodgeId, AreaPhoto> = {
  vientos: AREA_PHOTOS[3],
  yareta: AREA_PHOTOS[0],
};

export const CONTACT_PHOTO = AREA_PHOTOS[4];
