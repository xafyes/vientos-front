import { LODGE_LIST } from '../../content/lodges';
import { LodgeCard } from './LodgeCard';
import './LodgesSection.css';

const SCRIPTS: Record<string, string> = {
  vientos: 'el principal',
  yareta: 'la casa',
};

export function LodgesSection() {
  return (
    <section id="hospedajes" className="section container">
      <div className="lodges">
        {LODGE_LIST.map((lodge) => (
          <LodgeCard key={lodge.id} lodge={lodge} script={SCRIPTS[lodge.id]} />
        ))}
      </div>
    </section>
  );
}
