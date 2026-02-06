import { useState } from 'react';
import {
  Calendar,
  Clock,
  Sunrise,
  Sun,
  Moon,
  Utensils,
  Lightbulb,
  TrendingUp,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAYS, DAY_PERIODS } from '../data/beds';
import { Card, Avatar, Button, Modal } from '../components/Common';
import { ActivityCard, ActivityForm } from '../components/Activities';
import { groupBy, sortByCreatedAt, getDisplayName } from '../utils/helpers';

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
    getDayVisitsForDate,
    scheduleActivity,
    isAdmin,
  } = useApp();

  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // --- Stato per la sezione attività ---
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: DAYS[1].id,
    time: '10:00',
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [sortBy, setSortBy] = useState('likes');

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
    return dayVisits.filter(
      (v) => v.userId === currentUser?.id && v.date === date
    );
  };

  // Toggle presenza
  const handleTogglePresence = async (date, period) => {
    const existing = dayVisits.find(
      (v) =>
        v.userId === currentUser?.id &&
        v.date === date &&
        v.period === period
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
    const uniqueUserIds = [...new Set(visits.map((v) => v.userId))];
    return uniqueUserIds
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean);
  };

  // --- Logica attività ---
  const sortedActivities =
    sortBy === 'likes'
      ? [...activities].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        )
      : sortByCreatedAt(activities);

  const unscheduledActivities = sortedActivities.filter(
    (a) => !scheduledActivities.some((sa) => sa.activityId === a.id)
  );

  const scheduled = sortedActivities.filter((a) =>
    scheduledActivities.some((sa) => sa.activityId === a.id)
  );

  const handleSchedule = (activity) => {
    setSelectedActivity(activity);
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = async () => {
    if (!selectedActivity) return;
    setScheduleLoading(true);
    try {
      await scheduleActivity(selectedActivity.id, {
        date: scheduleForm.date,
        time: scheduleForm.time,
      });
      setShowScheduleModal(false);
      setSelectedActivity(null);
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Programma e Attivita'
        </h1>
        <p className="text-gray-600">
          Il calendario dei tre giorni, le attivita' in programma e la tua
          presenza
        </p>
      </div>

      {/* Spiegazione presenza vs dormire */}
      <Card className="mb-6 border-2 border-blue-200">
        <Card.Body className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Indica la tua presenza</strong> per farci sapere quando
              sarai con noi durante le giornate. Questo serve per organizzare
              pasti, attivita' e logistica.
            </p>
            <p className="text-gray-500">
              Se hai gia' prenotato un posto letto, le presenze corrispondenti
              sono state impostate automaticamente. Qui puoi aggiungere o
              modificare i momenti in cui sarai presente, ad esempio se vieni
              solo in giornata senza dormire.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Gestisci presenza */}
      <Card className="mb-6">
        <Card.Body className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">
            Indica quando vieni:
          </span>
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
            <span className="text-gray-500">
              Accedi per indicare la tua presenza
            </span>
          )}
        </Card.Body>
      </Card>

      {/* ======= SEZIONE CALENDARIO ======= */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
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
              <Card.Header
                className={`${
                  dayIndex === 1 ? 'bg-amber-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {day.shortLabel}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {day.id === '2026-02-21'
                        ? 'Compleanno!'
                        : day.label
                            .split(' ')
                            .slice(0, 2)
                            .join(' ')}
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
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Chi viene ({visitors.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {visitors.slice(0, 8).map((user) => (
                        <div key={user.id} className="flex items-center gap-1" title={getDisplayName(user)}>
                          <Avatar user={user} size="xs" />
                        </div>
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
                  {TIME_SLOTS.map((slot) => {
                    const slotActivities = dayActivities.filter(
                      (sa) => getSlotFromTime(sa.time) === slot.id
                    );
                    const SlotIcon = slot.icon;

                    return (
                      <div
                        key={slot.id}
                        className="border-l-2 border-gray-200 pl-3"
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <SlotIcon className="w-4 h-4" />
                          <span className="font-medium">{slot.label}</span>
                          <span className="text-xs">({slot.time})</span>
                        </div>

                        {slotActivities.length > 0 ? (
                          <div className="space-y-2">
                            {slotActivities.map((sa) => {
                              const activity = activities.find(
                                (a) => a.id === sa.activityId
                              );
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
                            Nessuna attivita' programmata
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

      {/* ======= SEZIONE PROPOSTE ATTIVITÀ ======= */}
      <div className="border-t-2 border-gray-200 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bacheca Attivita'
          </h2>
          <p className="text-gray-600">
            Proponi cosa fare durante i tre giorni insieme! L'admin piazzera' le
            proposte nel calendario.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form proposta */}
          <div className="lg:col-span-1">
            <ActivityForm />

            {/* Info */}
            <Card className="mt-4">
              <Card.Body className="text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  Proponi qualsiasi attivita': ciaspolate, giochi, serate film,
                  tornei...
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Lista proposte */}
          <div className="lg:col-span-2">
            {/* Sort */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Proposte ({activities.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('likes')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'likes'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Popolari
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'recent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Recenti
                </button>
              </div>
            </div>

            {activities.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-12">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Nessuna proposta ancora. Sii il primo a proporre
                    un'attivita'!
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Non schedulate */}
                {unscheduledActivities.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Da programmare
                    </h4>
                    {unscheduledActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSchedule={isAdmin ? handleSchedule : undefined}
                      />
                    ))}
                  </>
                )}

                {/* Già schedulate */}
                {scheduled.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-8">
                      In calendario
                    </h4>
                    {scheduled.map((activity) => {
                      const schedule = scheduledActivities.find(
                        (sa) => sa.activityId === activity.id
                      );
                      const day = DAYS.find((d) => d.id === schedule?.date);
                      return (
                        <div key={activity.id} className="relative">
                          <div className="absolute -left-4 top-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-r-full">
                            {day?.shortLabel} {schedule?.time}
                          </div>
                          <ActivityCard activity={activity} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======= MODALS ======= */}

      {/* Modal presenza */}
      <Modal
        isOpen={showPresenceModal}
        onClose={() => setShowPresenceModal(false)}
        title="Indica quando vieni"
      >
        <div className="space-y-4">
          {/* Day selector */}
          <div className="flex gap-2">
            {DAYS.map((day) => (
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
              {DAY_PERIODS.map((period) => {
                const isPresent = dayVisits.some(
                  (v) =>
                    v.userId === currentUser?.id &&
                    v.date === selectedDay &&
                    v.period === period.id
                );
                return (
                  <button
                    key={period.id}
                    onClick={() =>
                      handleTogglePresence(selectedDay, period.id)
                    }
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

      {/* Modal per schedulare attività (solo admin) */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Programma attivita'"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">
                {selectedActivity.title}
              </h4>
              {selectedActivity.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedActivity.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giorno
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() =>
                      setScheduleForm((p) => ({ ...p, date: day.id }))
                    }
                    className={`p-3 rounded-lg text-center transition-all ${
                      scheduleForm.date === day.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {day.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orario
              </label>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(e) =>
                  setScheduleForm((p) => ({ ...p, time: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                onClick={handleConfirmSchedule}
                loading={scheduleLoading}
                className="flex-1"
              >
                Conferma
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
