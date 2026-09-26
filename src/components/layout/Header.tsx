import { Fragment, useState } from 'react';
import { env } from '../../config/env';
import { useScrolled } from '../../hooks/useScrolled';
import { useSiteNav } from '../../hooks/useSiteNav';
import { Icon } from '../Icon';

const MENU = [
  { id: 'casas', label: 'Hospedajes', n: '01' },
  { id: 'cuartos', label: 'Cuartos', n: '02' },
  { id: 'galeria', label: 'Galería', n: '03' },
  { id: 'hola', label: 'Contacto', n: '04' },
];

export function Header() {
  const { isHome, sectionLink, openBooking, openGallery } = useSiteNav();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const solid = scrolled || !isHome;
  const navBgA = solid ? 'rgba(24,45,43,.97)' : 'transparent';
  const navBlur = scrolled ? 'blur(14px)' : 'none';
  const navPad = scrolled ? '12px clamp(20px, 5vw, 48px)' : '22px clamp(20px, 5vw, 48px)';
  const toggleMenu = () => setMenuOpen((o) => !o);
  const contact = [env.contactEmail, env.contactPhone].filter(Boolean).join(' · ');

  const menuLinks = MENU.map((m) => ({
    ...m,
    href: m.id === 'galeria' ? '/galeria' : `/#${m.id}`,
    go: (e: React.MouseEvent) => {
      setMenuOpen(false);
      if (m.id === 'galeria') {
        e.preventDefault();
        openGallery();
      } else {
        sectionLink(m.id)(e);
      }
    },
  }));

  const book = () => {
    setMenuOpen(false);
    openBooking();
  };

  return (
    <header style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '70', background: navBgA, backdropFilter: navBlur, transition: 'background .6s ease' }}>
      <div data-r="navbar" style={{ maxWidth: '1400px', margin: '0 auto', padding: navPad, display: 'flex', alignItems: 'center', gap: '24px', transition: 'padding .5s cubic-bezier(.2,.7,.2,1)', minWidth: '0', position: 'relative' }}>
        <nav data-r="nav-desktop" style={{ display: 'flex', gap: '18px', alignItems: 'center', flex: '1' }}>
          <a className="hh1" href="/#casas" onClick={sectionLink('casas')} style={{ color: '#EAE3D6', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Hospedajes</a>
          <a className="hh2" href="/#cuartos" onClick={sectionLink('cuartos')} style={{ color: '#EAE3D6', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Cuartos</a>
        </nav>
        <a data-r="navcenter" href="/#inicio" onClick={sectionLink('inicio')} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <img src="/img/logo-crema.png" alt="Vientos de San Pedro" style={{ height: '26px', width: 'auto' }} />
          <span style={{ fontSize: '8.5px', letterSpacing: '.4em', color: '#C6BFAE', textIndent: '.4em' }}>VIENTOS &amp; LA YARETA</span>
        </a>
        <nav data-r="nav-desktop" style={{ display: 'flex', gap: '18px', alignItems: 'center', flex: '1', justifyContent: 'flex-end' }}>
          <button className="hh3" onClick={openGallery} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#EAE3D6', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color .4s ease' }}>Galería</button>
          <a className="hh4" href="/#hola" onClick={sectionLink('hola')} style={{ color: '#EAE3D6', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Contacto</a>
        </nav>
        <div data-r="burger" style={{ marginLeft: 'auto', alignItems: 'center', gap: '9px', flex: '0 0 auto' }}>
          <button className="hh5" onClick={book} data-r="cta-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#9C7C3C', color: '#FFF8EE', border: 'none', padding: '12px 20px', fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Icon name="calendar" size={15} />
            <span data-r="cta-label">Reservar</span>
          </button>
          <button className="hh6" onClick={toggleMenu} aria-label="Menú" aria-expanded={menuOpen} style={{ width: '44px', height: '44px', flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'rgba(246,241,232,.14)', border: 'none', cursor: 'pointer' }}>
            <span style={{ display: 'block', width: '17px', height: '1px', background: '#F6F1E8', transition: 'transform .4s ease', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}></span>
            <span style={{ display: 'block', width: '17px', height: '1px', background: '#F6F1E8', transition: 'opacity .3s ease', opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ display: 'block', width: '17px', height: '1px', background: '#F6F1E8', transition: 'transform .4s ease', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}></span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ position: 'fixed', inset: '0', background: '#21403E', animation: 'vsp-fade .4s ease both', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px, 5vw, 48px)' }}>
            <img src="/img/logo-crema.png" alt="" style={{ height: '24px', width: 'auto' }} />
            <button className="hh7" onClick={toggleMenu} aria-label="Cerrar" style={{ width: '44px', height: '44px', background: 'none', border: '1px solid rgba(246,241,232,.34)', color: '#F6F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .3s ease' }}>
              <Icon name="x" size={17} />
            </button>
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px clamp(20px, 5vw, 48px) 40px', gap: '4px' }}>
            {menuLinks.map((m) => (
              <Fragment key={m.id}>
                <a className="hh8" href={m.href} onClick={m.go} style={{ display: 'flex', alignItems: 'baseline', gap: '18px', padding: '12px 0', fontFamily: "'Gloock', serif", fontSize: 'clamp(30px, 8vw, 54px)', lineHeight: '1.1', color: '#F6F1E8' }}>
                  <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '10px', letterSpacing: '.22em', color: '#9C7C3C' }}>{m.n}</span>{m.label}
                </a>
              </Fragment>
            ))}
            <button className="hh9" onClick={book} style={{ alignSelf: 'flex-start', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '12px', background: '#9C7C3C', color: '#F6F1E8', border: 'none', borderRadius: '14px', padding: '16px 30px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer' }}>Reservar<Icon name="arrow-right" size={14} /></button>
          </div>
          <div style={{ padding: '0 clamp(20px, 5vw, 48px) 32px', fontSize: '12.5px', color: '#9DAAA4', lineHeight: '1.7' }}>
            Ayllu de Quitor, San Pedro de Atacama
            {contact && (<><br />{contact}</>)}
          </div>
        </div>
      )}
    </header>
  );
}
