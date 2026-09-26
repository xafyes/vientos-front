import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Casas, Intro } from '../components/home/Casas';
import { Cuartos } from '../components/home/Cuartos';
import { Hero } from '../components/home/Hero';
import { Hola } from '../components/home/Hola';
import { useReveal } from '../hooks/useReveal';

export function HomePage() {
  const { hash } = useLocation();
  useReveal();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) window.setTimeout(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }), 120);
  }, [hash]);

  return (
    <>
      <Hero />
      <Intro />
      <Casas />
      <Cuartos />
      <Hola />
    </>
  );
}
