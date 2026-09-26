import { useState } from 'react';
import { env } from '../../config/env';
import { FAQS } from '../../content/faq';
import { CONTACT_PHOTO } from '../../content/media';
import { areaPhotoUrl } from '../../hooks/usePhotos';
import { useSiteNav } from '../../hooks/useSiteNav';
import { Icon } from '../Icon';

const contactRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '13px', fontSize: '15px', color: '#3A4B47', padding: '14px 0', borderBottom: '1px solid rgba(33,64,62,.16)' };

export function Hola() {
  const { openBooking } = useSiteNav();
  const [open, setOpen] = useState(0);

  return (
    <section id="hola" style={{ scrollMarginTop: '84px', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(66px, 9vw, 108px) clamp(20px, 5vw, 48px)' }}>
      <div data-r="two" data-reveal="1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'start' }}>
        <div>
          <span style={{ fontFamily: "'Italianno', cursive", fontSize: '50px', color: '#9C7C3C', lineHeight: '.8', display: 'block' }}>antes de venir</span>
          <h2 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(28px, 3.4vw, 50px)', lineHeight: '1.08', margin: '14px 0 22px', color: '#21403E' }}>Preguntas frecuentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(33,64,62,.16)' }}>
            {FAQS.map((q, i) => {
              const isOpen = open === i;
              return (
                <div key={q.q} style={{ borderBottom: '1px solid rgba(33,64,62,.16)' }}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '17px 0', display: 'flex', alignItems: 'baseline', gap: '16px', textAlign: 'left' }}>
                    <span style={{ fontFamily: "'Gloock', serif", fontSize: 'clamp(18px, 1.8vw, 23px)', color: isOpen ? '#9C7C3C' : '#21403E', flex: '1', transition: 'color .4s ease' }}>{q.q}</span>
                    <span style={{ color: '#9C7C3C', flex: '0 0 auto', transform: `rotate(${isOpen ? 45 : 0}deg)`, transition: 'transform .45s cubic-bezier(.2,.7,.2,1)' }}><Icon name="plus" size={17} /></span>
                  </button>
                  <div style={{ overflow: 'hidden', maxHeight: isOpen ? '280px' : '0px', opacity: isOpen ? 1 : 0, transition: 'max-height .55s cubic-bezier(.2,.7,.2,1), opacity .45s ease' }}>
                    <p style={{ margin: '0 0 18px', maxWidth: '54ch', fontSize: '15px', lineHeight: '1.75', fontWeight: '300', color: '#4C5C58' }}>{q.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div role="img" aria-label={CONTACT_PHOTO.caption} style={{ height: 'clamp(240px, 28vw, 340px)', backgroundColor: '#EDE7DB', backgroundImage: `url("${areaPhotoUrl(CONTACT_PHOTO)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '26px', borderTop: '1px solid rgba(33,64,62,.16)' }}>
            <span style={contactRow}><Icon name="map-pin" size={16} />Ayllu de Quitor, San Pedro de Atacama</span>
            {env.contactEmail && <span style={contactRow}><Icon name="mail" size={16} />{env.contactEmail}</span>}
            {env.contactPhone && <span style={contactRow}><Icon name="phone" size={16} />{env.contactPhone}</span>}
          </div>
          <button className="hf1" onClick={() => openBooking()} style={{ marginTop: '26px', display: 'flex', alignItems: 'center', gap: '13px', background: '#21403E', color: '#F6F1E8', border: 'none', padding: '17px 30px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease, gap .4s ease' }}>
            Reservar
            <Icon name="arrow-right" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
