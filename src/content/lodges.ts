import { env } from '../config/env';

export type LodgeId = 'vientos' | 'yareta';

export interface Lodge {
  id: LodgeId;
  bucket: string;
  name: string;
  full: string;
  tagline: string;
}

export const LODGES: Record<LodgeId, Lodge> = {
  vientos: {
    id: 'vientos',
    bucket: env.supabaseBucketVientos,
    name: 'Vientos',
    full: 'Hospedaje Vientos',
    tagline: 'La casa del patio · 7 unidades',
  },
  yareta: {
    id: 'yareta',
    bucket: env.supabaseBucketYareta,
    name: 'La Yareta',
    full: 'Hospedaje La Yareta',
    tagline: 'Caña y barro · 13 unidades',
  },
};

export const LODGE_IDS: readonly LodgeId[] = ['vientos', 'yareta'];
