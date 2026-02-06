import { useState } from 'react';
import { Lightbulb, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityCard, ActivityForm } from '../components/Activities';
import { Card, Modal, Button } from '../components/Common';
import { DAYS } from '../data/beds';
import { sortByCreatedAt } from '../utils/helpers';

const Attivita = () => {
  const { activities, scheduledActivities, scheduleActivity, isAdmin } = useApp();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: DAYS[1].id,
    time: '10:00',
  });
  const [loading, setLoading] = useState(false);

  // Ordina per likes (più popolari) o per data
  const [sortBy, setSortBy] = useState('likes'); // 'likes' | 'recent'
  
  const sortedActivities = sortBy === 'likes'
    ? [...activities].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    : sortByCreatedAt(activities);

  // Attività non ancora schedulate
  const unscheduledActivities = sortedActivities.filter(
    (a) => !scheduledActivities.some((sa) => sa.activityId === a.id)
  );

  // Attività già schedulate
  const scheduled = sortedActivities.filter(
    (a) => scheduledActivities.some((sa) => sa.activityId === a.id)
  );

  const handleSchedule = (activity) => {
    setSelectedActivity(activity);
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = async () => {
    if (!selectedActivity) return;
    setLoading(true);
    try {
      await scheduleActivity(selectedActivity.id, {
        date: scheduleForm.date,
        time: scheduleForm.time,
      });
      setShowScheduleModal(false);
      setSelectedActivity(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bacheca Attività</h1>
        <p className="text-gray-600">
          Proponi cosa fare durante i tre giorni insieme!
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
                Proponi qualsiasi attività: ciaspolate, giochi, serate film, tornei...
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Lista proposte */}
        <div className="lg:col-span-2">
          {/* Sort */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Proposte ({activities.length})
            </h2>
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
                  Nessuna proposta ancora. Sii il primo a proporre un'attività!
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Non schedulate */}
              {unscheduledActivities.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Da programmare
                  </h3>
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
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-8">
                    In calendario
                  </h3>
                  {scheduled.map((activity) => {
                    const schedule = scheduledActivities.find((sa) => sa.activityId === activity.id);
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

      {/* Modal per schedulare (solo admin) */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Programma attività"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">{selectedActivity.title}</h4>
              {selectedActivity.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedActivity.description}</p>
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
                    onClick={() => setScheduleForm((p) => ({ ...p, date: day.id }))}
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
                onChange={(e) => setScheduleForm((p) => ({ ...p, time: e.target.value }))}
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
              <Button onClick={handleConfirmSchedule} loading={loading} className="flex-1">
                Conferma
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Attivita;
