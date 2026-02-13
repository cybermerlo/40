import { useState } from 'react';
import { Car, Mountain, Home, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../Common';
import { DAYS } from '../../data/beds';
import { cn } from '../../utils/helpers';

const RideForm = ({ onSuccess, onCancel }) => {
  const { addRide } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Which directions are selected
  const [directions, setDirections] = useState(['andata']);

  // Form data per direction
  const [andataData, setAndataData] = useState({
    date: '',
    time: '17:00',
    flexible: false,
    timeFrom: '16:00',
    timeTo: '18:00',
    departurePoint: '',
    totalSeats: 2,
    note: '',
  });

  const [ritornoData, setRitornoData] = useState({
    date: '',
    time: '14:00',
    flexible: false,
    timeFrom: '13:00',
    timeTo: '15:00',
    departurePoint: '',
    totalSeats: 2,
    note: '',
  });

  const toggleDirection = (dir) => {
    setDirections((prev) => {
      if (prev.includes(dir)) {
        if (prev.length === 1) return prev; // almeno uno deve essere selezionato
        return prev.filter((d) => d !== dir);
      }
      return [...prev, dir];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      for (const dir of directions) {
        const data = dir === 'andata' ? andataData : ritornoData;
        if (!data.date) {
          setError(`Seleziona una data per ${dir === 'andata' ? "l'andata" : 'il ritorno'}`);
          setLoading(false);
          return;
        }
        await addRide({
          direction: dir,
          date: data.date,
          time: data.time,
          timeFlexibility: data.flexible ? `${data.timeFrom}-${data.timeTo}` : null,
          departurePoint: data.departurePoint.trim(),
          totalSeats: data.totalSeats,
          note: data.note.trim(),
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Errore nella creazione del passaggio');
    } finally {
      setLoading(false);
    }
  };

  const renderDirectionForm = (direction, data, setData) => {
    const isAndata = direction === 'andata';
    return (
      <div className={cn(
        'rounded-lg border p-4 space-y-4',
        isAndata ? 'border-blue-200 bg-blue-50/30' : 'border-amber-200 bg-amber-50/30'
      )}>
        <div className="flex items-center gap-2">
          {isAndata ? (
            <Mountain className="w-5 h-5 text-blue-600" />
          ) : (
            <Home className="w-5 h-5 text-amber-600" />
          )}
          <h4 className="font-semibold text-gray-700">
            {isAndata ? 'Andata - Verso la montagna' : 'Ritorno - Si torna a casa'}
          </h4>
        </div>

        {/* Date selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giorno</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setData((prev) => ({ ...prev, date: day.id }))}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  data.date === day.id
                    ? isAndata ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                )}
              >
                {day.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline mr-1" />
            Orario di partenza
          </label>
          <input
            type="time"
            value={data.time}
            onChange={(e) => setData((prev) => ({ ...prev, time: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Flexibility toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.flexible}
              onChange={(e) => setData((prev) => ({ ...prev, flexible: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Orario flessibile</span>
          </label>
          {data.flexible && (
            <div className="flex items-center gap-2 mt-2 ml-6">
              <input
                type="time"
                value={data.timeFrom}
                onChange={(e) => setData((prev) => ({ ...prev, timeFrom: e.target.value }))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="time"
                value={data.timeTo}
                onChange={(e) => setData((prev) => ({ ...prev, timeTo: e.target.value }))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Departure point */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            {isAndata ? 'Punto di partenza' : 'Destinazione al ritorno'}
            <span className="text-gray-400 font-normal"> (opzionale)</span>
          </label>
          <input
            type="text"
            value={data.departurePoint}
            onChange={(e) => setData((prev) => ({ ...prev, departurePoint: e.target.value }))}
            placeholder={isAndata ? 'Es: Padova, zona stazione' : 'Es: Padova, zona stazione'}
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Number of seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posti passeggero disponibili
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setData((prev) => ({ ...prev, totalSeats: n }))}
                className={cn(
                  'w-10 h-10 rounded-lg font-bold text-sm transition-colors',
                  data.totalSeats === n
                    ? isAndata ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note <span className="text-gray-400 font-normal">(opzionale)</span>
          </label>
          <textarea
            value={data.note}
            onChange={(e) => setData((prev) => ({ ...prev, note: e.target.value }))}
            placeholder="Es: Passo da Mestre alle 17:30"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Direction toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Direzione
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleDirection('andata')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              directions.includes('andata')
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            <Mountain className="w-4 h-4" />
            Andata
          </button>
          <button
            type="button"
            onClick={() => toggleDirection('ritorno')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              directions.includes('ritorno')
                ? 'bg-amber-500 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            <Home className="w-4 h-4" />
            Ritorno
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Puoi selezionare entrambe le direzioni</p>
      </div>

      {/* Direction forms */}
      {directions.includes('andata') && renderDirectionForm('andata', andataData, setAndataData)}
      {directions.includes('ritorno') && renderDirectionForm('ritorno', ritornoData, setRitornoData)}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Annulla
          </Button>
        )}
        <Button type="submit" loading={loading} className="flex-1">
          <Car className="w-4 h-4 mr-2" />
          Offri passaggio
        </Button>
      </div>
    </form>
  );
};

export default RideForm;
