import type { SupabaseClient } from '@supabase/supabase-js';
import { LODGES } from '../../content/lodges';
import type { LodgeId } from '../../types/domain';
import type { StorageRepository } from './StorageRepository';

const AREAS_PREFIX = 'Areas comunes';
const ROOMS_PREFIX = 'Habitaciones';
const IMAGE_EXTENSION = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Supabase Storage-backed implementation of StorageRepository.
 *
 * Bucket layout (as configured by the hotel's Supabase project):
 *   <bucket>/Areas comunes/<image>.jpg
 *   <bucket>/Habitaciones/<Room Name>/<image>.jpg
 *
 * Both buckets are public, so listing objects and building public URLs
 * with the anon key is the intended, safe use of that key — it grants no
 * write access and no access to anything outside these buckets.
 */
export class SupabaseStorageRepository implements StorageRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async listAreaImages(lodgeId: LodgeId): Promise<string[]> {
    return this.listImagesAt(lodgeId, AREAS_PREFIX);
  }

  async listRoomFolders(lodgeId: LodgeId): Promise<string[]> {
    const bucket = LODGES[lodgeId].bucket;
    const { data, error } = await this.client.storage.from(bucket).list(ROOMS_PREFIX, {
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;
    return (data ?? [])
      .filter((entry) => entry.id === null) // folders report a null id; files don't
      .map((entry) => entry.name);
  }

  async listRoomImages(lodgeId: LodgeId, folder: string): Promise<string[]> {
    return this.listImagesAt(lodgeId, `${ROOMS_PREFIX}/${folder}`);
  }

  private async listImagesAt(lodgeId: LodgeId, path: string): Promise<string[]> {
    const bucket = LODGES[lodgeId].bucket;
    const { data, error } = await this.client.storage.from(bucket).list(path, {
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;

    return (data ?? [])
      .filter((entry) => entry.id !== null && IMAGE_EXTENSION.test(entry.name))
      .map((entry) => this.client.storage.from(bucket).getPublicUrl(`${path}/${entry.name}`).data.publicUrl);
  }
}
