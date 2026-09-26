import { normalizeKey } from './text';

/** URL-safe id for a room, derived from its Storage folder name. */
export function toSlug(folder: string): string {
  return normalizeKey(folder).replace(/\s+/g, '-');
}
