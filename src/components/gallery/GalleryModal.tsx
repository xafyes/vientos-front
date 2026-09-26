import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { LODGES } from '../../content/lodges';
import { useLodgeMedia } from '../../hooks/useLodgeMedia';
import { useUi } from '../../hooks/useUi';
import type { LodgeId } from '../../types/domain';
import { StateView } from '../common/StateView';
import './GalleryModal.css';

export function GalleryModal() {
  const { galleryLodge, closeGallery } = useUi();
  const [lodgeId, setLodgeId] = useState<LodgeId>(galleryLodge ?? 'vientos');

  useEffect(() => {
    if (galleryLodge) setLodgeId(galleryLodge);
  }, [galleryLodge]);

  useEffect(() => {
    if (!galleryLodge) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [galleryLodge]);

  const { data: images, loading, error } = useLodgeMedia(lodgeId);

  if (!galleryLodge) return null;

  return (
    <div className="gallery-modal" role="dialog" aria-modal="true" aria-label="Galería de fotos">
      <div className="gallery-modal__top">
        <div className="gallery-modal__tabs">
          {Object.values(LODGES).map((lodge) => (
            <button
              key={lodge.id}
              className={`gallery-modal__tab ${lodge.id === lodgeId ? 'gallery-modal__tab--active' : ''}`}
              onClick={() => setLodgeId(lodge.id)}
            >
              {lodge.name}
            </button>
          ))}
        </div>
        <button className="gallery-modal__close" aria-label="Cerrar" onClick={closeGallery}>
          <X size={17} />
        </button>
      </div>

      <StateView loading={loading} error={error} empty={images?.length === 0} emptyMessage="Sin fotos por ahora.">
        <div className="gallery-modal__grid">
          {(images ?? []).map((src) => (
            <figure className="gallery-modal__figure" key={src}>
              <img src={src} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </StateView>
    </div>
  );
}
