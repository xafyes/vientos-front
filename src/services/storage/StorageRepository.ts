import type { LodgeId } from '../../content/lodges';

/** Where lodge and room photos live. Components depend on this, never on the Supabase SDK. */
export interface StorageRepository {
  /** Public URL for a known file in a lodge's bucket; needs no listing permission. */
  publicUrl(lodgeId: LodgeId, path: string): string;

  /** Every image directly inside "Areas comunes". */
  listAreaImages(lodgeId: LodgeId): Promise<string[]>;

  /** Every image inside "Habitaciones/<folder>". */
  listRoomImages(lodgeId: LodgeId, folder: string): Promise<string[]>;
}
