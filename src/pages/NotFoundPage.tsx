import { useSiteNav } from '../hooks/useSiteNav';

export function NotFoundPage() {
  const { goSection } = useSiteNav();

  return (
    <div style={{ minHeight: '70vh', background: '#F6F1E8', padding: 'calc(96px + clamp(40px, 8vw, 90px)) 20px 80px', textAlign: 'center' }}>
      <span style={{ fontFamily: "'Italianno', cursive", fontSize: '50px', color: '#9C7C3C', lineHeight: '.8', display: 'block' }}>perdido en el desierto</span>
      <h1 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(28px, 3.4vw, 50px)', lineHeight: '1.08', margin: '14px 0 26px', color: '#21403E' }}>Esta página no existe</h1>
      <button className="hb5" onClick={() => goSection('inicio')} style={{ background: '#21403E', color: '#F6F1E8', border: 'none', padding: '15px 30px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease' }}>Volver al inicio</button>
    </div>
  );
}
