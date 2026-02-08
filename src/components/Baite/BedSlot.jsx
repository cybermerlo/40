import { useState } from 'react';
import { User, Users, Check, X, AlertCircle } from 'lucide-react';
import { BEDS, COMFORT_LEVELS, NIGHTS, DAYS, DAY_PERIODS } from '../../data/beds';
import { useApp } from '../../context/AppContext';
import { Avatar, Button, ComfortBadge, Modal } from '../Common';
import { getDisplayName } from '../../utils/helpers';

// Mappa notte -> presenze automatiche suggerite
const NIGHT_TO_PRESENCE = {
  '2026-02-20': [
    { date: '2026-02-20', period: 'sera' },
    { date: '2026-02-21', period: 'mattina' },
    { date: '2026-02-21', period: 'pomeriggio' },
  ],
  '2026-02-21': [
    { date: '2026-02-21', period: 'sera' },
    { date: '2026-02-22', period: 'mattina' },
    { date: '2026-02-22', period: 'pomeriggio' },
  ],
  '2026-02-22': [
    { date: '2026-02-22', period: 'sera' },
    { date: '2026-02-23', period: 'mattina' },
  ],
};

const BedSlot = ({ bedId, night }) => {
  const bed = BEDS[bedId];
  const {
    currentUser,
    bookings,
    users,
    addBooking,
    deleteBooking,
    getAvailableSpots,
    getUserBookingForNight,
    addDayVisit,
    dayVisits,
    isAdmin,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  // Step del modal: 'confirm' = conferma prenotazione, 'presence' = selezione presenze
  const [modalStep, setModalStep] = useState('confirm');
  const [selectedPresences, setSelectedPresences] = useState([]);

  if (!bed) return null;

  // Trova prenotazioni per questo letto e notte
  const bedBookings = bookings.filter((b) => b.bedId === bedId && b.night === night);
  const availableSpots = getAvailableSpots(bedId, night, bed.posti);
  const isFullyBooked = availableSpots <= 0;

  // Verifica se l'utente corrente ha già prenotato questo letto
  const userBooking = bedBookings.find((b) => b.userId === currentUser?.id);
  const hasUserBooked = !!userBooking;

  // Verifica se l'utente ha già una prenotazione per questa notte (qualsiasi letto)
  const existingNightBooking = currentUser
    ? getUserBookingForNight(currentUser.id, night)
    : null;
  const hasBookedOtherBed = existingNightBooking && !hasUserBooked;

  // Utenti che hanno prenotato
  const bookedUsers = bedBookings
    .map((b) => ({
      ...users.find((u) => u.id === b.userId),
      bookingId: b.id,
    }))
    .filter((u) => u.id);

  const openBookingModal = () => {
    setBookingError(null);
    setModalStep('confirm');
    // Pre-seleziona le presenze suggerite in base alla notte prenotata
    const suggested = NIGHT_TO_PRESENCE[night] || [];
    const suggestedKeys = suggested.map((s) => `${s.date}_${s.period}`);
    // Aggiungi anche le presenze che l'utente ha già indicato
    const existingKeys = DAYS.flatMap((day) =>
      DAY_PERIODS.filter((period) =>
        dayVisits.some(
          (v) => v.userId === currentUser?.id && v.date === day.id && v.period === period.id
        )
      ).map((period) => `${day.id}_${period.id}`)
    );
    // Unione dei suggeriti + già esistenti (senza duplicati)
    setSelectedPresences([...new Set([...suggestedKeys, ...existingKeys])]);
    setShowModal(true);
  };

  const handleBook = async () => {
    if (!currentUser) return;
    setLoading(true);
    setBookingError(null);
    try {
      await addBooking({
        bedId,
        night,
      });
      // Passa allo step presenze
      setModalStep('presence');
    } catch (error) {
      setBookingError(error.message || 'Errore durante la prenotazione');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPresences = async () => {
    setLoading(true);
    try {
      // Itera su tutte le giornate e periodi selezionati
      for (const day of DAYS) {
        for (const period of DAY_PERIODS) {
          const key = `${day.id}_${period.id}`;
          const alreadyExists = dayVisits.some(
            (v) =>
              v.userId === currentUser?.id &&
              v.date === day.id &&
              v.period === period.id
          );
          if (selectedPresences.includes(key) && !alreadyExists) {
            await addDayVisit({ date: day.id, period: period.id });
          }
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Errore aggiunta presenze:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePresence = (key) => {
    setSelectedPresences((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCancel = async (bookingId) => {
    const targetId = bookingId || userBooking?.id;
    if (!targetId) return;
    if (bookingId && bookingId !== userBooking?.id) {
      if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;
    }
    setLoading(true);
    try {
      await deleteBooking(targetId);
    } catch (error) {
      console.error('Errore cancellazione:', error);
    } finally {
      setLoading(false);
    }
  };

  const comfort = COMFORT_LEVELS[bed.comfort];

  // Helper per label dei periodi
  const getPeriodLabel = (period) => {
    const p = DAY_PERIODS.find((dp) => dp.id === period);
    return p ? p.label : period;
  };

  const getDayLabel = (date) => {
    const d = DAYS.find((day) => day.id === date);
    return d ? d.shortLabel : date;
  };

  return (
    <>
      <div
        className={`p-4 rounded-xl border-2 transition-all ${
          isFullyBooked
            ? 'border-red-200 bg-red-50'
            : hasUserBooked
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-800">{bed.tipo}</h4>
            <p className="text-sm text-gray-500">{bed.stanza}</p>
          </div>
          <ComfortBadge comfort={bed.comfort} size="sm" />
        </div>

        {/* Posti */}
        <div className="flex items-center gap-2 mb-3">
          {bed.posti > 1 ? (
            <Users className="w-4 h-4 text-gray-400" />
          ) : (
            <User className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            {availableSpots}/{bed.posti} {bed.posti === 1 ? 'posto' : 'posti'} disponibili
          </span>
        </div>

        {/* Note */}
        {bed.note && (
          <p className="text-xs text-gray-500 mb-3 italic">{bed.note}</p>
        )}

        {/* Utenti prenotati */}
        {bookedUsers.length > 0 && (
          <div className="mb-3 space-y-2">
            {bookedUsers.map((user) => (
              <div
                key={user.bookingId}
                className="flex items-center gap-2 bg-white/80 rounded-lg p-2"
              >
                <Avatar user={user} size="sm" />
                <span className="text-sm font-medium flex-1">
                  {getDisplayName(user)}
                </span>
                {(user.id === currentUser?.id || isAdmin) && (
                  <button
                    onClick={() => handleCancel(user.bookingId)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 p-1"
                    title={user.id === currentUser?.id ? 'Cancella prenotazione' : 'Rimuovi prenotazione (admin)'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Azioni */}
        {currentUser && !hasUserBooked && !isFullyBooked && !hasBookedOtherBed && (
          <Button
            onClick={openBookingModal}
            variant="primary"
            size="sm"
            className="w-full"
          >
            Prenota
          </Button>
        )}

        {currentUser && hasBookedOtherBed && !isFullyBooked && (
          <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 rounded-lg p-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Hai già un letto per questa notte</span>
          </div>
        )}

        {hasUserBooked && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
            <Check className="w-5 h-5" />
            <span>Prenotato!</span>
          </div>
        )}

        {isFullyBooked && !hasUserBooked && (
          <p className="text-center text-red-500 font-medium text-sm">Completo</p>
        )}
      </div>

      {/* Modal prenotazione */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalStep === 'confirm' ? 'Prenota posto letto' : 'Indica la tua presenza'}
      >
        <div className="space-y-4">
          {modalStep === 'confirm' && (
            <>
              <div>
                <p className="font-medium text-gray-800">{bed.tipo}</p>
                <p className="text-sm text-gray-500">
                  {bed.stanza} -{' '}
                  {BEDS[bedId]?.baita === 'A' ? 'Antica Patta' : 'Nuova Forza'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Stai prenotando <strong>1 posto</strong> per dormire la notte del{' '}
                  <strong>
                    {night === '2026-02-20' ? 'Venerdì 20' : 'Sabato 21'} Febbraio
                  </strong>
                  . Ogni persona prenota solo per sé.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Nota:</strong> Prenotare un letto significa che dormirai qui
                  la notte. Se vieni solo durante il giorno, non prenotare un letto ma
                  indica la tua presenza nella sezione Programma.
                </p>
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {bookingError}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button onClick={handleBook} loading={loading} className="flex-1">
                  Conferma
                </Button>
              </div>
            </>
          )}

          {modalStep === 'presence' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-800">
                  Posto prenotato con successo! Ora indica in quali momenti sarai
                  presente durante il weekend. Abbiamo pre-selezionato i periodi
                  in cui sarai sicuramente lì dato che dormi la notte.
                </p>
              </div>

              <div className="space-y-4">
                {DAYS.map((day) => {
                  const suggestedKeys = (NIGHT_TO_PRESENCE[night] || []).map(
                    (s) => `${s.date}_${s.period}`
                  );

                  return (
                    <div key={day.id}>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {day.label}
                      </p>
                      <div className="space-y-1.5">
                        {DAY_PERIODS.map((period) => {
                          const key = `${day.id}_${period.id}`;
                          const isSelected = selectedPresences.includes(key);
                          const isSuggested = suggestedKeys.includes(key);
                          const alreadyExists = dayVisits.some(
                            (v) =>
                              v.userId === currentUser?.id &&
                              v.date === day.id &&
                              v.period === period.id
                          );

                          return (
                            <button
                              key={key}
                              onClick={() => !alreadyExists && togglePresence(key)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all ${
                                alreadyExists
                                  ? 'border-gray-200 bg-gray-50 opacity-60'
                                  : isSelected
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              disabled={alreadyExists}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {period.id === 'mattina' && '🌅'}
                                  {period.id === 'pomeriggio' && '☀️'}
                                  {period.id === 'sera' && '🌙'}
                                </span>
                                <div className="text-left">
                                  <p className="font-medium text-sm">
                                    {period.label}
                                    <span className="text-gray-400 font-normal ml-1">
                                      ({period.time})
                                    </span>
                                  </p>
                                  {alreadyExists && (
                                    <p className="text-xs text-gray-500">
                                      Già indicata
                                    </p>
                                  )}
                                  {isSuggested && !alreadyExists && (
                                    <p className="text-xs text-blue-500">
                                      Suggerito (dormi qui)
                                    </p>
                                  )}
                                </div>
                              </div>
                              {(isSelected || alreadyExists) && (
                                <span className="text-emerald-600 font-medium">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleConfirmPresences}
                loading={loading}
                className="w-full"
              >
                Conferma presenze
              </Button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BedSlot;
