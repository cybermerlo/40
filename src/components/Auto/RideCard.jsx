import { useState } from 'react';
import { MapPin, Clock, Calendar, Users, Trash2, UserPlus, UserMinus, Mountain, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar, Button } from '../Common';
import { formatDate } from '../../utils/helpers';
import { DAYS } from '../../data/beds';

const directionConfig = {
  andata: {
    label: 'Andata',
    sublabel: 'Verso la montagna',
    icon: Mountain,
    badgeClass: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
  },
  ritorno: {
    label: 'Ritorno',
    sublabel: 'Si torna a casa',
    icon: Home,
    badgeClass: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-600',
  },
};

const RideCard = ({ ride }) => {
  const { currentUser, users, joinRide, leaveRide, deleteRide, isAdmin } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const driver = users.find((u) => u.id === ride.driverId);
  const passengers = (ride.passengers || [])
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);
  const availableSeats = ride.totalSeats - (ride.passengers || []).length;
  const isFull = availableSeats <= 0;
  const isDriver = currentUser?.id === ride.driverId;
  const isPassenger = (ride.passengers || []).includes(currentUser?.id);
  const config = directionConfig[ride.direction] || directionConfig.andata;
  const DirectionIcon = config.icon;

  const dayInfo = DAYS.find((d) => d.id === ride.date);

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
      await joinRide(ride.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    setError('');
    try {
      await leaveRide(ride.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo passaggio?')) return;
    setLoading(true);
    try {
      await deleteRide(ride.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canDelete = isDriver || isAdmin;

  // Seat bar color
  const seatBarColor = isFull
    ? 'bg-red-400'
    : availableSeats === 1
      ? 'bg-amber-400'
      : 'bg-emerald-400';

  const seatTextColor = isFull
    ? 'text-red-600'
    : availableSeats === 1
      ? 'text-amber-600'
      : 'text-emerald-600';

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
      {/* Header: driver + direction badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar user={driver} size="md" />
          <div>
            <h3 className="font-bold text-gray-800">
              {driver?.nome || 'Anonimo'} {driver?.cognome || ''}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}>
              <DirectionIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Elimina"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Date and time */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{dayInfo?.label || ride.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            Ore {ride.time}
            {ride.timeFlexibility && (
              <span className="text-gray-400 ml-1">(flessibile: {ride.timeFlexibility})</span>
            )}
          </span>
        </div>
        {ride.departurePoint && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">
              {ride.direction === 'andata' ? 'Partenza: ' : 'Destinazione: '}
              {ride.departurePoint}
            </span>
          </div>
        )}
      </div>

      {/* Note */}
      {ride.note && (
        <p className="text-sm text-gray-500 italic mb-3">{ride.note}</p>
      )}

      {/* Seats indicator */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className={`font-medium ${seatTextColor}`}>
              {isFull ? 'Completo' : `${availableSeats} post${availableSeats === 1 ? 'o' : 'i'} disponibil${availableSeats === 1 ? 'e' : 'i'}`}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {(ride.passengers || []).length}/{ride.totalSeats}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${seatBarColor}`}
            style={{ width: `${Math.min(100, ((ride.passengers || []).length / ride.totalSeats) * 100)}%` }}
          />
        </div>
      </div>

      {/* Passengers */}
      {passengers.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400">Passeggeri:</span>
          <div className="flex -space-x-1">
            {passengers.slice(0, 5).map((user) => (
              <Avatar key={user.id} user={user} size="xs" className="ring-2 ring-white" />
            ))}
            {passengers.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ring-2 ring-white">
                +{passengers.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {passengers.map((u) => u.nome).join(', ')}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {formatDate(ride.createdAt, 'dd MMM yyyy, HH:mm')}
        </p>
        <div>
          {!currentUser ? (
            <span className="text-sm text-gray-400">Accedi per salire</span>
          ) : isDriver ? (
            <span className="text-sm text-gray-500 italic">Sei il guidatore</span>
          ) : isPassenger ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeave}
              loading={loading}
            >
              <UserMinus className="w-4 h-4 mr-1" />
              Scendo
            </Button>
          ) : isFull ? (
            <span className="text-sm text-gray-400 font-medium">Nessun posto</span>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={handleJoin}
              loading={loading}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Salgo!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
