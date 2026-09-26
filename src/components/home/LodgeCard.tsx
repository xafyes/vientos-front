import { ArrowRight } from 'lucide-react';
import { useLodgeFromPrice } from '../../hooks/useLodgeFromPrice';
import { useLodgeMedia } from '../../hooks/useLodgeMedia';
import { useUi } from '../../hooks/useUi';
import { formatClp } from '../../lib/format';
import type { LodgeInfo } from '../../types/domain';

export function LodgeCard({ lodge, script }: { lodge: LodgeInfo; script: string }) {
  const { data: images } = useLodgeMedia(lodge.id);
  const { data: fromPrice } = useLodgeFromPrice(lodge.id);
  const { openBooking } = useUi();
  const cover = images?.[0];

  return (
    <article className="lodge-card">
      <div className="lodge-card__image-wrap">
        {cover && (
          <div className="lodge-card__image" style={{ backgroundImage: `url("${cover}")` }} role="img" aria-label={lodge.fullName} />
        )}
      </div>
      <div className="lodge-card__body">
        <div className="lodge-card__title-row">
          <h3 className="lodge-card__title">{lodge.name}</h3>
          <span className="lodge-card__script">{script}</span>
        </div>
        <p>{lodge.description}</p>
        <div className="lodge-card__foot">
          <div>
            <span className="lodge-card__from-label">Desde</span>
            <span className="lodge-card__from-value">{fromPrice ? formatClp(fromPrice) : '—'}</span>
          </div>
          <button className="btn btn-outline" onClick={() => openBooking(lodge.id)}>
            Reservar
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
