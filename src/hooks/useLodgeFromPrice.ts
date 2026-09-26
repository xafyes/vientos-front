import { contentForRoom } from '../content/rooms';
import { minPrice } from '../lib/format';
import { storageRepository } from '../services';
import type { LodgeId } from '../types/domain';
import { type AsyncState, useAsync } from './useAsync';

async function loadFromPrice(lodgeId: LodgeId): Promise<number> {
  const folders = await storageRepository.listRoomFolders(lodgeId);
  const prices = folders.map((folder) => minPrice(contentForRoom(folder).tiers));
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/** Cheapest nightly rate across a lodge's rooms, without fetching every room's photos. */
export function useLodgeFromPrice(lodgeId: LodgeId): AsyncState<number> {
  return useAsync(() => loadFromPrice(lodgeId), [lodgeId]);
}
