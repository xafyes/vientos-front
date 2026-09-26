import { useGoSection } from '../../hooks/useGoSection';
import { useUi } from '../../hooks/useUi';
import './Footer.css';

export function Footer() {
  const goSection = useGoSection();
  const { openGallery } = useUi();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__brand">Vientos &amp; La Yareta</span>
      <div className="footer__links">
        <button className="footer__link" onClick={() => goSection('hospedajes')}>
          Hospedajes
        </button>
        <button className="footer__link" onClick={() => goSection('cuartos')}>
          Cuartos
        </button>
        <button className="footer__link" onClick={() => openGallery('vientos')}>
          Galería
        </button>
        <button className="footer__link" onClick={() => goSection('contacto')}>
          Contacto
        </button>
      </div>
      <p className="footer__meta">
        © {year} Vientos &amp; La Yareta · Ayllu de Quitor, San Pedro de Atacama · Check-in 14:00 / Check-out 11:00
      </p>
    </footer>
  );
}
