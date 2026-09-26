import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LODGES } from '../content/lodges';
import { findRoom, roomsOf } from '../content/rooms';
import { useRoomCovers, useRoomPhotos } from '../hooks/usePhotos';
import { useSiteNav } from '../hooks/useSiteNav';
import { minPrice, money } from '../lib/format';
import { NotFoundPage } from './NotFoundPage';

const factLabel: React.CSSProperties = { display: 'block', fontSize: '9.5px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#7D8B86' };
const factValue: React.CSSProperties = { display: 'block', fontSize: '15px', color: '#21403E', marginTop: '4px' };

export function RoomPage() {
  const { roomId = '' } = useParams();
  const room = findRoom(roomId);
  return room ? <RoomDetail key={room.id} roomId={room.id} /> : <NotFoundPage />;
}

function RoomDetail({ roomId }: { roomId: string }) {
  const room = findRoom(roomId)!;
  const { goSection, openBooking, openRoom } = useSiteNav();
  const gallery = useRoomPhotos(room);
  const coverOf = useRoomCovers(room.lodge);
  const [gal, setGal] = useState(0);

  const hero = gallery.length ? gallery[gal % gallery.length] : undefined;
  const others = roomsOf(room.lodge).filter((r) => r.id !== room.id).slice(0, 3);
  const facts = [
    ['Capacidad', room.cap === 1 ? '1 persona' : `hasta ${room.cap} personas`],
    ['Camas', room.bed],
    ['Baño', room.bath],
    ['Disponibilidad', room.units > 1 ? `${room.units} cuartos iguales` : 'Cuarto único'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E8', paddingTop: '96px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(28px, 4vw, 48px) clamp(20px, 5vw, 48px) clamp(56px, 8vw, 96px)', animation: 'vsp-page .9s cubic-bezier(.22,.8,.2,1) both' }}>
        <nav aria-label="Ruta" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#7D8B86', marginBottom: 'clamp(20px, 3vw, 34px)' }}>
          <button className="hd1" onClick={() => goSection('cuartos')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#21403E', fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase' }}><Icon name="arrow-left" size={14} />Cuartos</button>
          <span>/</span><span>{LODGES[room.lodge].full}</span><span>/</span><span style={{ color: '#21403E' }}>{room.name}</span>
        </nav>
        <h1 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(30px, 4.6vw, 62px)', lineHeight: '1.06', margin: '0 0 28px', color: '#21403E', maxWidth: '24ch' }}>{room.name}</h1>

        <div style={{ position: 'relative', height: 'clamp(260px, 44vw, 560px)', overflow: 'hidden', borderRadius: '18px', background: '#EDE7DB' }}>
          {hero && <div key={hero} role="img" aria-label={room.name} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${hero}")`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'vsp-heroin 1.1s cubic-bezier(.22,.8,.2,1) both' }}></div>}
        </div>
        {gallery.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }} data-rail="1">
            {gallery.map((src, i) => (
              <button key={src} onClick={() => setGal(i)} aria-label={`Foto ${i + 1}`} style={{ flex: '0 0 auto', width: '110px', height: '74px', borderRadius: '10px', border: `2px solid ${gal % gallery.length === i ? '#9C7C3C' : 'transparent'}`, padding: '0', cursor: 'pointer', backgroundColor: '#EDE7DB', backgroundImage: `url("${src}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'border-color .4s ease' }}></button>
            ))}
          </div>
        )}

        <div data-r="two" style={{ display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 'clamp(28px, 4vw, 56px)', marginTop: 'clamp(32px, 5vw, 56px)', alignItems: 'start' }}>
          <div>
            <p style={{ margin: '0 0 26px', fontFamily: "'Newsreader', serif", fontWeight: '300', fontSize: 'clamp(19px, 2.1vw, 27px)', lineHeight: '1.5', color: '#21403E' }}>{room.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0', borderTop: '1px solid rgba(33,64,62,.16)' }}>
              {facts.map(([label, value]) => (
                <div key={label} style={{ padding: '15px 0', borderBottom: '1px solid rgba(33,64,62,.16)' }}>
                  <span style={factLabel}>{label}</span>
                  <span style={factValue}>{value}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '26px 0 0', fontSize: '15px', lineHeight: '1.8', fontWeight: '300', color: '#4C5C58', maxWidth: '56ch' }}>Desayuno incluido. Almuerzos y cenas a pedido. Check-in desde las 14:00 y check-out hasta las 11:00; si llegas más tarde, avísanos y dejamos la llave lista.</p>
          </div>
          <aside style={{ background: '#EDE7DB', padding: 'clamp(22px, 2.6vw, 34px)', position: 'sticky', top: 'calc(96px + 20px)', borderRadius: '18px' }}>
            <span style={{ fontSize: '9.5px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#7D8B86' }}>Valores por noche</span>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '14px', borderTop: '1px solid rgba(33,64,62,.16)' }}>
              {room.tiers.map(([pax, price]) => (
                <div key={pax} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(33,64,62,.16)' }}>
                  <span style={{ fontSize: '13.5px', color: '#4C5C58' }}>{pax} {pax === 1 ? 'persona' : 'personas'}</span>
                  <span style={{ fontFamily: "'Gloock', serif", fontSize: '23px', color: '#21403E' }}>{money(price)}</span>
                </div>
              ))}
            </div>
            <button className="hd2" onClick={() => openBooking({ lodge: room.lodge, room: room.id })} style={{ width: '100%', marginTop: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#21403E', color: '#F6F1E8', border: 'none', borderRadius: '14px', padding: '17px 24px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease, gap .4s ease' }}>
              Reservar este cuarto
              <Icon name="arrow-right" size={14} />
            </button>
            <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#7D8B86', lineHeight: '1.6' }}>Sin costo de cancelación hasta 48 h antes de la llegada.</p>
          </aside>
        </div>
        <div style={{ marginTop: 'clamp(56px, 8vw, 96px)', borderTop: '1px solid rgba(33,64,62,.16)', paddingTop: 'clamp(28px, 4vw, 44px)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <h2 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(24px, 2.8vw, 36px)', margin: '0', color: '#21403E' }}>Otros cuartos en {LODGES[room.lodge].name}</h2>
            <button className="hd3" onClick={() => goSection('cuartos')} style={{ background: 'none', border: 'none', borderBottom: '1px solid #9C7C3C', padding: '3px 0', color: '#9C7C3C', fontSize: '10.5px', letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Ver todos</button>
          </div>
          <div data-r="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(16px, 2vw, 26px)' }}>
            {others.map((o) => (
              <button key={o.id} onClick={() => openRoom(o.id)} style={{ textAlign: 'left', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ display: 'block', position: 'relative', height: 'clamp(180px, 18vw, 240px)', overflow: 'hidden', borderRadius: '18px', background: '#EDE7DB' }}><span className="hd4" role="img" aria-label={o.name} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${coverOf(o.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.4s cubic-bezier(.2,.7,.2,1)' }}></span></span>
                <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontFamily: "'Gloock', serif", fontSize: '22px', color: '#21403E' }}>{o.name}</span>
                  <span style={{ fontSize: '12.5px', color: '#4C5C58', whiteSpace: 'nowrap' }}>desde {money(minPrice(o.tiers))}</span>
                </span>
                <span style={{ fontSize: '12.5px', color: '#4C5C58' }}>{o.cap === 1 ? '1 persona' : `hasta ${o.cap}`} · {o.bath}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
