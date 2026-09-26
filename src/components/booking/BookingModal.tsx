import { useEffect } from 'react';
import { ArrowRight, ShieldCheck, X } from 'lucide-react';
import { LODGES } from '../../content/lodges';
import { useBookingForm } from '../../hooks/useBookingForm';
import { useRooms } from '../../hooks/useRooms';
import { useUi } from '../../hooks/useUi';
import { formatClp, formatDateShort, nightsBetween, priceForGuests } from '../../lib/format';
import type { LodgeId } from '../../types/domain';
import { StateView } from '../common/StateView';
import './BookingModal.css';

export function BookingModal() {
  const { booking, closeBooking } = useUi();
  const form = useBookingForm('vientos');
  const { data: rooms, loading: roomsLoading, error: roomsError } = useRooms(form.values.lodgeId);
  const selectedRoom = rooms?.find((r) => r.id === form.values.roomId);

  useEffect(() => {
    if (booking) {
      form.reset(booking.lodgeId, booking.roomId, {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
      });
    }
    // Re-seed the form only when a NEW open() call arrives, not on every render.
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [booking]);

  if (!booking) return null;

  const nights = nightsBetween(form.values.checkIn, form.values.checkOut) || 1;
  const nightly = selectedRoom ? priceForGuests(selectedRoom.tiers, form.values.guests) : 0;
  const total = nightly * nights;

  function handleLodgeChange(lodgeId: LodgeId) {
    form.setField('lodgeId', lodgeId);
    form.setField('roomId', '');
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) closeBooking();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await form.submit(selectedRoom);
  }

  return (
    <div className="booking-modal" onMouseDown={handleBackdropClick}>
      <div className="booking-modal__panel">
        <button className="booking-modal__close" aria-label="Cerrar" onClick={closeBooking}>
          <X size={17} />
        </button>

        {form.status === 'success' && form.confirmation ? (
          <div className="booking-confirmation">
            <span className="eyebrow-script">te esperamos</span>
            <h2>¡Reserva enviada!</h2>
            <p style={{ margin: '14px auto 0', maxWidth: '46ch' }}>
              Código <strong>{form.confirmation.code}</strong>. Te contactaremos por correo o teléfono para
              confirmar el pago y los últimos detalles.
            </p>
            <button className="btn btn-solid" style={{ marginTop: 26 }} onClick={closeBooking}>
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="booking-modal__title">¿Dónde quieres dormir?</h2>

            <div className="booking-modal__grid">
              <div>
                <div className="booking-form__section">
                  <span className="booking-field__label">Hospedaje</span>
                  <div className="rooms-tabs" style={{ marginTop: 0 }}>
                    {Object.values(LODGES).map((lodge) => (
                      <button
                        type="button"
                        key={lodge.id}
                        className={`rooms-tab ${lodge.id === form.values.lodgeId ? 'rooms-tab--active' : ''}`}
                        onClick={() => handleLodgeChange(lodge.id)}
                      >
                        {lodge.name}
                      </button>
                    ))}
                  </div>

                  <StateView loading={roomsLoading} error={roomsError} empty={rooms?.length === 0} emptyMessage="Sin cuartos disponibles.">
                    <div className="room-picker">
                      {(rooms ?? []).map((room) => (
                        <button
                          type="button"
                          key={room.id}
                          className={`room-picker__option ${room.id === form.values.roomId ? 'room-picker__option--selected' : ''}`}
                          onClick={() => form.setField('roomId', room.id)}
                        >
                          {room.name}
                          <span className="room-picker__price">{formatClp(priceForGuests(room.tiers, form.values.guests))}</span>
                        </button>
                      ))}
                    </div>
                  </StateView>
                </div>

                <div className="booking-form__section booking-form__row">
                  <label className="booking-field">
                    <span className="booking-field__label">Llegada</span>
                    <input
                      type="date"
                      required
                      value={form.values.checkIn}
                      onChange={(e) => form.setField('checkIn', e.target.value)}
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Salida</span>
                    <input
                      type="date"
                      required
                      value={form.values.checkOut}
                      onChange={(e) => form.setField('checkOut', e.target.value)}
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Huéspedes</span>
                    <select value={form.values.guests} onChange={(e) => form.setField('guests', Number(e.target.value))}>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'huésped' : 'huéspedes'}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span />
                </div>

                <div className="booking-form__section booking-form__row">
                  <label className="booking-field">
                    <span className="booking-field__label">Nombre</span>
                    <input
                      required
                      value={form.values.firstName}
                      onChange={(e) => form.setField('firstName', e.target.value)}
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Apellido</span>
                    <input
                      required
                      value={form.values.lastName}
                      onChange={(e) => form.setField('lastName', e.target.value)}
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Correo</span>
                    <input
                      type="email"
                      required
                      value={form.values.email}
                      onChange={(e) => form.setField('email', e.target.value)}
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Teléfono</span>
                    <input
                      type="tel"
                      required
                      value={form.values.phone}
                      onChange={(e) => form.setField('phone', e.target.value)}
                    />
                  </label>
                </div>

                <div className="booking-form__section">
                  <label className="booking-field">
                    <span className="booking-field__label">Notas (opcional)</span>
                    <textarea
                      rows={3}
                      value={form.values.notes}
                      onChange={(e) => form.setField('notes', e.target.value)}
                    />
                  </label>

                  {/* Honeypot: hidden from people, catnip for bots. Any value here silently drops the submission. */}
                  <div className="booking-honeypot" aria-hidden="true">
                    <label>
                      Empresa
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.values.company}
                        onChange={(e) => form.setField('company', e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="booking-terms">
                    <input
                      type="checkbox"
                      checked={form.values.acceptedTerms}
                      onChange={(e) => form.setField('acceptedTerms', e.target.checked)}
                    />
                    Acepto la política de cancelación (sin costo hasta 48 h antes de la llegada).
                  </label>

                  {form.errorMessage && <p className="booking-error">{form.errorMessage}</p>}

                  <button type="submit" className="btn btn-solid" disabled={form.status === 'submitting'}>
                    {form.status === 'submitting' ? 'Enviando…' : 'Confirmar reserva'}
                    <ArrowRight size={14} />
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--muted-2)' }}>
                    <ShieldCheck size={13} />
                    Cancelación sin costo hasta 48 h antes
                  </span>
                </div>
              </div>

              <aside className="booking-summary">
                <div
                  className="booking-summary__image"
                  style={selectedRoom?.coverImage ? { backgroundImage: `url("${selectedRoom.coverImage}")` } : undefined}
                />
                <div className="booking-summary__body">
                  <span className="booking-summary__name">{selectedRoom?.name ?? 'Elige un cuarto'}</span>
                  <span className="booking-summary__line">
                    {LODGES[form.values.lodgeId].name}
                  </span>
                  <span className="booking-summary__line">
                    {form.values.checkIn && form.values.checkOut
                      ? `${formatDateShort(form.values.checkIn)} → ${formatDateShort(form.values.checkOut)}`
                      : 'Elige tus fechas'}
                  </span>
                  <span className="booking-summary__line">
                    {formatClp(nightly)} × {nights} {nights === 1 ? 'noche' : 'noches'}
                  </span>
                  <span className="booking-summary__total">
                    Total
                    <strong>{formatClp(total)}</strong>
                  </span>
                </div>
              </aside>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
