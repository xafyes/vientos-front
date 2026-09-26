import { useState } from 'react';
import { LODGE_IDS, LODGES, type LodgeId } from '../../content/lodges';
import { roomsOf } from '../../content/rooms';
import { useRoomCovers } from '../../hooks/usePhotos';
import { useSiteNav } from '../../hooks/useSiteNav';
import { capShort, minPrice, money } from '../../lib/format';
import { Icon } from '../Icon';

export function Cuartos() {
  const { openBooking, openRoom } = useSiteNav();
  const [tab, setTab] = useState<LodgeId>('vientos');
  const [slide, setSlide] = useState(0);
  const coverOf = useRoomCovers(tab);

  const list = roomsOf(tab);
  const n = list.length;
  const i = ((slide % n) + n) % n;
  const car = list[i];
  const par = i % 2 === 0 ? 'a' : 'b';
  const pad = (k: number) => String(k).padStart(2, '0');

  const pickTab = (lodge: LodgeId) => {
    setTab(lodge);
    setSlide(0);
  };

  return (
    <section id="cuartos" style={{ scrollMarginTop: '84px', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(66px, 9vw, 112px) clamp(20px, 5vw, 48px)' }}>
      <div data-reveal="1" style={{ textAlign: 'center', marginBottom: '42px' }}>
        <span style={{ fontFamily: "'Italianno', cursive", fontSize: '50px', color: '#9C7C3C', lineHeight: '.8', display: 'block' }}>cada habitación es diferente</span>
        <h2 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(28px, 3.4vw, 50px)', lineHeight: '1.08', margin: '14px 0 0', color: '#21403E' }}>Nuestros cuartos</h2>
        <div style={{ display: 'inline-flex', gap: '26px', marginTop: '22px' }}>
          {LODGE_IDS.map((lodge) => (
            <button key={lodge} onClick={() => pickTab(lodge)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '7px 0', fontSize: '10.5px', letterSpacing: '.24em', textTransform: 'uppercase', color: tab === lodge ? '#21403E' : '#93A09B', borderBottom: `1px solid ${tab === lodge ? '#9C7C3C' : 'transparent'}`, transition: 'color .4s ease, border-color .4s ease' }}>{LODGES[lodge].name}</button>
          ))}
        </div>
      </div>
      <div data-r="window" data-reveal="1" style={{ display: 'grid', gridTemplateColumns: '1.08fr .92fr', gap: 'clamp(28px, 4vw, 60px)', alignItems: 'center' }}>

        <div style={{ position: 'relative', padding: '14px' }}>
          <div style={{ position: 'absolute', inset: '0', border: '1px solid rgba(156,124,60,.45)', borderRadius: '999px 999px 4px 4px / 42% 42% 4px 4px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', inset: '5px', border: '1px solid rgba(156,124,60,.22)', borderRadius: '999px 999px 3px 3px / 42% 42% 3px 3px', pointerEvents: 'none' }}></div>
          <span style={{ position: 'absolute', left: '50%', top: '-6px', transform: 'translateX(-50%) rotate(45deg)', width: '11px', height: '11px', background: '#F6F1E8', border: '1px solid rgba(156,124,60,.5)' }}></span>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '999px 999px 2px 2px / 44% 44% 2px 2px', height: 'clamp(340px, 42vw, 560px)', background: '#E7E0D3' }}>
            <div key={car.id} role="img" aria-label={car.name} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${coverOf(car.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center', animation: `vsp-windin-${par} 1.05s cubic-bezier(.22,.8,.2,1) both` }}></div>
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(20,38,36,.24) 0%, rgba(20,38,36,0) 34%, rgba(20,38,36,.42) 100%)', pointerEvents: 'none' }}></div>
            <button className="hq1" onClick={() => setSlide(i - 1 + n)} aria-label="Anterior" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(246,241,232,.5)', background: 'rgba(20,38,36,.3)', backdropFilter: 'blur(6px)', color: '#F6F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .4s ease, transform .4s ease' }}>
              <Icon name="arrow-left" size={15} />
            </button>
            <button className="hq2" onClick={() => setSlide(i + 1)} aria-label="Siguiente" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(246,241,232,.5)', background: 'rgba(20,38,36,.3)', backdropFilter: 'blur(6px)', color: '#F6F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .4s ease, transform .4s ease' }}>
              <Icon name="arrow-right" size={15} />
            </button>
            <span style={{ position: 'absolute', left: '50%', bottom: '16px', transform: 'translateX(-50%)', fontFamily: "'Gloock', serif", fontSize: '13px', letterSpacing: '.12em', color: '#F6F1E8', opacity: '.85' }}>{pad(i + 1)} / {pad(n)}</span>
          </div>
        </div>

        <div style={{ minWidth: '0' }}>
          <div key={car.id} style={{ animation: `vsp-windtext-${par} .8s cubic-bezier(.22,.8,.2,1) .12s both` }}>
            <h3 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(30px, 3.6vw, 52px)', lineHeight: '1.04', margin: '0 0 14px', color: '#21403E' }}>{car.name}</h3>
            <p style={{ margin: '0 0 20px', fontSize: '16px', lineHeight: '1.8', fontWeight: '300', color: '#5A6864', maxWidth: '44ch' }}>{car.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '22px' }}>
              <span style={{ border: '1px solid rgba(33,64,62,.2)', borderRadius: '999px', padding: '7px 14px', fontSize: '11.5px', color: '#4C5C58' }}>{capShort(car.cap)}</span>
              <span style={{ border: '1px solid rgba(33,64,62,.2)', borderRadius: '999px', padding: '7px 14px', fontSize: '11.5px', color: '#4C5C58' }}>{car.bed}</span>
              <span style={{ border: '1px solid rgba(33,64,62,.2)', borderRadius: '999px', padding: '7px 14px', fontSize: '11.5px', color: '#4C5C58' }}>{car.bath}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '22px', flexWrap: 'wrap', borderTop: '1px solid rgba(33,64,62,.16)', paddingTop: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>{car.tiers.length > 1 ? 'Desde' : `${car.tiers[0][0]} personas`}</span>
                <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: '#21403E', lineHeight: '1.15' }}>{money(minPrice(car.tiers))}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                <button className="hq3" onClick={() => openRoom(car.id)} style={{ background: 'none', border: '1px solid rgba(33,64,62,.28)', borderRadius: '12px', color: '#21403E', padding: '14px 22px', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease, border-color .4s ease' }}>Ver detalle</button>
                <button className="hq4" onClick={() => openBooking({ lodge: car.lodge, room: car.id })} style={{ background: '#21403E', border: 'none', borderRadius: '12px', color: '#F6F1E8', padding: '14px 24px', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease' }}>Reservar</button>
              </div>
            </div>
          </div>
          <div data-rail="1" style={{ display: 'flex', gap: '20px', marginTop: '26px', overflowX: 'auto', paddingBottom: '8px' }}>
            {list.map((r, k) => (
              <button key={r.id} onClick={() => setSlide(k)} style={{ flex: '0 0 auto', background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: k === i ? '#21403E' : '#9AA7A2', borderBottom: `1px solid ${k === i ? '#9C7C3C' : 'transparent'}`, transition: 'color .4s ease, border-color .4s ease' }}>{r.name}</button>
            ))}
          </div>
        </div>
      </div>
      <p style={{ margin: '26px 0 0', textAlign: 'center', fontSize: '12.5px', color: '#7D8B86' }}>Valores por noche en pesos chilenos, desayuno incluido.</p>
    </section>
  );
}
