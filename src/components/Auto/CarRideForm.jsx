import { useState } from 'react';
import { Car, Send, Clock, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../Common';
import { DAYS } from '../../data/beds';

const CarRideForm = () => {
  const { currentUser, addCarRide } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    departureDate: DAYS[0].id,
    departureTime: '09:00',
    flexibleDeparture: false,
    departureTimeEnd: '10:00',
    seatsOutbound: 2,
    returnDate: DAYS[3].id,
    returnTime: '16:00',
    flexibleReturn: false,
    returnTimeEnd: '17:00',
    seatsReturn: 2,
    startingPoint: '',
    note: '',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      await addCarRide({
        departureDate: form.departureDate,
        departureTime: form.departureTime,
        departureTimeEnd: form.flexibleDeparture ? form.departureTimeEnd : null,
        seatsOutbound: form.seatsOutbound,
        returnDate: form.returnDate,
        returnTime: form.returnTime,
        returnTimeEnd: form.flexibleReturn ? form.returnTimeEnd : null,
        seatsReturn: form.seatsReturn,
        startingPoint: form.startingPoint.trim(),
        note: form.note.trim(),
      });
      // Reset form
      setForm({
        departureDate: DAYS[0].id,
        departureTime: '09:00',
        flexibleDeparture: false,
        departureTimeEnd: '10:00',
        seatsOutbound: 2,
        returnDate: DAYS[3].id,
        returnTime: '16:00',
        flexibleReturn: false,
        returnTimeEnd: '17:00',
        seatsReturn: 2,
        startingPoint: '',
        note: '',
      });
    } catch (error) {
      console.error('Errore creazione passaggio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Card className="bg-gray-50">
        <Card.Body className="text-center py-6">
          <p className="text-gray-500">Accedi per offrire un passaggio</p>
        </Card.Body>
      </Card>
    );
  }

  const SeatsStepper = ({ value, onChange }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-lg font-bold text-gray-800 w-6 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(7, value + 1))}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <Card>
      <Card.Header className="flex items-center gap-2">
        <Car className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">Offri un passaggio</h3>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Body className="space-y-5">
          {/* Sezione Andata */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              Andata
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giorno</label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => updateField('departureDate', day.id)}
                      className={`p-2 rounded-lg text-sm text-center transition-all ${
                        form.departureDate === day.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {day.shortLabel}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Orario partenza
                </label>
                <input
                  type="time"
                  value={form.departureTime}
                  onChange={(e) => updateField('departureTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.flexibleDeparture}
                  onChange={(e) => updateField('flexibleDeparture', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Orario flessibile
              </label>
              {form.flexibleDeparture && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fino alle
                  </label>
                  <input
                    type="time"
                    value={form.departureTimeEnd}
                    onChange={(e) => updateField('departureTimeEnd', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Posti extra</label>
                <SeatsStepper
                  value={form.seatsOutbound}
                  onChange={(v) => updateField('seatsOutbound', v)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Sezione Ritorno */}
          <div>
            <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              Ritorno
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giorno</label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => updateField('returnDate', day.id)}
                      className={`p-2 rounded-lg text-sm text-center transition-all ${
                        form.returnDate === day.id
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Orario ritorno
                </label>
                <input
                  type="time"
                  value={form.returnTime}
                  onChange={(e) => updateField('returnTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.flexibleReturn}
                  onChange={(e) => updateField('flexibleReturn', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Orario flessibile
              </label>
              {form.flexibleReturn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fino alle
                  </label>
                  <input
                    type="time"
                    value={form.returnTimeEnd}
                    onChange={(e) => updateField('returnTimeEnd', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Posti extra</label>
                <SeatsStepper
                  value={form.seatsReturn}
                  onChange={(v) => updateField('seatsReturn', v)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Punto di partenza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Punto di partenza (opzionale)
            </label>
            <input
              type="text"
              value={form.startingPoint}
              onChange={(e) => updateField('startingPoint', e.target.value)}
              placeholder="Es: Padova, zona Stazione"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (opzionale)
            </label>
            <textarea
              value={form.note}
              onChange={(e) => updateField('note', e.target.value)}
              placeholder="Es: Ho spazio per gli sci nel portabagagli"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </Card.Body>
        <Card.Footer>
          <Button type="submit" loading={loading} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Offri passaggio
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default CarRideForm;
