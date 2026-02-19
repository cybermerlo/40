import { Car, Users, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CarRideCard, CarRideForm } from '../components/Auto';
import { Avatar, Card } from '../components/Common';
import { DAYS } from '../data/beds';
import { addTwoHours, getDisplayName } from '../utils/helpers';

const Auto = () => {
  const { carRides, users } = useApp();

  // Raggruppa ride per data di partenza, ordinate per orario
  const getRidesForDay = (dayId) => {
    return carRides
      .filter((r) => r.departureDate === dayId)
      .sort((a, b) => (a.departureTime || '').localeCompare(b.departureTime || ''));
  };

  const hasAnyRides = carRides.length > 0;

  // Prossimi arrivi alla baita (andata, orario stimato = partenza + 2h)
  const getUpcomingArrivals = () => {
    const now = new Date();
    return carRides
      .filter((r) => r.departureTime && r.departureDate)
      .map((r) => {
        const arrivalTime = addTwoHours(r.departureTime);
        const arrivalTimeEnd = r.departureTimeEnd ? addTwoHours(r.departureTimeEnd) : null;
        const arrivalDatetime = new Date(`${r.departureDate}T${arrivalTime}:00`);
        const driver = users.find((u) => u.id === r.userId);
        const day = DAYS.find((d) => d.id === r.departureDate);
        return { ride: r, arrivalDatetime, driver, arrivalTime, arrivalTimeEnd, day };
      })
      .filter((a) => !isNaN(a.arrivalDatetime) && a.arrivalDatetime > now)
      .sort((a, b) => a.arrivalDatetime - b.arrivalDatetime)
      .slice(0, 2);
  };

  const upcomingArrivals = getUpcomingArrivals();

  // Statistiche
  const totalSeatsOut = carRides.reduce((sum, r) => sum + (r.seatsOutbound || 0), 0);
  const totalPassengersOut = carRides.reduce((sum, r) => sum + (r.passengersOutbound || []).length, 0);
  const totalSeatsRet = carRides.reduce((sum, r) => sum + (r.seatsReturn || 0), 0);
  const totalPassengersRet = carRides.reduce((sum, r) => sum + (r.passengersReturn || []).length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Passaggi Auto</h1>
        <p className="text-gray-600">
          Organizza i passaggi per andare e tornare dalla montagna!
        </p>
        {hasAnyRides && (
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Car className="w-4 h-4" />
              {carRides.length} {carRides.length === 1 ? 'auto' : 'auto'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              Andata: {totalPassengersOut}/{totalSeatsOut}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              Ritorno: {totalPassengersRet}/{totalSeatsRet}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonna sinistra: Form + info */}
        <div className="lg:col-span-1">
          <CarRideForm />

          <Card className="mt-4">
            <Card.Body className="text-sm text-gray-600 space-y-2">
              <p className="flex items-start gap-2">
                <Car className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                Offri un passaggio indicando quando parti e quanti posti hai liberi. Gli altri potranno unirsi!
              </p>
              <p className="text-xs text-gray-400">
                La destinazione e' la montagna. Indica opzionalmente da dove parti per facilitare il ritrovo.
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Colonna destra: Lista passaggi */}
        <div className="lg:col-span-2">
          {/* Banner prossimi arrivi */}
          {upcomingArrivals.length > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Prossimi arrivi alle baite
              </p>
              <div className="space-y-2">
                {upcomingArrivals.map(({ ride, driver, arrivalTime, arrivalTimeEnd, day }) => (
                  <div key={ride.id} className="flex items-center gap-2">
                    <Avatar user={driver} size="xs" />
                    <span className="text-sm font-medium text-gray-800">
                      {getDisplayName(driver) || 'Anonimo'}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-sm text-amber-800">
                      ~{arrivalTime}
                      {arrivalTimeEnd && <span className="text-amber-600"> – ~{arrivalTimeEnd}</span>}
                    </span>
                    {day && (
                      <span className="text-xs text-gray-400">({day.shortLabel})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Passaggi disponibili ({carRides.length})
          </h2>

          {!hasAnyRides ? (
            <Card>
              <Card.Body className="text-center py-12">
                <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  Nessun passaggio offerto ancora. Sii il primo!
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-6">
              {DAYS.map((day) => {
                const dayRides = getRidesForDay(day.id);
                if (dayRides.length === 0) return null;
                return (
                  <div key={day.id}>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Partenza {day.shortLabel}
                    </h3>
                    <div className="space-y-4">
                      {dayRides.map((ride) => (
                        <CarRideCard key={ride.id} ride={ride} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Ride con date fuori dal range DAYS (safety) */}
              {carRides
                .filter((r) => !DAYS.some((d) => d.id === r.departureDate))
                .length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Altre date
                  </h3>
                  <div className="space-y-4">
                    {carRides
                      .filter((r) => !DAYS.some((d) => d.id === r.departureDate))
                      .map((ride) => (
                        <CarRideCard key={ride.id} ride={ride} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auto;
