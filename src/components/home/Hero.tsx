import { useEffect, useState } from 'react';
import type { LodgeId } from '../../content/lodges';
import { HERO_PHOTOS } from '../../content/media';
import { areaPhotoUrl } from '../../hooks/usePhotos';
import { useSiteNav } from '../../hooks/useSiteNav';
import { Icon } from '../Icon';

const SLIDES = HERO_PHOTOS.map((p) => ({ bg: `url("${areaPhotoUrl(p)}")`, alt: p.caption }));

export function Hero() {
  const { openBooking } = useSiteNav();
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ lodge: 'vientos' as LodgeId, checkIn: '', checkOut: '', guests: '2' });

  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(t);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const book = () =>
    openBooking({ lodge: form.lodge, checkIn: form.checkIn, checkOut: form.checkOut, guests: Number(form.guests) });

  return (
    <section id="inicio" style={{ position: 'relative', height: '100vh', minHeight: '620px', overflow: 'hidden', background: '#21403E' }}>
      {SLIDES.map((sl, i) => (
        <div key={sl.bg} style={{ position: 'absolute', inset: '0', opacity: slide === i ? 1 : 0, transition: 'opacity 1.8s cubic-bezier(.4,0,.2,1)' }}>
          <div role="img" aria-label={sl.alt} style={{ position: 'absolute', inset: '0', backgroundImage: sl.bg, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'vsp-ken 16s linear both' }}></div>
        </div>
      ))}
      <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(176deg, rgba(20,38,36,.7) 0%, rgba(20,38,36,.4) 26%, rgba(20,38,36,.66) 62%, rgba(20,38,36,.94) 100%)' }}></div>
      <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 62% 48% at 50% 44%, rgba(20,38,36,.6) 0%, rgba(20,38,36,.34) 55%, rgba(20,38,36,0) 100%)' }}></div>

      <div style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '116px 20px 200px' }}>
        <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
          <p style={{ margin: '0', fontSize: '10.5px', letterSpacing: '.4em', textTransform: 'uppercase', color: '#E4D3A8', animation: 'vsp-rise 1.1s cubic-bezier(.2,.8,.2,1) .4s both' }}>Ayllu de Quitor · Atacama</p>
        </div>
        <h1 style={{ margin: '0', maxWidth: '100%' }}>
          <span style={{ display: 'block', overflow: 'hidden' }}><span style={{ display: 'block', whiteSpace: 'nowrap', fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(34px, 6.2vw, 96px)', lineHeight: '1.06', color: '#F6F1E8', animation: 'vsp-rise 1.25s cubic-bezier(.2,.8,.2,1) .55s both' }}>Dormir donde</span></span>
          <span style={{ display: 'block', overflow: 'hidden' }}><span style={{ display: 'block', whiteSpace: 'nowrap', fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(34px, 6.2vw, 96px)', lineHeight: '1.06', color: '#F6F1E8', animation: 'vsp-rise 1.25s cubic-bezier(.2,.8,.2,1) .72s both' }}>el viento</span></span>
        </h1>
        <span style={{ display: 'block', fontFamily: "'Italianno', cursive", fontSize: 'clamp(50px, 7.6vw, 112px)', lineHeight: '.85', color: '#E4D3A8', marginTop: '-4px', animation: 'vsp-fade 1.6s ease 1.15s both' }}>se queda</span>
        <p style={{ margin: '22px 0 0', maxWidth: '42ch', fontSize: '15.5px', fontWeight: '300', lineHeight: '1.7', color: '#DCD5C7', animation: 'vsp-fade 1.6s ease 1.45s both' }}>Hospedaje en el Oasis de San Pedro de Atacama, a 3 km del centro histórico.</p>
      </div>

      <div data-r="cue" style={{ position: 'absolute', left: '50%', bottom: '132px', transform: 'translateX(-50%)', color: '#E4D3A8', animation: 'vsp-cue 2.6s ease-in-out infinite', pointerEvents: 'none' }}>
        <span style={{ width: '34px', height: '34px', border: '1px solid rgba(228,211,168,.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-down" size={13} />
        </span>
      </div>

      <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0', padding: '0 20px 24px', display: 'flex', justifyContent: 'center' }}>
        <div data-r="bar" style={{ background: 'rgba(246,241,232,.97)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto', alignItems: 'stretch', boxShadow: '0 26px 60px -26px rgba(0,0,0,.7)', maxWidth: '1000px', width: '100%', animation: 'vsp-up 1.2s cubic-bezier(.2,.8,.2,1) 1.6s both' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px 18px', borderRight: '1px solid rgba(33,64,62,.14)', minWidth: '0', justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>HOSPEDAJE</span>
            <select value={form.lodge} onChange={set('lodge')} style={{ border: 'none', background: 'none', padding: '0', fontSize: '15.5px', color: '#21403E', appearance: 'none', width: '100%', fontFamily: "'Gloock', serif" }}>
              <option value="vientos">Vientos</option>
              <option value="yareta">La Yareta</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px 18px', borderRight: '1px solid rgba(33,64,62,.14)', minWidth: '0', justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>Llegada</span>
            <input type="date" value={form.checkIn} onChange={set('checkIn')} style={{ border: 'none', background: 'none', padding: '0', fontSize: '14px', color: '#21403E', width: '100%' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px 18px', borderRight: '1px solid rgba(33,64,62,.14)', minWidth: '0', justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>Salida</span>
            <input type="date" value={form.checkOut} onChange={set('checkOut')} style={{ border: 'none', background: 'none', padding: '0', fontSize: '14px', color: '#21403E', width: '100%' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px 18px', borderRight: '1px solid rgba(33,64,62,.14)', minWidth: '0', justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>Huéspedes</span>
            <select value={form.guests} onChange={set('guests')} style={{ border: 'none', background: 'none', padding: '0', fontSize: '14px', color: '#21403E', appearance: 'none', width: '100%' }}>
              <option value="1">1 huésped</option>
              <option value="2">2 huéspedes</option>
              <option value="3">3 huéspedes</option>
              <option value="4">4 huéspedes</option>
            </select>
          </label>
          <button className="hr1" onClick={book} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#21403E', color: '#F6F1E8', border: 'none', padding: '18px 32px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '16px', margin: '6px', transition: 'background .4s ease, gap .4s ease' }}>
            Reservar
            <Icon name="arrow-right" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
