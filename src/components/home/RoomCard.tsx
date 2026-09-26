import { Link } from 'react-router-dom';
import { formatClp, minPrice } from '../../lib/format';
import { toSlug } from '../../lib/slug';
import type { Room } from '../../types/domain';

export function RoomCard({ room }: { room: Room }) {
  const from = minPrice(room.tiers);
  const priceNote = room.tiers.length > 1 ? 'Desde' : `${room.tiers[0][0]} personas`;

  return (
    <Link to={`/cuartos/${room.lodgeId}/${toSlug(room.folder)}`} className="room-card">
      <div className="room-card__image-wrap">
        {room.coverImage && (
          <div className="room-card__image" style={{ backgroundImage: `url("${room.coverImage}")` }} role="img" aria-label={room.name} />
        )}
      </div>
      <div className="room-card__body">
        <h3 className="room-card__name">{room.name}</h3>
        <p>{room.description}</p>
        <div className="room-card__tags">
          <span className="room-card__tag">{room.bed}</span>
          <span className="room-card__tag">{room.bath}</span>
        </div>
        <div className="room-card__price-row">
          <span className="room-card__price-note">{priceNote}</span>
          <span className="room-card__price">{formatClp(from)}</span>
        </div>
      </div>
    </Link>
  );
}
