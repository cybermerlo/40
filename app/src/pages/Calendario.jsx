import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Sunrise, Sun, Moon, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAYS, DAY_PERIODS } from '../data/beds';
import { Card, Avatar, Button, Modal } from '../components/Common';
import { groupBy } from '../utils/helpers';

const TIME_SLOTS = [
  { id: 'mattina', label: 'Mattina', time: '8:00 - 12:00', icon: Sunrise },
  { id: 'pranzo', label: 'Pranzo', time: '12:00 - 14:00', icon: Utensils },
  { id: 'pomeriggio', label: 'Pomeriggio', time: '14:00 - 18:00', icon: Sun },
  { id: 'cena', label: 'Cena', time: '19:00 - 21:00', icon: Utensils },
  { id: 'sera', label: 'Sera', time: '21:00+', icon: Moon },
];

const Calendario = () => {
  const { 
    activities, 
    scheduledActivities, 
    users, 
    dayVisits, 
    currentUser,
    addDayVisit,
    deleteDayVisit,
    getDayVisitsForDate 
  } = useApp();
  
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Raggruppa attività schedulate per giorno
  const activitiesByDay = groupBy(scheduledActivities, 'date');

  // Funzione per ottenere lo slot temporale da un orario
  const getSlotFromTime = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'mattina';
    if (hour < 14) return 'pranzo';
    if (hour < 18) return 'pomeriggio';
    if (hour < 21) return 'cena';
    return 'sera';
  };

  // Verifica se l'utente ha indicato presenza per un giorno
  const getUserPresence = (date) => {
    return dayVisits.filter(v => v.userId === currentUser?.id && v.date === date);
  };

  // Toggle presenza
  const handleTogglePresence = async (date, period) => {
    const existing = dayVisits.find(
      v => v.userId === currentUser?.id && v.date === date && v.period === period
    );
    if (existing) {
      await deleteDayVisit(existing.id);
    } else {
      await addDayVisit({ date, period });
    }
  };

  // Chi viene in un giorno
  const getVisitorsForDay = (date) => {
    const visits = getDayVisitsForDate(date);
    const uniqueUserIds = [...new Set(visits.map(v => v.userId))];
    return uniqueUserIds.map(id => users.find(u => u.id === id)).filter(Boolean);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendario</h1>
        <p className="text-gray-600">
          Il programma dei tre giorni insieme
        </p>
      </div>

      {/* Legenda */}
      <Card className="mb-6">
        <Card.Body className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">Indica quando vieni:</span>
          {currentUser ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDay(DAYS[0].id);
                setShowPresenceModal(true);
              }}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Gestisci presenza
            </Button>
          ) : (
            <span className="text-gray-500">Accedi per indicare la tua presenza</span>
          )}
        </Card.Body>
      </Card>

      {/* Calendario a 3 colonne */}
      <div className="grid md:grid-cols-3 gap-6">
        {DAYS.map((day, dayIndex) => {
          const dayActivities = activitiesByDay[day.id] || [];
          const visitors = getVisitorsForDay(day.id);
          const userPresence = getUserPresence(day.id);
          const isUserPresent = userPresence.length > 0;
          
          return (
            <Card
              key={day.id}
              className={dayIndex === 1 ? 'ring-2 ring-amber-400' : ''}
            >
              {/* Day Header */}
              <Card.Header className={`${
                dayIndex === 1 ? 'bg-amber-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{day.shortLabel}</h2>
                    <p className="text-sm text-gray-500">
                      {day.id === '2026-02-21' ? '🎂 Compleanno!' : day.label.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                  {isUserPresent && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                      Ci sei!
                    </span>
                  )}
                </div>
              </Card.Header>

              <Card.Body className="space-y-4">
                {/* Chi viene */}
                {visitors.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Chi viene</p>
                    <div className="flex flex-wrap gap-1">
                      {visitors.slice(0, 8).map(user => (
                        <Avatar key={user.id} user={user} size="xs" />
                      ))}
                      {visitors.length > 8 && (
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          +{visitors.length - 8}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Time slots con attività */}
                <div className="space-y-3">
                  {TIME_SLOTS.map(slot => {
                    const slotActivities = dayActivities.filter(
                      sa => getSlotFromTime(sa.time) === slot.id
                    );
                    const SlotIcon = slot.icon;

                    return (
                      <div key={slot.id} className="border-l-2 border-gray-200 pl-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <SlotIcon className="w-4 h-4" />
                          <span className="font-medium">{slot.label}</span>
                          <span className="text-xs">({slot.time})</span>
                        </div>
                        
                        {slotActivities.length > 0 ? (
                          <div className="space-y-2">
                            {slotActivities.map(sa => {
                              const activity = activities.find(a => a.id === sa.activityId);
                              if (!activity) return null;
                              return (
                                <div
                                  key={sa.id}
                                  className="bg-blue-50 rounded-lg p-2"
                                >
                                  <p className="font-medium text-blue-800 text-sm">
                                    {sa.time} - {activity.title}
                                  </p>
                                  {activity.description && (
                                    <p className="text-xs text-blue-600 line-clamp-1">
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Nessuna attività programmata
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>

              {/* Bottone presenza */}
              {currentUser && (
                <Card.Footer>
                  <Button
                    variant={isUserPresent ? 'secondary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedDay(day.id);
                      setShowPresenceModal(true);
                    }}
                  >
                    {isUserPresent ? 'Modifica presenza' : 'Indica presenza'}
                  </Button>
                </Card.Footer>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal presenza */}
      <Modal
        isOpen={showPresenceModal}
        onClose={() => setShowPresenceModal(false)}
        title="Indica quando vieni"
      >
        <div className="space-y-4">
          {/* Day selector */}
          <div className="flex gap-2">
            {DAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  selectedDay === day.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {day.shortLabel}
              </button>
            ))}
          </div>

          {selectedDay && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Seleziona i momenti in cui sarai presente:
              </p>
              {DAY_PERIODS.map(period => {
                const isPresent = dayVisits.some(
                  v => v.userId === currentUser?.id && v.date === selectedDay && v.period === period.id
                );
                return (
                  <button
                    key={period.id}
                    onClick={() => handleTogglePresence(selectedDay, period.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      isPresent
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {period.id === 'mattina' && '🌅'}
                        {period.id === 'pomeriggio' && '☀️'}
                        {period.id === 'sera' && '🌙'}
                      </span>
                      <div className="text-left">
                        <p className="font-medium">{period.label}</p>
                        <p className="text-sm text-gray-500">{period.time}</p>
                      </div>
                    </div>
                    {isPresent && (
                      <span className="text-emerald-600 font-medium">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => setShowPresenceModal(false)}
          >
            Chiudi
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendario;
