import { storageRepository } from '../services';
import type { LodgeId } from '../types/domain';
import { type AsyncState, useAsync } from './useAsync';

/** Images from "Areas comunes" for one lodge — used for the hero and gallery. */
export function useLodgeMedia(lodgeId: LodgeId): AsyncState<string[]> {
  return useAsync(() => storageRepository.listAreaImages(lodgeId), [lodgeId]);
}
