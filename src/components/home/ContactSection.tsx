import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { env } from '../../config/env';
import { useLodgeMedia } from '../../hooks/useLodgeMedia';
import { useUi } from '../../hooks/useUi';
import { FaqSection } from './FaqSection';
import './ContactSection.css';

export function ContactSection() {
  const { data: images } = useLodgeMedia('yareta');
  const { openBooking } = useUi();
  const image = images?.find((_, i) => i === 1) ?? images?.[0];

  return (
    <section id="contacto" className="section container">
      <div className="contact">
        <FaqSection />
        <div>
          {image && (
            <div className="contact__image" style={{ backgroundImage: `url("${image}")` }} role="img" aria-label="Vientos & La Yareta" />
          )}
          <div className="contact__list">
            <span className="contact__row">
              <MapPin size={16} />
              Ayllu de Quitor, San Pedro de Atacama
            </span>
            {env.contactEmail && (
              <span className="contact__row">
                <Mail size={16} />
                {env.contactEmail}
              </span>
            )}
            {env.contactPhone && (
              <span className="contact__row">
                <Phone size={16} />
                {env.contactPhone}
              </span>
            )}
          </div>
          <button className="btn btn-solid contact__cta" onClick={() => openBooking('vientos')}>
            Reservar
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
