import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LodgeId } from '../content/lodges';

export interface BookingParams {
  lodge?: LodgeId;
  room?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

/** Site-wide navigation: home sections, gallery, room pages and the booking flow. */
export function useSiteNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goSection = useCallback(
    (id: string) => {
      if (pathname === '/') {
        scrollToId(id);
      } else {
        navigate('/');
        window.setTimeout(() => scrollToId(id), 120);
      }
    },
    [pathname, navigate],
  );

  /** onClick for `<a href="#id">` links, so they also work from other pages. */
  const sectionLink = useCallback(
    (id: string) => (event: React.MouseEvent) => {
      event.preventDefault();
      goSection(id);
    },
    [goSection],
  );

  const openBooking = useCallback(
    (params: BookingParams = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, String(v));
      });
      navigate(`/reservar${query.size ? `?${query}` : ''}`);
      window.scrollTo(0, 0);
    },
    [navigate],
  );

  const openRoom = useCallback(
    (id: string) => {
      navigate(`/cuartos/${id}`);
      window.scrollTo(0, 0);
    },
    [navigate],
  );

  const openGallery = useCallback(() => {
    navigate('/galeria');
    window.scrollTo(0, 0);
  }, [navigate]);

  return { isHome: pathname === '/', goSection, sectionLink, openBooking, openRoom, openGallery };
}
