import { LODGE_IDS, LODGES, type LodgeId } from '../content/lodges';
import { AREA_PHOTOS, LODGE_PHOTO, type AreaPhoto } from '../content/media';
import { roomsOf, type Room } from '../content/rooms';
import { storageRepository } from '../services';
import { useAsync } from './useAsync';

export function areaPhotoUrl(photo: AreaPhoto): string {
  return storageRepository.publicUrl(photo.lodge, `Areas comunes/${photo.file}`);
}

export function lodgePhotoUrl(lodge: LodgeId): string {
  return areaPhotoUrl(LODGE_PHOTO[lodge]);
}

async function roomPhotos(room: Room): Promise<string[]> {
  if (!room.folder) return [];
  return storageRepository.listRoomImages(room.lodge, room.folder).catch(() => []);
}

/** A room's photos; falls back to its lodge's signature photo so no frame is ever empty. */
export function useRoomPhotos(room: Room | undefined): string[] {
  const { data } = useAsync(() => (room ? roomPhotos(room) : Promise.resolve([])), [room?.id]);
  if (!room) return [];
  return data && data.length > 0 ? data : [lodgePhotoUrl(room.lodge)];
}

/** Cover photo lookup for every room in a lodge (lodge photo until/unless one is found). */
export function useRoomCovers(lodge: LodgeId): (roomId: string) => string {
  const { data } = useAsync(async () => {
    const rooms = roomsOf(lodge);
    const photos = await Promise.all(rooms.map(roomPhotos));
    return new Map(rooms.map((r, i) => [r.id, photos[i][0]]));
  }, [lodge]);
  const fallback = lodgePhotoUrl(lodge);
  return (roomId) => data?.get(roomId) ?? fallback;
}

export interface GalleryPhoto {
  src: string;
  caption: string;
}

function captionFromFile(file: string, lodge: LodgeId): string {
  const base = file
    .replace(/\.[^.]+$/, '')
    .replace(/pricnipal/i, 'principal')
    .replace(/\b(new|\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base || /^[0-9a-f-]{12,}/i.test(base)) return LODGES[lodge].name;
  return `${base.charAt(0).toUpperCase()}${base.slice(1)}, ${LODGES[lodge].name}`;
}

async function loadGallery(): Promise<GalleryPhoto[]> {
  const curated = AREA_PHOTOS.map((p) => ({ src: areaPhotoUrl(p), caption: p.caption }));
  const listed = await Promise.all(
    LODGE_IDS.map(async (lodge) => {
      const urls = await storageRepository.listAreaImages(lodge).catch(() => []);
      return urls.map((src) => ({ src, caption: captionFromFile(decodeURIComponent(src.split('/').pop() ?? ''), lodge) }));
    }),
  );
  const seen = new Set(curated.map((p) => p.src));
  return [...curated, ...listed.flat().filter((p) => !seen.has(p.src))];
}

/** Curated area photos plus anything else the buckets list. */
export function useGalleryPhotos(): GalleryPhoto[] {
  const { data } = useAsync(loadGallery, []);
  return data ?? AREA_PHOTOS.map((p) => ({ src: areaPhotoUrl(p), caption: p.caption }));
}
