import type { SupabaseClient } from '@supabase/supabase-js';
import { LODGES, type LodgeId } from '../../content/lodges';
import type { StorageRepository } from './StorageRepository';

const AREAS_PREFIX = 'Areas comunes';
const ROOMS_PREFIX = 'Habitaciones';
const IMAGE_EXTENSION = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Supabase Storage implementation. Layout per bucket:
 *   <bucket>/Areas comunes/<image>
 *   <bucket>/Habitaciones/<Room folder>/<image>
 *
 * Listings are cached per folder for the page's lifetime, so several
 * components asking for the same room's photos cost one request.
 */
export class SupabaseStorageRepository implements StorageRepository {
  private readonly client: SupabaseClient;
  private readonly cache = new Map<string, Promise<string[]>>();
  private warned = false;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  publicUrl(lodgeId: LodgeId, path: string): string {
    return this.client.storage.from(LODGES[lodgeId].bucket).getPublicUrl(path).data.publicUrl;
  }

  listAreaImages(lodgeId: LodgeId): Promise<string[]> {
    return this.listImagesAt(lodgeId, AREAS_PREFIX);
  }

  listRoomImages(lodgeId: LodgeId, folder: string): Promise<string[]> {
    return this.listImagesAt(lodgeId, `${ROOMS_PREFIX}/${folder}`);
  }

  private listImagesAt(lodgeId: LodgeId, path: string): Promise<string[]> {
    const key = `${lodgeId}/${path}`;
    let pending = this.cache.get(key);
    if (!pending) {
      pending = this.fetchImages(lodgeId, path);
      pending.catch(() => this.cache.delete(key));
      this.cache.set(key, pending);
    }
    return pending;
  }

  private async fetchImages(lodgeId: LodgeId, path: string): Promise<string[]> {
    const { data, error } = await this.client.storage
      .from(LODGES[lodgeId].bucket)
      .list(path, { sortBy: { column: 'name', order: 'asc' } });
    if (error) throw error;

    const files = (data ?? []).filter((entry) => entry.id !== null && IMAGE_EXTENSION.test(entry.name));
    if (files.length === 0) this.warnListingBlocked(lodgeId, path);
    return files.map((entry) => this.publicUrl(lodgeId, `${path}/${entry.name}`));
  }

  // Supabase returns an empty list (not an error) when storage.objects has no
  // SELECT policy for anon; public buckets only allow direct downloads.
  private warnListingBlocked(lodgeId: LodgeId, path: string) {
    if (this.warned) return;
    this.warned = true;
    console.warn(
      `[storage] "${LODGES[lodgeId].bucket}/${path}" listed no images. If the folder does have photos, ` +
        'run supabase/storage-policy.sql so the public buckets can be listed.',
    );
  }
}
