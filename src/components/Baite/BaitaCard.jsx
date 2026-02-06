import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { BAITE } from '../../data/baite';
import { getBedsByBaita, getTotalSpotsByBaita, NIGHTS } from '../../data/beds';
import { useApp } from '../../context/AppContext';
import { Card, Avatar } from '../Common';

const BaitaCard = ({ baitaId }) => {
  const baita = BAITE[baitaId];
  const { bookings, users } = useApp();
  
  const beds = getBedsByBaita(baitaId);
  const totalSpots = getTotalSpotsByBaita(baitaId);
  
  // Calcola occupazione per entrambe le notti
  const getOccupiedSpots = (night) => {
    return bookings.filter(
      (b) => beds.some((bed) => bed.id === b.bedId) && b.night === night
    ).length;
  };

  // Utenti che hanno prenotato
  const bookedUserIds = [...new Set(
    bookings
      .filter((b) => beds.some((bed) => bed.id === b.bedId))
      .map((b) => b.userId)
  )];
  const bookedUsers = bookedUserIds.map((id) => users.find((u) => u.id === id)).filter(Boolean);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-700',
    emerald: 'from-emerald-500 to-emerald-700',
  };

  return (
    <Card hover className="group">
      <Link to={`/baite/${baitaId}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={baita.mainImage}
            alt={baita.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${colorClasses[baita.colore]} opacity-40`} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{baita.nome}</h3>
            <p className="text-white/90 text-sm drop-shadow">{baita.soprannome}</p>
          </div>
        </div>

        {/* Content */}
        <Card.Body>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{baita.descrizione}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{totalSpots} posti</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(baita.googleMapsUrl, '_blank', 'noopener,noreferrer');
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Mappa</span>
            </button>
          </div>

          {/* Occupazione per notte */}
          <div className="space-y-2 mb-4">
            {NIGHTS.map((night) => {
              const occupied = getOccupiedSpots(night.id);
              const percentage = (occupied / totalSpots) * 100;
              return (
                <div key={night.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{night.shortLabel}</span>
                    <span className="font-medium">
                      {occupied}/{totalSpots} occupati
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentage >= 100 ? 'bg-red-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Utenti prenotati */}
          {bookedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Chi viene:</span>
              <div className="flex -space-x-2">
                {bookedUsers.slice(0, 5).map((user) => (
                  <Avatar key={user.id} user={user} size="xs" className="ring-2 ring-white" />
                ))}
                {bookedUsers.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                    +{bookedUsers.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{baita.caratteristiche.length} caratteristiche</span>
          <span className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Vedi dettagli
            <ArrowRight className="w-4 h-4" />
          </span>
        </Card.Footer>
      </Link>
    </Card>
  );
};

export default BaitaCard;
