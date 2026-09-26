import type { LodgeId } from '../../types/domain';

/**
 * Abstraction over "where room and area photos live". Components and hooks
 * depend on this interface, never on the Supabase SDK directly — swapping
 * the image host later (a different bucket layout, a CDN, a mock for tests)
 * only means writing a new implementation.
 */
export interface StorageRepository {
  /** Public URLs of every image directly inside "Areas comunes" for a lodge. */
  listAreaImages(lodgeId: LodgeId): Promise<string[]>;

  /** Room folder names as they exist under "Habitaciones" for a lodge. */
  listRoomFolders(lodgeId: LodgeId): Promise<string[]>;

  /** Public URLs of every image inside one room's folder. */
  listRoomImages(lodgeId: LodgeId, folder: string): Promise<string[]>;
}
