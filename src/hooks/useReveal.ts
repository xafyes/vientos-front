import { useEffect } from 'react';

/** Fades `[data-reveal]` elements in as they scroll into view, like the design. */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const show = (el: HTMLElement) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    if (!('IntersectionObserver' in window)) return;

    nodes.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 1s ease, transform 1.1s cubic-bezier(.2,.7,.2,1)';
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    nodes.forEach((el) => io.observe(el));
    // Safety net: never leave content hidden if the observer misses something.
    const fallback = window.setTimeout(() => nodes.forEach(show), 3500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}
