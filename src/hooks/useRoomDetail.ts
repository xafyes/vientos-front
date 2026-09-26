import { contentForRoom } from '../content/rooms';
import { toSlug } from '../lib/slug';
import { storageRepository } from '../services';
import type { LodgeId, RoomWithGallery } from '../types/domain';
import { type AsyncState, useAsync } from './useAsync';

async function loadRoomDetail(lodgeId: LodgeId, slug: string): Promise<RoomWithGallery> {
  const folders = await storageRepository.listRoomFolders(lodgeId);
  const folder = folders.find((name) => toSlug(name) === slug);
  if (!folder) throw new Error('No encontramos ese cuarto.');

  const gallery = await storageRepository.listRoomImages(lodgeId, folder);
  const content = contentForRoom(folder);

  return {
    id: `${lodgeId}-${slug}`,
    lodgeId,
    folder,
    name: folder,
    coverImage: gallery[0] ?? null,
    gallery,
    ...content,
  };
}

/** Full gallery + content for a single room, resolved by its URL slug. */
export function useRoomDetail(lodgeId: LodgeId, slug: string): AsyncState<RoomWithGallery> {
  return useAsync(() => loadRoomDetail(lodgeId, slug), [lodgeId, slug]);
}
