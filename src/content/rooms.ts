import type { LodgeId } from './lodges';

/** Minimum guests for the tier, and the nightly rate in CLP. */
export type PriceTier = readonly [guests: number, clp: number];

export interface Room {
  id: string;
  lodge: LodgeId;
  name: string;
  /** Folder under `<bucket>/Habitaciones/`; null when the room has no photos uploaded yet. */
  folder: string | null;
  desc: string;
  bed: string;
  bath: string;
  cap: number;
  units: number;
  tiers: readonly PriceTier[];
}

/** Tarifario 2026. Breakfast included in every rate. */
export const ROOMS: readonly Room[] = [
  { id: 'v-ara', lodge: 'vientos', name: 'Ara', folder: 'Ara', units: 1,
    desc: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single', bath: 'Baño privado', cap: 3, tiers: [[2, 60000], [3, 75000]] },
  { id: 'v-malku', lodge: 'vientos', name: 'Malku', folder: 'Mallku', units: 1,
    desc: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single', bath: 'Baño privado', cap: 3, tiers: [[2, 60000], [3, 75000]] },
  { id: 'v-jota', lodge: 'vientos', name: 'Jota', folder: 'Jota', units: 1,
    desc: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single', bath: 'Baño privado', cap: 3, tiers: [[2, 60000], [3, 75000]] },
  { id: 'v-solercio', lodge: 'vientos', name: 'Solercio', folder: 'Solercio', units: 1,
    desc: 'Cuarto matrimonial con cama king y una cama single.',
    bed: 'King + single', bath: 'Baño privado', cap: 3, tiers: [[2, 60000], [3, 75000]] },
  { id: 'v-chacha', lodge: 'vientos', name: 'Chacha', folder: 'Chacha', units: 1,
    desc: 'Cuarto privado con baño compartido, en versión twin o dos camas singles.',
    bed: 'Twin o 2 singles', bath: 'Baño compartido', cap: 2, tiers: [[2, 50000]] },
  { id: 'v-astro', lodge: 'vientos', name: 'Astro Camper', folder: null, units: 1,
    desc: 'Casa rodante en el jardín, para dormir mirando el cielo.',
    bed: 'Twin o 2 singles', bath: 'Baño compartido', cap: 2, tiers: [[2, 45000]] },
  { id: 'v-desert', lodge: 'vientos', name: 'Desert Library', folder: 'Desert Library', units: 1,
    desc: 'Casa rodante con cama matrimonial, entre los algarrobos.',
    bed: 'Matrimonial', bath: 'Baño compartido', cap: 2, tiers: [[2, 45000]] },

  { id: 'y-loft', lodge: 'yareta', name: 'Loft', folder: 'Loft', units: 1,
    desc: 'Cuarto estudio con mezzanina, cama superking y una single.',
    bed: 'Superking + single', bath: 'Baño privado', cap: 3, tiers: [[2, 130000], [3, 145000]] },
  { id: 'y-nana', lodge: 'yareta', name: 'Ñaña', folder: 'Nana', units: 1,
    desc: 'Cuarto con cama queen, entre muros de barro pulido.',
    bed: 'Queen', bath: 'Baño privado', cap: 2, tiers: [[2, 95000]] },
  { id: 'y-tulor', lodge: 'yareta', name: 'Tulor', folder: 'Tulor', units: 1,
    desc: 'Cama king más una single, para dos o tres personas.',
    bed: 'King + single', bath: 'Baño privado', cap: 3, tiers: [[2, 90000], [3, 115000]] },
  { id: 'y-coyo', lodge: 'yareta', name: 'Coyo', folder: 'Coyo', units: 1,
    desc: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial', bath: 'Baño privado', cap: 2, tiers: [[2, 85000]] },
  { id: 'y-yaye', lodge: 'yareta', name: 'Yaye', folder: 'Yaye', units: 1,
    desc: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial', bath: 'Baño privado', cap: 2, tiers: [[2, 85000]] },
  { id: 'y-beter', lodge: 'yareta', name: 'Beter', folder: 'Better', units: 1,
    desc: 'Cuarto con cama matrimonial y baño privado.',
    bed: 'Matrimonial', bath: 'Baño privado', cap: 2, tiers: [[2, 85000]] },
  { id: 'y-quitor', lodge: 'yareta', name: 'Quitor', folder: 'Quitor', units: 1,
    desc: 'Cama matrimonial y camarote, para hasta cuatro personas.',
    bed: 'Matrimonial + camarote', bath: 'Baño privado exterior', cap: 4,
    tiers: [[1, 40000], [2, 70000], [3, 95000], [4, 110000]] },
  { id: 'y-solor', lodge: 'yareta', name: 'Solor', folder: 'Solor', units: 1,
    desc: 'Cama king más una single, o tres camas individuales.',
    bed: 'King + single', bath: 'Baño privado exterior', cap: 3,
    tiers: [[1, 40000], [2, 70000], [3, 95000]] },
  { id: 'y-solcor', lodge: 'yareta', name: 'Solcor', folder: 'Solcor', units: 1,
    desc: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas', bath: 'Baño compartido', cap: 2, tiers: [[1, 40000], [2, 60000]] },
  { id: 'y-larache', lodge: 'yareta', name: 'Larache', folder: 'Larache', units: 1,
    desc: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas', bath: 'Baño compartido', cap: 2, tiers: [[1, 40000], [2, 60000]] },
  { id: 'y-sequitor', lodge: 'yareta', name: 'Sequitor', folder: 'Sequitor', units: 1,
    desc: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas', bath: 'Baño compartido', cap: 2, tiers: [[1, 40000], [2, 60000]] },
  { id: 'y-poconche', lodge: 'yareta', name: 'Poconche', folder: 'Poconche', units: 1,
    desc: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas', bath: 'Baño compartido', cap: 2, tiers: [[1, 40000], [2, 60000]] },
  { id: 'y-catarpe', lodge: 'yareta', name: 'Catarpe', folder: null, units: 1,
    desc: 'Cuarto privado para una o dos personas, con baño compartido.',
    bed: '1 o 2 camas', bath: 'Baño compartido', cap: 2, tiers: [[1, 45000], [2, 65000]] },
];

export function roomsOf(lodge: LodgeId): Room[] {
  return ROOMS.filter((r) => r.lodge === lodge);
}

export function findRoom(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
