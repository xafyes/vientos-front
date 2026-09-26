import { storageRepository } from '../services';
import { type AsyncState, useAsync } from './useAsync';

async function loadHeroImages(): Promise<string[]> {
  const [vientos, yareta] = await Promise.all([
    storageRepository.listAreaImages('vientos'),
    storageRepository.listAreaImages('yareta'),
  ]);

  // Interleave so the slideshow doesn't show one lodge for too long in a row.
  const merged: string[] = [];
  const max = Math.max(vientos.length, yareta.length);
  for (let i = 0; i < max; i++) {
    if (vientos[i]) merged.push(vientos[i]);
    if (yareta[i]) merged.push(yareta[i]);
  }
  return merged;
}

/** Rotating hero images sourced from both lodges' "Areas comunes" folders. */
export function useHeroImages(): AsyncState<string[]> {
  return useAsync(loadHeroImages, []);
}
