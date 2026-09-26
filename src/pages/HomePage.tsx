import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ContactSection } from '../components/home/ContactSection';
import { Hero } from '../components/home/Hero';
import { Intro } from '../components/home/Intro';
import { LodgesSection } from '../components/home/LodgesSection';
import { RoomsSection } from '../components/home/RoomsSection';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
    // Runs once per navigation to this page with a hash present.
  }, []);

  return (
    <>
      <Hero />
      <Intro />
      <LodgesSection />
      <RoomsSection />
      <ContactSection />
    </>
  );
}
