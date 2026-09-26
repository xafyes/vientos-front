import { Fragment } from 'react';
import { Icon } from '../components/Icon';
import { LODGE_IDS, LODGES } from '../content/lodges';
import { roomsOf } from '../content/rooms';
import { STEP_LABELS, useBookingFlow, type BookingForm } from '../hooks/useBookingFlow';
import { lodgePhotoUrl, useRoomCovers } from '../hooks/usePhotos';
import { useSiteNav } from '../hooks/useSiteNav';
import { capShort, fmtDate, guestsLabel, money, priceFor } from '../lib/format';
import type { ArrivalWindow, PaymentMethod } from '../types/domain';

const STEP_TITLES = ['¿Dónde quieres dormir?', 'Fechas y huéspedes', 'Tus datos de contacto', 'Revisa y confirma'];
const ARRIVALS: [ArrivalWindow, string][] = [
  ['14-17', 'Entre 14:00 y 17:00'], ['17-20', 'Entre 17:00 y 20:00'], ['20-23', 'Entre 20:00 y 23:00'], ['late', 'Después de 23:00'],
];
const PAY_OPTIONS: { id: PaymentMethod; name: string; desc: string }[] = [
  { id: 'transfer', name: 'Transferencia bancaria', desc: 'Te enviamos los datos por correo; 48 h para transferir.' },
  { id: 'arrival', name: 'Pago al llegar', desc: 'Efectivo o tarjeta en la casa, al hacer el check-in.' },
];

const fieldLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px' };
const fieldText: React.CSSProperties = { fontSize: '12.5px', fontWeight: '500', color: '#4C5C58' };
const fieldInput: React.CSSProperties = { border: '1px solid rgba(33,64,62,.16)', borderRadius: '12px', background: '#FFFCF6', padding: '15px 16px', fontSize: '15.5px', color: '#21403E', width: '100%' };
const smallCaps: React.CSSProperties = { fontSize: '9.5px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#7D8B86' };
const stepBody = (gap: string): React.CSSProperties => ({ padding: '0', display: 'flex', flexDirection: 'column', gap, animation: 'vsp-step .7s cubic-bezier(.22,.8,.2,1) both' });

export function BookingPage() {
  const flow = useBookingFlow();
  const { form, set, step, status, room } = flow;
  const { goSection } = useSiteNav();
  const coverOf = useRoomCovers(form.lodge);

  const inFlow = status === 'idle';
  const selLodgeName = LODGES[room?.lodge ?? form.lodge].full;
  const nightsLabel = flow.nights ? String(flow.nights) : '—';
  const datesNice = form.checkIn && form.checkOut ? `${fmtDate(form.checkIn)} → ${fmtDate(form.checkOut)}` : 'Elige tus fechas';
  const nextLabel = step === 4 ? 'Confirmar reserva' : 'Continuar';
  const title = status === 'sending' ? 'Un momento' : status === 'done' ? '¡Nos vemos en Quitor!' : status === 'error' ? 'Algo falló' : STEP_TITLES[step - 1];

  const text = (key: keyof BookingForm) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never),
  });

  const summary = [
    ['Casa', selLodgeName],
    ['Cuarto', room?.name ?? '—'],
    ['Llegada', `${fmtDate(form.checkIn)} · ${form.arrival === 'late' ? 'después de 23:00' : `${form.arrival.replace('-', ':00 a ')}:00`}`],
    ['Salida', `${fmtDate(form.checkOut)} · antes de 11:00`],
    ['Noches', String(flow.nights || 1)],
    ['Huéspedes', guestsLabel(form.guests)],
    ['Valor noche', money(flow.nightly)],
    ['Desayuno', 'Incluido'],
  ];

  const nextButton = (
    <button className="hb8" onClick={flow.next} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#21403E', color: '#F6F1E8', border: 'none', borderRadius: '14px', padding: '17px 22px', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease, gap .4s ease' }}>
      {nextLabel}<Icon name="arrow-right" size={14} />
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E8', paddingTop: '96px' }}>
      <div data-r="checkout" style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(26px, 4vw, 52px) clamp(20px, 5vw, 48px) clamp(60px, 8vw, 100px)', display: 'grid', gridTemplateColumns: inFlow ? 'minmax(0, 1fr) 360px' : '1fr', gap: 'clamp(30px, 5vw, 76px)', alignItems: 'start', animation: 'vsp-page .9s cubic-bezier(.22,.8,.2,1) both' }}>
        <div style={{ minWidth: '0' }}>
          {inFlow && (
            <button className="hb1" onClick={() => (step === 1 ? goSection('cuartos') : flow.back())} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'none', border: 'none', padding: '0', marginBottom: '22px', cursor: 'pointer', color: '#4C5C58', fontSize: '10.5px', letterSpacing: '.18em', textTransform: 'uppercase' }}>
              <Icon name="arrow-left" size={14} />{step === 1 ? 'Cancelar' : 'Atrás'}
            </button>
          )}
          <div style={{ fontFamily: "'Gloock', serif", fontSize: 'clamp(30px, 4.4vw, 52px)', lineHeight: '1.04', color: '#21403E' }}>{title}</div>
          {inFlow && (
            <div data-r="steps" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', margin: '20px 0 clamp(26px, 4vw, 40px)' }}>
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                return (
                  <button key={label} onClick={() => flow.goStep(n)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '0', cursor: step > n ? 'pointer' : 'default' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', background: step > n ? '#9C7C3C' : step === n ? '#21403E' : 'rgba(33,64,62,.14)', color: step >= n ? '#FFFFFF' : '#7D8B86', transition: 'background .5s ease, color .5s ease' }}>{step > n ? '✓' : n}</span>
                    <span data-lbl="1" style={{ fontSize: '12.5px', color: step === n ? '#21403E' : '#7D8B86', transition: 'color .5s ease' }}>{label}</span>
                    <span style={{ display: n < STEP_LABELS.length ? 'block' : 'none', width: '22px', height: '1px', background: 'rgba(33,64,62,.16)', marginLeft: '4px' }}></span>
                  </button>
                );
              })}
            </div>
          )}
          <div key={`${step}-${status}`}>
            {inFlow && step === 1 && (
              <div data-r="modal-body" style={stepBody('20px')}>
                {flow.picking && (
                  <div data-r="pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {LODGE_IDS.map((id) => {
                      const active = form.lodge === id;
                      return (
                        <button key={id} className="hb2" onClick={() => flow.selectLodge(id)} style={{ textAlign: 'left', cursor: 'pointer', padding: '14px', display: 'flex', gap: '14px', alignItems: 'center', background: active ? '#EAE7D9' : '#FFFCF6', border: 'none', borderBottom: `2px solid ${active ? '#9C7C3C' : 'rgba(33,64,62,.16)'}`, transition: 'background .35s ease, border-color .35s ease' }}>
                          <span role="img" aria-label={LODGES[id].full} style={{ width: '58px', height: '58px', flex: '0 0 auto', backgroundColor: '#EDE7DB', backgroundImage: `url("${lodgePhotoUrl(id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></span>
                          <span style={{ display: 'block' }}>
                            <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: '23px', color: '#21403E' }}>{LODGES[id].full}</span>
                            <span style={{ display: 'block', fontSize: '12px', color: '#4C5C58', marginTop: '3px' }}>{LODGES[id].tagline}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {room && !flow.picking && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '14px', borderRadius: '18px', background: '#EDE7DB' }}>
                    <span role="img" aria-label={room.name} style={{ width: '112px', height: '80px', borderRadius: '10px', flex: '0 0 auto', backgroundColor: '#EDE7DB', backgroundImage: `url("${coverOf(room.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></span>
                    <span style={{ display: 'block', flex: '1', minWidth: '0' }}>
                      <span style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#4C5C58' }}>{LODGES[room.lodge].full}</span>
                      <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: '24px', color: '#21403E', marginTop: '3px' }}>{room.name}</span>
                      <span style={{ display: 'block', fontSize: '12.5px', color: '#4C5C58', marginTop: '3px' }}>{capShort(room.cap)} · {room.bed} · {room.bath}</span>
                    </span>
                    <button className="hb3" onClick={flow.startPicking} style={{ flex: '0 0 auto', background: 'none', border: 'none', borderBottom: '1px solid #9C7C3C', color: '#9C7C3C', padding: '3px 0', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color .4s ease' }}>Cambiar</button>
                  </div>
                )}
                {flow.picking && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={smallCaps}>Elige el cuarto · {guestsLabel(form.guests)}</span>
                    {roomsOf(form.lodge).map((r) => {
                      const selected = form.roomId === r.id;
                      const fits = form.guests <= r.cap;
                      return (
                        <button key={r.id} className="hb4" onClick={() => flow.selectRoom(r)} style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 10px', background: selected ? '#EAE7D9' : '#FFFCF6', border: 'none', borderBottom: '1px solid rgba(33,64,62,.16)', borderLeft: `2px solid ${selected ? '#9C7C3C' : 'rgba(33,64,62,.16)'}`, transition: 'background .35s ease, border-color .35s ease, padding-left .35s ease', opacity: fits ? 1 : 0.5 }}>
                          <span role="img" aria-label={r.name} style={{ width: '80px', height: '58px', flex: '0 0 auto', backgroundColor: '#EDE7DB', backgroundImage: `url("${coverOf(r.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></span>
                          <span style={{ display: 'block', flex: '1', minWidth: '0' }}>
                            <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: '20px', color: '#21403E' }}>{r.name}</span>
                            <span style={{ display: 'block', fontSize: '12px', color: '#4C5C58', marginTop: '2px' }}>{capShort(r.cap)} · {r.bed} · {r.bath}</span>
                          </span>
                          <span style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span style={{ display: 'block', fontFamily: "'Gloock', serif", fontSize: '19px', color: '#21403E' }}>{money(priceFor(r, form.guests))}</span>
                            <span style={{ display: 'block', fontSize: '10px', color: '#7D8B86' }}>{fits ? guestsLabel(form.guests) : `máx ${r.cap}`}</span>
                          </span>
                          <span style={{ width: '16px', display: 'flex', justifyContent: 'center', color: '#9C7C3C', fontSize: '15px' }}>{selected ? '●' : ''}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {inFlow && step === 2 && (
              <div data-r="modal-body" style={stepBody('18px')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div data-r="pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label style={fieldLabel}><span style={fieldText}>Llegada</span><input type="date" {...text('checkIn')} style={fieldInput} /></label>
                    <label style={fieldLabel}><span style={fieldText}>Salida</span><input type="date" {...text('checkOut')} style={fieldInput} /></label>
                  </div>
                  <label style={fieldLabel}>
                    <span style={fieldText}>Huéspedes</span>
                    <select value={form.guests} onChange={(e) => set('guests', Number(e.target.value))} style={{ ...fieldInput, appearance: 'none' }}>
                      {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{guestsLabel(n)}</option>)}
                    </select>
                  </label>
                  <label style={fieldLabel}>
                    <span style={fieldText}>Hora estimada de llegada</span>
                    <select {...text('arrival')} style={{ ...fieldInput, appearance: 'none' }}>
                      {ARRIVALS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {inFlow && step === 3 && (
              <div data-r="modal-body" style={stepBody('15px')}>
                <div data-r="pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={fieldLabel}><span style={fieldText}>Nombre</span><input type="text" autoComplete="given-name" placeholder="Camila" {...text('firstName')} style={fieldInput} /></label>
                  <label style={fieldLabel}><span style={fieldText}>Apellido</span><input type="text" autoComplete="family-name" placeholder="Rojas" {...text('lastName')} style={fieldInput} /></label>
                </div>
                <div data-r="pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={fieldLabel}><span style={fieldText}>Correo</span><input type="email" autoComplete="email" placeholder="camila@correo.com" {...text('email')} style={fieldInput} /></label>
                  <label style={fieldLabel}><span style={fieldText}>Teléfono</span><input type="tel" autoComplete="tel" placeholder="+56 9 ..." {...text('phone')} style={fieldInput} /></label>
                </div>
                <label style={fieldLabel}>
                  <span style={fieldText}>¿Algo que debamos saber?</span>
                  <textarea rows={3} placeholder="Llegamos del Tatio, dieta sin gluten, queremos cena el primer día..." {...text('notes')} style={{ ...fieldInput, resize: 'vertical', fontWeight: '300' }}></textarea>
                </label>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...text('company')} style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '11px', fontSize: '14px', color: '#4C5C58', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} style={{ width: '17px', height: '17px', accentColor: '#9C7C3C', flex: '0 0 auto' }} />
                  Acepto la política de cancelación: sin costo hasta 48 h antes de la llegada.
                </label>
              </div>
            )}

            {inFlow && step === 4 && (
              <div data-r="modal-body" style={stepBody('30px')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  <span style={smallCaps}>Resumen</span>
                  {summary.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px', color: '#4C5C58', borderBottom: '1px solid rgba(33,64,62,.16)', paddingBottom: '8px' }}>
                      <span style={{ color: '#7D8B86' }}>{k}</span>
                      <strong style={{ fontWeight: '500', textAlign: 'right' }}>{v}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  <span style={smallCaps}>Forma de pago</span>
                  {PAY_OPTIONS.map((p) => {
                    const active = form.pay === p.id;
                    return (
                      <Fragment key={p.id}>
                        <button onClick={() => set('pay', p.id)} style={{ cursor: 'pointer', textAlign: 'left', padding: '18px', borderRadius: '12px', background: active ? '#EAE7D9' : '#FFFCF6', border: `1px solid ${active ? '#9C7C3C' : 'rgba(33,64,62,.16)'}`, display: 'flex', flexDirection: 'column', gap: '4px', transition: 'background .35s ease, border-color .35s ease' }}>
                          <span style={{ fontSize: '15px', color: '#21403E' }}>{p.name}</span>
                          <span style={{ fontSize: '12px', color: '#4C5C58', lineHeight: '1.5' }}>{p.desc}</span>
                        </button>
                      </Fragment>
                    );
                  })}
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7D8B86', lineHeight: '1.6' }}>Al confirmar te enviamos la dirección exacta en Quitor y cómo llegar desde el terminal.</p>
                </div>
              </div>
            )}

            {status === 'sending' && (
              <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                <span style={{ width: '44px', height: '44px', border: '1px solid rgba(33,64,62,.16)', borderTopColor: '#9C7C3C', borderRadius: '50%', animation: 'vsp-spin .9s linear infinite' }}></span>
                <div style={{ fontFamily: "'Gloock', serif", fontSize: '26px', color: '#21403E' }}>Enviando tu reserva…</div>
                <div style={{ fontSize: '13.5px', color: '#7D8B86' }}>{selLodgeName}</div>
              </div>
            )}

            {status === 'done' && (
              <div style={{ padding: '52px 28px 42px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px', animation: 'vsp-fade .5s ease both' }}>
                <img src="/img/logo-verde.png" alt="" style={{ width: '120px', height: 'auto', opacity: '.8' }} />
                <h3 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: '38px', margin: '4px 0 0', color: '#21403E' }}>Reserva recibida</h3>
                <p style={{ margin: '0', maxWidth: '44ch', fontSize: '15.5px', lineHeight: '1.7', fontWeight: '300', color: '#4C5C58' }}>Te esperamos, {form.firstName}. Te escribiremos a <strong style={{ fontWeight: '500' }}>{form.email}</strong> para confirmar tu estadía.</p>
                <div style={{ borderTop: '1px solid rgba(33,64,62,.16)', borderBottom: '1px solid rgba(33,64,62,.16)', padding: '20px 0', display: 'flex', gap: '40px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                  {[['Código', flow.code], ['Cuarto', room?.name ?? '—'], ['Fechas', `${fmtDate(form.checkIn)}–${fmtDate(form.checkOut)}`]].map(([k, v]) => (
                    <div key={k}><div style={{ fontSize: '9.5px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#7D8B86' }}>{k}</div><div style={{ fontFamily: "'Gloock', serif", fontSize: '24px', color: '#21403E' }}>{v}</div></div>
                  ))}
                </div>
                <button className="hb5" onClick={() => goSection('inicio')} style={{ marginTop: '20px', background: '#21403E', color: '#F6F1E8', border: 'none', padding: '15px 30px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease' }}>Volver al sitio</button>
              </div>
            )}

            {status === 'error' && (
              <div style={{ padding: '52px 28px 42px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px', animation: 'vsp-fade .5s ease both' }}>
                <span style={{ width: '62px', height: '62px', borderRadius: '50%', background: '#F2E3E1', color: '#A8404E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="alert-triangle" size={28} />
                </span>
                <h3 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: '38px', margin: '4px 0 0', color: '#21403E' }}>No pudimos cerrar la reserva</h3>
                <p style={{ margin: '0', maxWidth: '48ch', fontSize: '15.5px', lineHeight: '1.7', fontWeight: '300', color: '#4C5C58' }}>{flow.err} Nada quedó cobrado.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="hb6" onClick={flow.submit} style={{ background: '#9C7C3C', color: '#F6F1E8', border: 'none', padding: '14px 26px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease' }}>Intentar de nuevo</button>
                  <button className="hb7" onClick={flow.restart} style={{ background: 'none', border: '1px solid rgba(33,64,62,.3)', color: '#4C5C58', padding: '14px 26px', fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease' }}>Cambiar cuarto</button>
                </div>
              </div>
            )}
          </div>
          {inFlow && flow.err && <p data-r="mobile-err" role="alert" style={{ margin: '18px 0 0', fontSize: '13px', color: '#A8404E' }}>{flow.err}</p>}
          {inFlow && <div data-r="mobile-next" style={{ marginTop: '22px' }}>{nextButton}</div>}
        </div>

        {inFlow && (
          <aside data-r="summary" style={{ position: 'sticky', top: 'calc(96px + 22px)', background: '#FFFCF6', borderRadius: '18px', boxShadow: '0 30px 60px -44px rgba(20,38,36,.55)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '170px', background: '#EDE7DB' }}>
              <div role="img" aria-label={room?.name ?? selLodgeName} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${room ? coverOf(room.id) : lodgePhotoUrl(form.lodge)}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image .6s ease' }}></div>
              <span style={{ position: 'absolute', left: '14px', top: '14px', background: 'rgba(246,241,232,.92)', color: '#21403E', fontSize: '9.5px', letterSpacing: '.2em', textTransform: 'uppercase', padding: '7px 11px', borderRadius: '999px' }}>{selLodgeName}</span>
            </div>
            <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontFamily: "'Gloock', serif", fontSize: '26px', color: '#21403E', lineHeight: '1.15' }}>{room?.name ?? '—'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13.5px', color: '#4C5C58' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Icon name="calendar" size={15} color="#9C7C3C" />{datesNice}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Icon name="users" size={15} color="#9C7C3C" />{guestsLabel(form.guests)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Icon name="coffee" size={15} color="#9C7C3C" />Desayuno incluido</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(33,64,62,.16)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13.5px', color: '#4C5C58' }}>
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>{money(flow.nightly)} × {nightsLabel} noches<strong style={{ fontWeight: '500' }}>{money(flow.total)}</strong></span>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'Gloock', serif", fontSize: '24px', color: '#21403E', marginTop: '4px' }}>Total<strong style={{ fontWeight: '400' }}>{money(flow.total)}</strong></span>
              </div>
              <div data-r="summary-next">{nextButton}</div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '11.5px', color: '#7D8B86' }}><Icon name="shield-check" size={13} />Cancelación sin costo hasta 48 h antes</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
