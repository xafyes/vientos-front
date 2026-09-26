import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LodgeId } from '../types/domain';

interface BookingPrefill {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface BookingTarget extends BookingPrefill {
  lodgeId: LodgeId;
  roomId?: string;
}

interface UiContextValue {
  booking: BookingTarget | null;
  openBooking: (lodgeId: LodgeId, roomId?: string, prefill?: BookingPrefill) => void;
  closeBooking: () => void;
  galleryLodge: LodgeId | null;
  openGallery: (lodgeId: LodgeId) => void;
  closeGallery: () => void;
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

/** Global overlay state (booking modal, gallery modal, mobile menu), kept above the router. */
export function UiProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingTarget | null>(null);
  const [galleryLodge, setGalleryLodge] = useState<LodgeId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const value = useMemo<UiContextValue>(
    () => ({
      booking,
      openBooking: (lodgeId, roomId, prefill) => {
        setBooking({ lodgeId, roomId, ...prefill });
        setMenuOpen(false);
      },
      closeBooking: () => setBooking(null),
      galleryLodge,
      openGallery: (lodgeId) => {
        setGalleryLodge(lodgeId);
        setMenuOpen(false);
      },
      closeGallery: () => setGalleryLodge(null),
      menuOpen,
      toggleMenu: () => setMenuOpen((prev) => !prev),
      closeMenu: () => setMenuOpen(false),
    }),
    [booking, galleryLodge, menuOpen],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
