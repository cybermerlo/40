import { useState } from 'react';
import { User, Users, Check, X } from 'lucide-react';
import { BEDS, COMFORT_LEVELS } from '../../data/beds';
import { useApp } from '../../context/AppContext';
import { Avatar, Button, ComfortBadge, Modal } from '../Common';

const BedSlot = ({ bedId, night }) => {
  const bed = BEDS[bedId];
  const { currentUser, bookings, users, addBooking, deleteBooking, getAvailableSpots } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSpots, setSelectedSpots] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!bed) return null;

  // Trova prenotazioni per questo letto e notte
  const bedBookings = bookings.filter((b) => b.bedId === bedId && b.night === night);
  const availableSpots = getAvailableSpots(bedId, night, bed.posti);
  const isFullyBooked = availableSpots <= 0;

  // Verifica se l'utente corrente ha già prenotato questo letto
  const userBooking = bedBookings.find((b) => b.userId === currentUser?.id);
  const hasUserBooked = !!userBooking;

  // Utenti che hanno prenotato
  const bookedUsers = bedBookings.map((b) => ({
    ...users.find((u) => u.id === b.userId),
    spots: b.spots || 1,
    bookingId: b.id,
  })).filter((u) => u.id);

  const handleBook = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await addBooking({
        bedId,
        night,
        spots: selectedSpots,
      });
      setShowModal(false);
    } catch (error) {
      console.error('Errore prenotazione:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!userBooking) return;
    setLoading(true);
    try {
      await deleteBooking(userBooking.id);
    } catch (error) {
      console.error('Errore cancellazione:', error);
    } finally {
      setLoading(false);
    }
  };

  const comfort = COMFORT_LEVELS[bed.comfort];

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
                  {user.nome} {user.cognome}
                </span>
                {user.spots > 1 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.spots} posti
                  </span>
                )}
                {user.id === currentUser?.id && (
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Cancella prenotazione"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Azioni */}
        {currentUser && !hasUserBooked && !isFullyBooked && (
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="sm"
            className="w-full"
          >
            Prenota
          </Button>
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
        title="Prenota posto"
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-800">{bed.tipo}</p>
            <p className="text-sm text-gray-500">{bed.stanza} - {BEDS[bedId]?.baita === 'A' ? 'Antica Patta' : 'Nuova Forza'}</p>
          </div>

          {/* Selezione posti (per letti matrimoniali) */}
          {bed.canBookSingle && bed.posti > 1 && availableSpots > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quanti posti vuoi prenotare?
              </label>
              <div className="flex gap-2">
                {[...Array(Math.min(availableSpots, bed.posti))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setSelectedSpots(i + 1)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedSpots === i + 1
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Stai prenotando <strong>{selectedSpots}</strong> {selectedSpots === 1 ? 'posto' : 'posti'} per la notte del{' '}
              <strong>{night === '2026-02-20' ? 'Venerdì 20' : 'Sabato 21'} Febbraio</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button
              onClick={handleBook}
              loading={loading}
              className="flex-1"
            >
              Conferma
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BedSlot;
