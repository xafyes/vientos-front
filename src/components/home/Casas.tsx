import { LODGES, type LodgeId } from '../../content/lodges';
import { roomsOf } from '../../content/rooms';
import { lodgePhotoUrl } from '../../hooks/usePhotos';
import { useSiteNav } from '../../hooks/useSiteNav';
import { minPrice, money } from '../../lib/format';
import { Icon } from '../Icon';

interface CasaCopy {
  lodge: LodgeId;
  label: string;
  script: string;
  alt: string;
  desc: string;
  bath: string;
  hover: [image: string, button: string];
}

const CASAS: CasaCopy[] = [
  {
    lodge: 'vientos', label: 'Hospedaje I', script: 'el principal', alt: 'Patio de Vientos',
    desc: 'Cuatro cuartos matrimoniales, uno privado con baño compartido y dos casas rodantes en el jardín: Astro Camper y Desert Library.',
    bath: 'Baño privado y compartido', hover: ['hc1', 'hc2'],
  },
  {
    lodge: 'yareta', label: 'Hospedaje II', script: 'la casa', alt: 'Corredor de La Yareta',
    desc: 'Trece unidades entre murales y columnas talladas: el Loft con mezzanina, cuartos con baño privado y otros más simples con baño compartido.',
    bath: 'Baño privado, exterior o compartido', hover: ['hc3', 'hc4'],
  },
];

function Casa({ casa }: { casa: CasaCopy }) {
  const { openBooking } = useSiteNav();
  const rooms = roomsOf(casa.lodge);
  const from = Math.min(...rooms.map((r) => minPrice(r.tiers)));

  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ display: 'block', textAlign: 'center', marginBottom: 'clamp(18px, 2.4vw, 30px)', fontSize: '12px', letterSpacing: '.34em', textTransform: 'uppercase', color: '#233735', whiteSpace: 'nowrap' }}>{casa.label}</span>
      <div style={{ position: 'relative', height: 'clamp(340px, 40vw, 520px)', overflow: 'hidden', borderRadius: '999px 999px 0 0 / 30% 30% 0 0', background: '#EDE7DB' }}>
        <div className={casa.hover[0]} role="img" aria-label={casa.alt} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${lodgePhotoUrl(casa.lodge)}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.8s cubic-bezier(.2,.7,.2,1)' }}></div>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(20,38,36,.3) 0%, rgba(20,38,36,0) 42%)' }}></div>
      </div>
      <div style={{ padding: '26px 4px 0', display: 'flex', flexDirection: 'column', gap: '13px', flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '0', color: '#21403E', lineHeight: '1.04' }}>{LODGES[casa.lodge].name}</h3>
          <span style={{ fontFamily: "'Italianno', cursive", fontSize: '32px', color: '#9C7C3C', lineHeight: '.8' }}>{casa.script}</span>
        </div>
        <p style={{ margin: '0', fontSize: '15.5px', lineHeight: '1.78', fontWeight: '300', color: '#4C5C58', maxWidth: '46ch' }}>{casa.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#4C5C58' }}><Icon name="bed-double" size={14} color="#9C7C3C" />{rooms.length} unidades</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#4C5C58' }}><Icon name="droplet" size={14} color="#9C7C3C" />{casa.bath}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#4C5C58' }}><Icon name="coffee" size={14} color="#9C7C3C" />Desayuno incluido</span>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', borderTop: '1px solid rgba(33,64,62,.16)', paddingTop: '18px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '9px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' }}>Desde</span>
            <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: '30px', color: '#21403E', lineHeight: '1.16' }}>{money(from)}</span>
          </div>
          <button className={casa.hover[1]} onClick={() => openBooking({ lodge: casa.lodge })} style={{ display: 'flex', alignItems: 'center', gap: '11px', background: 'none', border: '1px solid #21403E', borderRadius: '12px', color: '#21403E', padding: '14px 24px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease, color .4s ease, gap .4s ease' }}>Reservar<Icon name="arrow-right" size={14} /></button>
        </div>
      </div>
    </article>
  );
}

export function Intro() {
  return (
    <section data-reveal="1" style={{ maxWidth: '940px', margin: '0 auto', padding: 'clamp(70px, 10vw, 128px) clamp(20px, 5vw, 48px)', textAlign: 'center' }}>
      <img src="/img/logo-verde.png" alt="" style={{ width: 'min(190px, 40vw)', height: 'auto', display: 'block', margin: '0 auto 28px', opacity: '.85' }} />
      <span style={{ fontFamily: "'Italianno', cursive", fontSize: '46px', color: '#9C7C3C', lineHeight: '.8', display: 'block' }}>dos puertas distintas</span>
      <h2 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(26px, 3.2vw, 46px)', lineHeight: '1.08', margin: '12px 0 0', color: '#21403E' }}>Dos hospedajes, la misma calidad</h2>
      <p style={{ margin: '14px auto 0', maxWidth: '50ch', fontSize: '15.5px', lineHeight: '1.78', fontWeight: '300', color: '#5A6864' }}>Bajo una misma administración, elige el que más te acomode</p>
    </section>
  );
}

export function Casas() {
  return (
    <section id="casas" style={{ scrollMarginTop: '84px', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(30px, 5vw, 60px) clamp(20px, 5vw, 48px) clamp(20px, 3vw, 40px)', position: 'relative' }}>
      <div data-r="two" data-reveal="1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(26px, 4vw, 52px)' }}>
        {CASAS.map((casa) => <Casa key={casa.lodge} casa={casa} />)}
      </div>
    </section>
  );
}
