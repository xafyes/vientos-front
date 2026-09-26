import { Calendar, X } from 'lucide-react';
import { env } from '../../config/env';
import { useGoSection } from '../../hooks/useGoSection';
import { useUi } from '../../hooks/useUi';
import './Header.css';

const MENU_LINKS = [
  { n: '01', label: 'Hospedajes', id: 'hospedajes' },
  { n: '02', label: 'Cuartos', id: 'cuartos' },
  { n: '03', label: 'Contacto', id: 'contacto' },
];

export function Header() {
  const { menuOpen, toggleMenu, closeMenu, openBooking, openGallery } = useUi();
  const goSection = useGoSection();

  function handleSection(id: string) {
    closeMenu();
    goSection(id);
  }

  return (
    <header className="header">
      <div className="header__bar">
        <nav className="header__nav">
          <button className="header__link" onClick={() => handleSection('hospedajes')}>
            Hospedajes
          </button>
          <button className="header__link" onClick={() => handleSection('cuartos')}>
            Cuartos
          </button>
        </nav>

        <button className="header__brand" onClick={() => handleSection('inicio')}>
          <span className="header__brand-title">Vientos &amp; La Yareta</span>
          <span className="header__brand-sub">SAN PEDRO DE ATACAMA</span>
        </button>

        <nav className="header__nav header__nav--end">
          <button className="header__link" onClick={() => openGallery('vientos')}>
            Galería
          </button>
          <button className="header__link" onClick={() => handleSection('contacto')}>
            Contacto
          </button>
        </nav>

        <div className="header__actions">
          <button className="btn header__cta" onClick={() => openBooking('vientos')}>
            <Calendar size={15} />
            <span>Reservar</span>
          </button>
          <button className="header__burger" aria-label="Menú" onClick={toggleMenu}>
            <span className="header__burger-bar" />
            <span className="header__burger-bar" />
            <span className="header__burger-bar" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="header__mobile">
          <div className="header__mobile-top">
            <span className="header__brand-title" style={{ color: '#f6f1e8' }}>
              Vientos &amp; La Yareta
            </span>
            <button className="header__mobile-close" aria-label="Cerrar" onClick={closeMenu}>
              <X size={17} />
            </button>
          </div>
          <div className="header__mobile-links">
            {MENU_LINKS.map((link) => (
              <button key={link.id} className="header__mobile-link" onClick={() => handleSection(link.id)}>
                {link.label}
              </button>
            ))}
            <button className="btn btn-solid header__mobile-cta" onClick={() => openBooking('vientos')}>
              Reservar
            </button>
          </div>
          <div className="header__mobile-contact">
            Ayllu de Quitor, San Pedro de Atacama
            {(env.contactEmail || env.contactPhone) && (
              <>
                <br />
                {[env.contactEmail, env.contactPhone].filter(Boolean).join(' · ')}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
