import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

/** Smoothly scrolls to a home-page section id, navigating home first if needed. */
export function useGoSection(): (id: string) => void {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (id: string) => {
      if (location.pathname !== '/') {
        navigate('/');
        window.setTimeout(() => scrollToId(id), 80);
      } else {
        scrollToId(id);
      }
    },
    [location.pathname, navigate],
  );
}
