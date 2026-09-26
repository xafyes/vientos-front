import { useGalleryPhotos } from '../hooks/usePhotos';

/** Column spans and heights from the design; rows of 12 columns repeat for longer galleries. */
const LAYOUT: readonly [span: number, height: string][] = [
  [7, 'clamp(240px, 32vw, 440px)'], [5, 'clamp(240px, 32vw, 440px)'],
  [4, 'clamp(200px, 24vw, 330px)'], [4, 'clamp(200px, 24vw, 330px)'], [4, 'clamp(200px, 24vw, 330px)'],
  [6, 'clamp(230px, 28vw, 400px)'], [6, 'clamp(230px, 28vw, 400px)'],
  [5, 'clamp(220px, 26vw, 380px)'], [3, 'clamp(220px, 26vw, 380px)'], [4, 'clamp(220px, 26vw, 380px)'],
  [4, 'clamp(210px, 25vw, 350px)'], [4, 'clamp(210px, 25vw, 350px)'], [4, 'clamp(210px, 25vw, 350px)'],
];

export function GalleryPage() {
  const photos = useGalleryPhotos();

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E8', paddingTop: '96px', animation: 'vsp-page .9s cubic-bezier(.22,.8,.2,1) both' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(34px, 5vw, 64px) clamp(20px, 5vw, 48px) clamp(60px, 8vw, 100px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 4vw, 50px)' }}>
          <span style={{ fontFamily: "'Italianno', cursive", fontSize: '52px', color: '#9C7C3C', lineHeight: '.8', display: 'block' }}>el oasis y las casas</span>
          <h1 style={{ fontFamily: "'Gloock', serif", fontWeight: '400', fontSize: 'clamp(30px, 4.4vw, 58px)', lineHeight: '1.06', margin: '14px 0 14px', color: '#21403E' }}>Galería</h1>
          <p style={{ margin: '0 auto', maxWidth: '52ch', fontSize: '15.5px', lineHeight: '1.8', fontWeight: '300', color: '#4C5C58' }}>Los patios, el corredor de caña, las lagunas y las noches sin luz artificial. Programamos salidas con SORBAC o te pasamos las rutas para que salgas por tu cuenta.</p>
        </div>
        <div data-r="galgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px' }}>
          {photos.map((p, i) => {
            const [span, height] = LAYOUT[i % LAYOUT.length];
            return (
              <figure key={p.src} style={{ gridColumn: `span ${span}`, margin: '0', position: 'relative', overflow: 'hidden', height, background: '#EDE7DB', animation: `vsp-windin-a 1s cubic-bezier(.22,.8,.2,1) ${(Math.min(i, 12) * 0.07).toFixed(2)}s both` }}>
                <div className="hg1" role="img" aria-label={p.caption} style={{ position: 'absolute', inset: '0', backgroundImage: `url("${p.src}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.6s cubic-bezier(.2,.7,.2,1)' }}></div>
                <figcaption style={{ position: 'absolute', left: '0', right: '0', bottom: '0', padding: '30px 16px 14px', background: 'linear-gradient(transparent, rgba(20,38,36,.82))', color: '#F6F1E8', fontSize: '12px', letterSpacing: '.1em' }}>{p.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
