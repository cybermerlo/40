import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bed, Calendar, LogOut, Edit2, Trash2, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BEDS, NIGHTS, DAYS, DAY_PERIODS } from '../data/beds';
import { BAITE } from '../data/baite';
import { Avatar, Button, Card, Modal, ComfortBadge } from '../components/Common';
import { getDisplayName } from '../utils/helpers';
import { AvatarPicker } from '../components/Auth';

const Profilo = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    updateCurrentUser,
    bookings,
    dayVisits,
    deleteBooking,
    deleteDayVisit,
    getBookingsForUser,
    getDayVisitsForUser,
  } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    avatarType: currentUser?.avatarType || 'dicebear',
    avatarId: currentUser?.avatarId || 'adventurer',
  });
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userBookings = getBookingsForUser(currentUser.id);
  const userVisits = getDayVisitsForUser(currentUser.id);

  const handleSaveAvatar = async () => {
    setSaving(true);
    try {
      await updateCurrentUser(editForm);
      setShowEditModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;
    await deleteBooking(bookingId);
  };

  const handleDeleteVisit = async (visitId) => {
    if (!confirm('Sei sicuro di voler rimuovere questa presenza?')) return;
    await deleteDayVisit(visitId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profilo Header */}
      <Card className="mb-8">
        <Card.Body className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar user={currentUser} size="xl" />
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {getDisplayName(currentUser)}
            </h1>
            {currentUser.isAdmin && (
              <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Organizzatore
              </span>
            )}
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-2" />
            Esci
          </Button>
        </Card.Body>
      </Card>

      {/* Le mie prenotazioni */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Bed className="w-6 h-6" />
        Le mie prenotazioni ({userBookings.length})
      </h2>

      {userBookings.length === 0 ? (
        <Card className="mb-8">
          <Card.Body className="text-center py-8">
            <Bed className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">Non hai ancora prenotato un posto letto</p>
            <Button onClick={() => navigate('/baite')}>
              Prenota ora
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid gap-4 mb-8">
          {userBookings.map((booking) => {
            const bed = BEDS[booking.bedId];
            const night = NIGHTS.find((n) => n.id === booking.night);
            const baita = BAITE[bed?.baita];

            return (
              <Card key={booking.id}>
                <Card.Body className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${baita?.colore || 'gray'}-100 flex items-center justify-center`}>
                    <MapPin className={`w-6 h-6 text-${baita?.colore || 'gray'}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {bed?.tipo} - {bed?.stanza}
                    </p>
                    <p className="text-sm text-gray-500">
                      {baita?.nome} • {night?.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <ComfortBadge comfort={bed?.comfort} size="sm" showLabel={false} />
                      <span className="text-xs text-gray-500">1 posto</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                    title="Cancella prenotazione"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Le mie presenze */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Le mie presenze ({userVisits.length})
      </h2>

      {userVisits.length === 0 ? (
        <Card className="mb-8">
          <Card.Body className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">Non hai ancora indicato quando verrai</p>
            <Button onClick={() => navigate('/calendario')}>
              Indica presenza
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid gap-4 mb-8">
          {DAYS.map((day) => {
            const dayUserVisits = userVisits.filter((v) => v.date === day.id);
            if (dayUserVisits.length === 0) return null;

            return (
              <Card key={day.id}>
                <Card.Body>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">{day.label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dayUserVisits.map((visit) => {
                      const period = DAY_PERIODS.find((p) => p.id === visit.period);
                      return (
                        <div
                          key={visit.id}
                          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full"
                        >
                          <span className="font-medium">{period?.label}</span>
                          <button
                            onClick={() => handleDeleteVisit(visit.id)}
                            className="hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal modifica avatar */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifica avatar"
      >
        <div className="space-y-4">
          <AvatarPicker
            avatarType={editForm.avatarType}
            avatarId={editForm.avatarId}
            userName={getDisplayName(currentUser)}
            onChange={(avatarType, avatarId) => setEditForm({ avatarType, avatarId })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button onClick={handleSaveAvatar} loading={saving} className="flex-1">
              Salva
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profilo;
