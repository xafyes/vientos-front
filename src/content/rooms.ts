import { normalizeKey } from '../lib/text';
import type { RoomContent } from '../types/domain';

/**
 * Editorial content for each room, keyed by normalized room name.
 *
 * The room LIST ITSELF is never hardcoded here — it always comes from the
 * Supabase Storage folder listing (see services/storage), so a folder added
 * or removed in the bucket shows up on the site automatically. This map only
 * supplies the description/beds/baths/price copy that Storage cannot hold;
 * a folder with no matching entry falls back to DEFAULT_ROOM_CONTENT.
 */
const ROOM_CONTENT: Record<string, RoomContent> = {
  // Vientos
  ara: {
    description: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 60000], [3, 75000]],
  },
  mallku: {
    description: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 60000], [3, 75000]],
  },
  jota: {
    description: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 60000], [3, 75000]],
  },
  solercio: {
    description: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 60000], [3, 75000]],
  },
  chacha: {
    description: 'Cuarto privado en versión twin o dos camas singles.',
    bed: 'Twin o 2 singles',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[2, 50000]],
  },
  'desert library': {
    description: 'Casa rodante con cama matrimonial, entre los algarrobos.',
    bed: 'Matrimonial',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[2, 45000]],
  },

  // La Yareta
  loft: {
    description: 'Cuarto estudio con mezzanina, cama superking y una single.',
    bed: 'Superking + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 130000], [3, 145000]],
  },
  nana: {
    description: 'Cuarto con cama queen, entre muros de barro pulido.',
    bed: 'Queen',
    bath: 'Baño privado',
    capacity: 2,
    tiers: [[2, 95000]],
  },
  tulor: {
    description: 'Cama king más una single, para dos o tres personas.',
    bed: 'King + single',
    bath: 'Baño privado',
    capacity: 3,
    tiers: [[2, 90000], [3, 115000]],
  },
  coyo: {
    description: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial',
    bath: 'Baño privado',
    capacity: 2,
    tiers: [[2, 85000]],
  },
  yaye: {
    description: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial',
    bath: 'Baño privado',
    capacity: 2,
    tiers: [[2, 85000]],
  },
  better: {
    description: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial',
    bath: 'Baño privado',
    capacity: 2,
    tiers: [[2, 85000]],
  },
  quitor: {
    description: 'Cama matrimonial y camarote, para hasta cuatro personas.',
    bed: 'Matrimonial + camarote',
    bath: 'Baño privado exterior',
    capacity: 4,
    tiers: [[1, 40000], [2, 70000], [3, 95000], [4, 110000]],
  },
  solor: {
    description: 'Cama king más una single, o tres camas individuales.',
    bed: 'King + single',
    bath: 'Baño privado exterior',
    capacity: 3,
    tiers: [[1, 40000], [2, 70000], [3, 95000]],
  },
  solcor: {
    description: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[1, 40000], [2, 60000]],
  },
  larache: {
    description: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[1, 40000], [2, 60000]],
  },
  sequitor: {
    description: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[1, 40000], [2, 60000]],
  },
  poconche: {
    description: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas',
    bath: 'Baño compartido',
    capacity: 2,
    tiers: [[1, 40000], [2, 60000]],
  },
};

const DEFAULT_ROOM_CONTENT: RoomContent = {
  description: 'Cuarto privado en Vientos & La Yareta, San Pedro de Atacama.',
  bed: 'Consultar',
  bath: 'Consultar',
  capacity: 2,
  tiers: [[2, 60000]],
};

export function contentForRoom(folderName: string): RoomContent {
  return ROOM_CONTENT[normalizeKey(folderName)] ?? DEFAULT_ROOM_CONTENT;
}
