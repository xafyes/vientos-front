import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useHeroImages } from '../../hooks/useHeroImages';
import { useUi } from '../../hooks/useUi';
import type { LodgeId } from '../../types/domain';
import './Hero.css';

const SLIDE_DURATION_MS = 6500;

export function Hero() {
  const { data: images } = useHeroImages();
  const [active, setActive] = useState(0);
  const { openBooking } = useUi();

  const [lodgeId, setLodgeId] = useState<LodgeId>('vientos');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [images]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    openBooking(lodgeId, undefined, { checkIn, checkOut, guests });
  }

  return (
    <section id="inicio" className="hero">
      {(images ?? []).map((src, i) => (
        <div key={src} className={`hero__slide ${i === active ? 'hero__slide--active' : ''}`}>
          <div className="hero__slide-img" style={{ backgroundImage: `url("${src}")` }} role="img" aria-label="" />
        </div>
      ))}
      <div className="hero__scrim" />

      <div className="hero__content">
        <span className="eyebrow">Ayllu de Quitor · Atacama</span>
        <h1 className="hero__title">Dormir donde</h1>
        <h1 className="hero__title">el viento</h1>
        <span className="hero__script">se queda</span>
        <p className="hero__lede">
          Hospedaje en el Oasis de San Pedro de Atacama, a 3 km del centro histórico.
        </p>
      </div>

      <div className="hero__bar-wrap">
        <form className="hero__bar" onSubmit={handleSubmit}>
          <label className="hero__field">
            <span className="hero__field-label">Hospedaje</span>
            <select value={lodgeId} onChange={(e) => setLodgeId(e.target.value as LodgeId)}>
              <option value="vientos">Vientos</option>
              <option value="yareta">La Yareta</option>
            </select>
          </label>
          <label className="hero__field">
            <span className="hero__field-label">Llegada</span>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label className="hero__field">
            <span className="hero__field-label">Salida</span>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </label>
          <label className="hero__field" style={{ borderRight: 'none' }}>
            <span className="hero__field-label">Huéspedes</span>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={1}>1 huésped</option>
              <option value={2}>2 huéspedes</option>
              <option value={3}>3 huéspedes</option>
              <option value={4}>4 huéspedes</option>
            </select>
          </label>
          <button type="submit" className="btn btn-solid hero__submit">
            Reservar
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
