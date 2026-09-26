import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="section container" style={{ textAlign: 'center', paddingTop: 160 }}>
      <span className="eyebrow-script">perdido en el desierto</span>
      <h2>Esta página no existe</h2>
      <p style={{ margin: '14px auto 24px' }}>Vuelve al inicio para ver nuestros hospedajes y cuartos.</p>
      <Link to="/" className="btn btn-solid">
        Volver al inicio
      </Link>
    </section>
  );
}
