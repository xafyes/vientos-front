import { contentForRoom } from '../content/rooms';
import { toSlug } from '../lib/slug';
import { storageRepository } from '../services';
import type { LodgeId, Room } from '../types/domain';
import { type AsyncState, useAsync } from './useAsync';

async function loadRooms(lodgeId: LodgeId): Promise<Room[]> {
  const folders = await storageRepository.listRoomFolders(lodgeId);

  return Promise.all(
    folders.map(async (folder): Promise<Room> => {
      const content = contentForRoom(folder);
      const images = await storageRepository.listRoomImages(lodgeId, folder).catch(() => []);
      return {
        id: `${lodgeId}-${toSlug(folder)}`,
        lodgeId,
        folder,
        name: folder,
        coverImage: images[0] ?? null,
        ...content,
      };
    }),
  );
}

/** Room list for one lodge: folder names from Storage, merged with editorial content. */
export function useRooms(lodgeId: LodgeId): AsyncState<Room[]> {
  return useAsync(() => loadRooms(lodgeId), [lodgeId]);
}
