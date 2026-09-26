import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { StateView } from '../components/common/StateView';
import '../components/rooms/RoomDetail.css';
import { LODGES } from '../content/lodges';
import { useRoomDetail } from '../hooks/useRoomDetail';
import { useRooms } from '../hooks/useRooms';
import { useUi } from '../hooks/useUi';
import { formatClp } from '../lib/format';
import { toSlug } from '../lib/slug';
import type { LodgeId } from '../types/domain';
import { NotFoundPage } from './NotFoundPage';

export function RoomPage() {
  const params = useParams<{ lodgeId: string; slug: string }>();
  const [gal, setGal] = useState(0);
  const { openBooking } = useUi();

  const lodgeId = params.lodgeId as LodgeId;
  const isValidLodge = lodgeId === 'vientos' || lodgeId === 'yareta';
  const slug = params.slug ?? '';

  const { data: room, loading, error } = useRoomDetail(isValidLodge ? lodgeId : 'vientos', slug);
  const { data: allRooms } = useRooms(isValidLodge ? lodgeId : 'vientos');

  if (!isValidLodge) return <NotFoundPage />;

  const others = (allRooms ?? []).filter((r) => toSlug(r.folder) !== slug).slice(0, 3);
  const gallery = room?.gallery ?? [];
  const activeImage = gallery[gal] ?? gallery[0];

  return (
    <div className="room-detail container">
      <nav className="room-detail__crumbs" aria-label="Ruta">
        <Link to="/">Inicio</Link>
        <ChevronRight size={12} />
        <Link to={`/#cuartos`}>{LODGES[lodgeId].name}</Link>
        <ChevronRight size={12} />
        <span>{room?.name ?? slug}</span>
      </nav>

      <StateView loading={loading} error={error}>
        {room && (
          <>
            <div className="room-detail__gallery">
              <div
                className="room-detail__hero"
                style={activeImage ? { backgroundImage: `url("${activeImage}")` } : undefined}
                role="img"
                aria-label={room.name}
              />
              <div className="room-detail__thumbs">
                {gallery.slice(0, 6).map((src, i) => (
                  <button
                    key={src}
                    className={`room-detail__thumb ${i === gal ? 'room-detail__thumb--active' : ''}`}
                    style={{ backgroundImage: `url("${src}")` }}
                    onClick={() => setGal(i)}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="room-detail__body">
              <div>
                <span className="eyebrow-script">{LODGES[room.lodgeId].name}</span>
                <h1>{room.name}</h1>
                <p style={{ marginTop: 14, maxWidth: '52ch' }}>{room.description}</p>
                <div className="room-detail__tags">
                  <span className="room-detail__tag">{room.bed}</span>
                  <span className="room-detail__tag">{room.bath}</span>
                  <span className="room-detail__tag">Hasta {room.capacity} personas</span>
                </div>

                <div className="room-detail__prices">
                  {room.tiers.map(([guests, price]) => (
                    <div className="room-detail__price-row" key={guests}>
                      <span>{guests} {guests === 1 ? 'persona' : 'personas'}</span>
                      <strong>{formatClp(price)} / noche</strong>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-solid room-detail__cta"
                  onClick={() => openBooking(room.lodgeId, room.id)}
                >
                  Reservar este cuarto
                  <ArrowRight size={14} />
                </button>
              </div>

              {others.length > 0 && (
                <div className="room-detail__others">
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>Otros cuartos en {LODGES[room.lodgeId].name}</h3>
                  <div className="room-detail__others-list">
                    {others.map((other) => (
                      <Link
                        key={other.id}
                        to={`/cuartos/${other.lodgeId}/${toSlug(other.folder)}`}
                        className="room-detail__other-link"
                      >
                        <span
                          className="room-detail__other-thumb"
                          style={other.coverImage ? { backgroundImage: `url("${other.coverImage}")` } : undefined}
                        />
                        <span>
                          <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 16 }}>
                            {other.name}
                          </strong>
                          <span style={{ fontSize: 12.5, color: 'var(--muted-2)' }}>{other.bath}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </StateView>
    </div>
  );
}
