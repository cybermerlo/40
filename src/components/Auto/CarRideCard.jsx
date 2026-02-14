import { useState } from 'react';
import { Trash2, MapPin, Clock, Users, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar, Button } from '../Common';
import { DAYS } from '../../data/beds';
import { formatDate, getDisplayName } from '../../utils/helpers';

const DirectionSection = ({ label, color, date, time, timeEnd, seats, passengers, users, currentUser, isDriver, rideId, direction, onJoin, onLeave, loading }) => {
  const day = DAYS.find((d) => d.id === date);
  const occupied = passengers.length;
  const isFull = occupied >= seats;
  const isPassenger = currentUser && passengers.includes(currentUser.id);
  const passengerUsers = passengers.map((id) => users.find((u) => u.id === id)).filter(Boolean);
  const progressPercent = seats > 0 ? (occupied / seats) * 100 : 0;

  const colorClasses = {
    emerald: {
      label: 'text-emerald-700 bg-emerald-50',
      bar: 'bg-emerald-500',
      barBg: 'bg-emerald-100',
    },
    blue: {
      label: 'text-blue-700 bg-blue-50',
      bar: 'bg-blue-500',
      barBg: 'bg-blue-100',
    },
  };

  const c = colorClasses[color];

  return (
    <div className="flex-1">
      <div className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${c.label}`}>
        {label}
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">{day?.shortLabel || formatDate(date, 'EEE d')}</span>
          <span className="mx-1.5 text-gray-300">|</span>
          <Clock className="w-3.5 h-3.5 inline -mt-0.5 text-gray-400" />
          <span className="ml-1">
            {time}
            {timeEnd && <span className="text-gray-400"> ~ {timeEnd}</span>}
          </span>
        </div>

        {/* Posti */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {occupied}/{seats} {seats === 1 ? 'posto' : 'posti'}
            </span>
            {isFull && <span className="text-amber-600 font-medium">Completo</span>}
          </div>
          <div className={`h-1.5 rounded-full ${c.barBg}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${c.bar}`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Avatar passeggeri */}
        {passengerUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {passengerUsers.slice(0, 4).map((user) => (
                <Avatar key={user.id} user={user} size="xs" className="ring-2 ring-white" />
              ))}
              {passengerUsers.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ring-2 ring-white">
                  +{passengerUsers.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {passengerUsers.map((u) => u.nome).join(', ')}
            </span>
          </div>
        )}

        {/* Bottone azione */}
        {currentUser && !isDriver && (
          <div>
            {isPassenger ? (
              <Button
                variant="danger"
                size="xs"
                onClick={() => onLeave(rideId, direction)}
                loading={loading}
              >
                Scendi
              </Button>
            ) : isFull ? (
              <Button variant="secondary" size="xs" disabled>
                Completo
              </Button>
            ) : (
              <Button
                variant="success"
                size="xs"
                onClick={() => onJoin(rideId, direction)}
                loading={loading}
              >
                Sali!
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CarRideCard = ({ ride }) => {
  const { currentUser, users, deleteCarRide, joinCarRide, leaveCarRide, isAdmin } = useApp();
  const [loadingAction, setLoadingAction] = useState(null);

  const driver = users.find((u) => u.id === ride.userId);
  const isDriver = currentUser?.id === ride.userId;
  const canDelete = isDriver || isAdmin;

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo passaggio?')) return;
    await deleteCarRide(ride.id);
  };

  const handleJoin = async (rideId, direction) => {
    setLoadingAction(direction);
    try {
      await joinCarRide(rideId, direction);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLeave = async (rideId, direction) => {
    setLoadingAction(direction);
    try {
      await leaveCarRide(rideId, direction);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
      {/* Header: autista */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar user={driver} size="md" />
          <div>
            <h3 className="font-bold text-gray-800">
              {getDisplayName(driver) || 'Anonimo'}
            </h3>
            <p className="text-sm text-gray-500">Autista</p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Elimina"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sezioni Andata / Ritorno */}
      <div className="flex gap-4">
        <DirectionSection
          label="Andata"
          color="emerald"
          date={ride.departureDate}
          time={ride.departureTime}
          timeEnd={ride.departureTimeEnd}
          seats={ride.seatsOutbound}
          passengers={ride.passengersOutbound || []}
          users={users}
          currentUser={currentUser}
          isDriver={isDriver}
          rideId={ride.id}
          direction="outbound"
          onJoin={handleJoin}
          onLeave={handleLeave}
          loading={loadingAction === 'outbound'}
        />
        <div className="w-px bg-gray-200 self-stretch" />
        <DirectionSection
          label="Ritorno"
          color="blue"
          date={ride.returnDate}
          time={ride.returnTime}
          timeEnd={ride.returnTimeEnd}
          seats={ride.seatsReturn}
          passengers={ride.passengersReturn || []}
          users={users}
          currentUser={currentUser}
          isDriver={isDriver}
          rideId={ride.id}
          direction="return"
          onJoin={handleJoin}
          onLeave={handleLeave}
          loading={loadingAction === 'return'}
        />
      </div>

      {/* Punto di partenza */}
      {ride.startingPoint && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>Partenza da: <span className="font-medium">{ride.startingPoint}</span></span>
        </div>
      )}

      {/* Note */}
      {ride.note && (
        <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="whitespace-pre-wrap">{ride.note}</span>
        </div>
      )}

      {/* Data creazione */}
      <p className="text-xs text-gray-400 mt-3">
        {formatDate(ride.createdAt, 'dd MMM yyyy, HH:mm')}
      </p>
    </div>
  );
};

export default CarRideCard;
