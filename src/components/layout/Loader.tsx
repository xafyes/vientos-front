import { useEffect, useState } from 'react';

export function Loader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden={loaded}
      style={{
        position: 'fixed', inset: '0', zIndex: '400', background: '#21403E', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '26px',
        ...(loaded
          ? { opacity: 0, visibility: 'hidden', transition: 'opacity .9s ease, visibility 0s .9s' }
          : { opacity: 1, transition: 'opacity .9s ease' }),
      }}
    >
      <img src="/img/logo-crema.png" alt="Vientos de San Pedro" style={{ width: 'clamp(130px, 22vw, 210px)', height: 'auto', animation: 'vsp-fade 1.2s ease both' }} />
      <span style={{ display: 'block', width: '120px', height: '1px', background: 'rgba(228,211,168,.34)', overflow: 'hidden', position: 'relative' }}>
        <span style={{ position: 'absolute', inset: '0', background: '#E4D3A8', transformOrigin: 'left', animation: 'vsp-load 1.5s cubic-bezier(.4,0,.2,1) both' }}></span>
      </span>
      <span style={{ fontSize: '9.5px', letterSpacing: '.4em', textTransform: 'uppercase', color: '#9DAAA4', animation: 'vsp-fade 1.4s ease .6s both' }}>Ayllu de Quitor · Atacama</span>
    </div>
  );
}
