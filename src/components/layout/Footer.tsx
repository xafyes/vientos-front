import { useSiteNav } from '../../hooks/useSiteNav';

const link: React.CSSProperties = { color: '#9DAAA4', fontSize: '10.5px', letterSpacing: '.2em', textTransform: 'uppercase' };

export function Footer() {
  const { sectionLink, openGallery } = useSiteNav();

  return (
    <footer style={{ background: '#21403E', padding: '48px clamp(20px, 5vw, 48px) 40px', textAlign: 'center' }}>
      <img src="/img/logo-crema.png" alt="Vientos de San Pedro" style={{ height: '34px', width: 'auto', opacity: '.9' }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
        <a className="hf2" href="/#casas" onClick={sectionLink('casas')} style={link}>Hospedajes</a>
        <a className="hf3" href="/#cuartos" onClick={sectionLink('cuartos')} style={link}>Cuartos</a>
        <button className="hf4" onClick={openGallery} style={{ ...link, background: 'none', border: 'none', padding: '0', cursor: 'pointer', transition: 'color .4s ease' }}>Galería</button>
        <a className="hf5" href="/#hola" onClick={sectionLink('hola')} style={link}>Contacto</a>
      </div>
      <p style={{ margin: '26px 0 0', fontSize: '11.5px', color: '#6F7D78' }}>© {new Date().getFullYear()} Vientos &amp; La Yareta · Quitor, Atacama · Check-in 14:00 / Check-out 11:00</p>
    </footer>
  );
}
