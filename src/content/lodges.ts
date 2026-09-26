import { env } from '../config/env';
import type { LodgeId, LodgeInfo } from '../types/domain';

export const LODGES: Record<LodgeId, LodgeInfo> = {
  vientos: {
    id: 'vientos',
    bucket: env.supabaseBucketVientos,
    name: 'Vientos',
    fullName: 'Hospedaje Vientos',
    tagline: 'La casa del patio · 6 cuartos',
    description:
      'Cuartos matrimoniales alrededor de un patio central, a pasos del jardín y la cafetería-salón.',
  },
  yareta: {
    id: 'yareta',
    bucket: env.supabaseBucketYareta,
    name: 'La Yareta',
    fullName: 'Hospedaje La Yareta',
    tagline: 'Caña y barro · 12 cuartos',
    description:
      'Doce unidades entre murales y columnas talladas, con un corredor central y patios propios.',
  },
};

export const LODGE_LIST = Object.values(LODGES);
