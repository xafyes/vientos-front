import { useState } from 'react';
import { LODGES } from '../../content/lodges';
import { useRooms } from '../../hooks/useRooms';
import type { LodgeId } from '../../types/domain';
import { StateView } from '../common/StateView';
import { RoomCard } from './RoomCard';
import './RoomsSection.css';

export function RoomsSection() {
  const [lodgeId, setLodgeId] = useState<LodgeId>('vientos');
  const { data: rooms, loading, error } = useRooms(lodgeId);

  return (
    <section id="cuartos" className="section container">
      <div className="section-heading">
        <span className="eyebrow-script">cada habitación es diferente</span>
        <h2>Nuestros cuartos</h2>
        <div className="rooms-tabs">
          {Object.values(LODGES).map((lodge) => (
            <button
              key={lodge.id}
              className={`rooms-tab ${lodge.id === lodgeId ? 'rooms-tab--active' : ''}`}
              onClick={() => setLodgeId(lodge.id)}
            >
              {lodge.name}
            </button>
          ))}
        </div>
      </div>

      <StateView loading={loading} error={error} empty={rooms?.length === 0} emptyMessage="Aún no hay cuartos publicados.">
        <div className="rooms-grid">
          {(rooms ?? []).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </StateView>

      <p style={{ marginTop: 26, textAlign: 'center', fontSize: 12.5, color: 'var(--muted-2)' }}>
        Valores por noche en pesos chilenos, desayuno incluido.
      </p>
    </section>
  );
}
