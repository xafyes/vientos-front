/** The two properties (hotels) sharing one brand and one booking flow. */
export type LodgeId = 'vientos' | 'yareta';

export interface LodgeInfo {
  id: LodgeId;
  bucket: string;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
}

/** One price tier: from `guests` people, the nightly rate in CLP. */
export type PriceTier = readonly [guests: number, clpPerNight: number];

/** Editorial content for a room that Supabase Storage cannot provide. */
export interface RoomContent {
  description: string;
  bed: string;
  bath: string;
  capacity: number;
  tiers: readonly PriceTier[];
}

/** A room folder as it exists in the bucket, with its content merged in. */
export interface Room {
  id: string;
  lodgeId: LodgeId;
  /** Exact folder name in Supabase Storage, e.g. "Desert Library". */
  folder: string;
  name: string;
  description: string;
  bed: string;
  bath: string;
  capacity: number;
  tiers: readonly PriceTier[];
  /** Public URL of the first image found in the room's folder, if any. */
  coverImage: string | null;
}

export interface RoomWithGallery extends Room {
  gallery: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BookingFormValues {
  lodgeId: LodgeId;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  acceptedTerms: boolean;
  /** Honeypot field, must stay empty; filled bots get silently rejected. */
  company: string;
}

export interface BookingRequestPayload {
  lodgeId: LodgeId;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  company: string;
}

export interface BookingConfirmation {
  code: string;
  /** Recomputed server-side from checkIn/checkOut — never trust the client's figure. */
  nights: number;
}
