import { useState } from 'react';
import { Car, Mountain, Home, Plus, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Modal } from '../components/Common';
import { RideCard, RideForm } from '../components/Auto';
import { DAYS } from '../data/beds';
import { cn, sortByCreatedAt } from '../utils/helpers';

const DIRECTION_TABS = [
  { id: 'andata', label: 'Andata', icon: Mountain, color: 'blue' },
  { id: 'ritorno', label: 'Ritorno', icon: Home, color: 'amber' },
];

const Auto = () => {
  const { currentUser, rides, loading } = useApp();
  const [activeTab, setActiveTab] = useState('andata');
  const [showForm, setShowForm] = useState(false);

  const filteredRides = rides.filter((r) => r.direction === activeTab);

  // Group rides by date
  const ridesByDate = DAYS.reduce((acc, day) => {
    const dayRides = sortByCreatedAt(
      filteredRides.filter((r) => r.date === day.id),
      true
    );
    if (dayRides.length > 0) {
      acc.push({ day, rides: dayRides });
    }
    return acc;
  }, []);

  const totalRides = rides.length;
  const totalAndataRides = rides.filter((r) => r.direction === 'andata').length;
  const totalRitornoRides = rides.filter((r) => r.direction === 'ritorno').length;

  const activeColor = DIRECTION_TABS.find((t) => t.id === activeTab)?.color || 'blue';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Car className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Passaggi Condivisi</h1>
        </div>
        <p className="text-gray-500 max-w-lg mx-auto">
          Organizza i passaggi in auto per andare e tornare dalla montagna.
          Meno auto, piu' divertimento!
        </p>
      </div>

      {/* Info card */}
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <Card.Body className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Come funziona?</p>
            <ul className="space-y-1 text-blue-600">
              <li>Offri un passaggio indicando giorno, orario e posti disponibili</li>
              <li>Gli altri possono unirsi fino a riempire i posti</li>
              <li>La destinazione e' sempre la stessa: le baite in montagna!</li>
            </ul>
          </div>
        </Card.Body>
      </Card>

      {/* Stats */}
      {totalRides > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">{totalRides}</p>
            <p className="text-xs text-gray-500">Passaggi totali</p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalAndataRides}</p>
            <p className="text-xs text-blue-500">Andata</p>
          </div>
          <div className="bg-amber-50 rounded-xl shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{totalRitornoRides}</p>
            <p className="text-xs text-amber-500">Ritorno</p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="mb-6">
        {currentUser ? (
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Offri un passaggio
          </Button>
        ) : (
          <Card className="bg-gray-50">
            <Card.Body className="text-center py-4">
              <p className="text-gray-500">Accedi per offrire o richiedere un passaggio</p>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Direction tabs */}
      <div className="flex gap-2 mb-6">
        {DIRECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === 'andata' ? totalAndataRides : totalRitornoRides;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors flex-1 justify-center',
                isActive && tab.color === 'blue' && 'bg-blue-600 text-white shadow-md',
                isActive && tab.color === 'amber' && 'bg-amber-500 text-white shadow-md',
                !isActive && 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">Caricamento...</div>
      )}

      {/* Rides list grouped by date */}
      {!loading && ridesByDate.length === 0 && (
        <Card className="bg-gray-50">
          <Card.Body className="text-center py-12">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Nessun passaggio per {activeTab === 'andata' ? "l'andata" : 'il ritorno'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {currentUser ? 'Offri il primo passaggio!' : 'Accedi per offrire un passaggio'}
            </p>
          </Card.Body>
        </Card>
      )}

      {!loading && ridesByDate.map(({ day, rides: dayRides }) => (
        <div key={day.id} className="mb-6">
          <h3 className={cn(
            'font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2',
            activeColor === 'blue' ? 'text-blue-600' : 'text-amber-600'
          )}>
            <span className={cn(
              'w-2 h-2 rounded-full',
              activeColor === 'blue' ? 'bg-blue-400' : 'bg-amber-400'
            )} />
            {day.label}
          </h3>
          <div className="space-y-4">
            {dayRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </div>
      ))}

      {/* Modal for creating ride */}
      {showForm && (
        <Modal
          title="Offri un passaggio"
          onClose={() => setShowForm(false)}
          size="lg"
        >
          <RideForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Auto;
