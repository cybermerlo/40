import { Link } from 'react-router-dom';
import { Users, Calendar, Lightbulb, MapPin, ChevronRight, PartyPopper, Bed, AlertTriangle, Car, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BAITE, IMAGES } from '../data/baite';
import { DAYS } from '../data/beds';
import { BaitaCard } from '../components/Baite';
import { Avatar, Button, Card } from '../components/Common';

const Home = () => {
  const { currentUser, users, bookings, activities, scheduledActivities, loading } = useApp();

  // Statistiche
  const totalGuests = users.length;
  const totalBookings = bookings.length;
  const upcomingActivities = scheduledActivities.length;

  // Prossime attività schedulate
  const nextActivities = scheduledActivities
    .map((sa) => ({
      ...sa,
      activity: activities.find((a) => a.id === sa.activityId),
    }))
    .filter((sa) => sa.activity)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={IMAGES.panorama}
          alt="Panorama montagna"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper className="w-8 h-8" />
              <span className="text-lg font-medium bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
                40 ANNI! 🎉
              </span>
              <PartyPopper className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Compleanno in Montagna
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2 drop-shadow">
              20 - 21 - 22 Febbraio 2026
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-8 drop-shadow">
              Tre giorni insieme tra neve e amicizia
            </p>
            {!currentUser ? (
              <Link to="/login">
                <Button size="lg" className="shadow-xl">
                  Partecipa anche tu!
                </Button>
              </Link>
            ) : (
              <Link to="/baite">
                <Button size="lg" className="shadow-xl">
                  Prenota il tuo posto
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      {currentUser && (
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <Card.Body className="flex items-center gap-4">
              <Avatar user={currentUser} size="lg" />
              <div>
                <h2 className="text-xl font-bold">
                  Ciao {currentUser.nome}! 👋
                </h2>
                <p className="text-blue-100">
                  Benvenuto alla festa! Prenota il tuo posto e proponi attività.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Avvisi Importanti */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner 40 Anni */}
        <Card className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-xl">
          <Card.Body className="text-center py-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PartyPopper className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-bold">40 ANNI!</h2>
              <PartyPopper className="w-8 h-8" />
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              20 - 21 - 22 Febbraio 2026
            </p>
            <p className="text-lg text-white/90">
              Un intero weekend per festeggiare questo numero tondo (e decisamente impegnativo) 
              tra legno, neve e aria buona. Chi vuole beve, chi vuole gioca, chi vuole passeggia, 
              chi vuole va a sciare, chi vuole scopa.
            </p>
          </Card.Body>
        </Card>

        {/* Camping del Disagio */}
        <Card className="mb-6 border-2 border-blue-200">
          <Card.Header className="bg-blue-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Camping del Disagio - Come funziona
            </h3>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-gray-700">
              Voglio che vi sentiate a casa (anche se la casa sarà un po' affollata). 
              In questa app potrete gestire la vostra presenza in totale libertà, ma vi chiedo 
              di farlo con un minimo di cervello.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Scegli rifugio */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">🛌 Scegli il tuo rifugio</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Guarda le foto delle due baite e prenota dove schiantarti. Ci sono i 
                  <strong>"Letti da Gran Signore"</strong> (pochi, per chi arriva prima o ha la schiena a pezzi) 
                  e i posti <strong>"Alla Buona"</strong> (materassi a terra, brandine tattiche, 
                  sacchi a pelo e spirito di adattamento da profughi).
                </p>
              </div>

              {/* Onestà */}
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">⚠️ Onestà e Posti Letto</h4>
                </div>
                <p className="text-sm text-red-700">
                  <strong>Regola d'oro:</strong> Se siete incerti, <strong>NON rubate il posto</strong>.
                  Se non sapete ancora se venite, segnatevi come presenti "In giornata" 
                  piuttosto che prenotare un letto togliendolo a chi ha la certezza di esserci.
                </p>
              </div>

              {/* Vieni quando vuoi */}
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-gray-800">🚗 Vieni quando vuoi</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Non riesci a reggere tre giorni? Segnala se verrai solo per una giornata, 
                  un pomeriggio o solo per la cena del compleanno (21 Febbraio). 
                  È fondamentale per capire quanto vino e quanta carne caricare!
                </p>
              </div>

              {/* Proponi attività */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">💡 Crea l'agenda</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Hai un'idea per una ciaspolata punitiva, un torneo di briscola o una ricetta 
                  da cucinare insieme? Proponila! Io (Manuel), nel mio immenso potere di Admin, 
                  organizzerò le proposte nel calendario ufficiale.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Nota Bene Neve */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300">
          <Card.Body className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                ❄️
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Nota Bene ❄️
              </h4>
              <p className="text-blue-800 font-medium">
                C'è neve. Se venite con le scarpette da calcetto o la macchinetta bassa, 
                rimanete bloccati a metà strada e io non vengo a tirarvi fuori. 
                <strong className="block mt-2">Scarponi, roba pesante e catene a bordo (o gomme serie).</strong>
              </p>
              <Link to="/info" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm underline">
                → Vedi tutte le info pratiche
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Descrizione finale */}
        <Card className="mt-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <Card.Body className="text-center py-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Abbiamo a disposizione <strong>tre giorni e due baite</strong> immerse nella neve 
              tutte per noi, a pochi passi l'una dall'altra: 
              <strong> Baita Alta "Antica Patta"</strong> (la storica) e 
              <strong> Baita Bassa "Nuova Forza"</strong> (la giovane). 
              Sarà un weekend di condivisione, bevute, chiacchiere, e, spero, orgettine.
            </p>
          </Card.Body>
        </Card>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <Card.Body>
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-3xl font-bold text-gray-800">{totalGuests}</p>
              <p className="text-sm text-gray-500">Partecipanti</p>
            </Card.Body>
          </Card>
          <Card className="text-center">
            <Card.Body>
              <MapPin className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-3xl font-bold text-gray-800">2</p>
              <p className="text-sm text-gray-500">Baite</p>
            </Card.Body>
          </Card>
          <Card className="text-center">
            <Card.Body>
              <Calendar className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-3xl font-bold text-gray-800">3</p>
              <p className="text-sm text-gray-500">Giorni</p>
            </Card.Body>
          </Card>
          <Card className="text-center">
            <Card.Body>
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-3xl font-bold text-gray-800">{activities.length}</p>
              <p className="text-sm text-gray-500">Attività proposte</p>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Le Baite */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Le Baite</h2>
          <Link
            to="/baite"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Vedi tutte
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <BaitaCard baitaId="A" />
          <BaitaCard baitaId="B" />
        </div>
      </section>

      {/* Chi partecipa */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chi partecipa</h2>
        </div>
        <Card>
          <Card.Body>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nessun partecipante ancora. Sii il primo!
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-4 py-1"
                  >
                    <Avatar user={user} size="sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.nome} {user.cognome}
                    </span>
                    {user.isAdmin && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </section>

      {/* Date */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">I tre giorni</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {DAYS.map((day, index) => (
            <Card key={day.id} className={index === 1 ? 'ring-2 ring-amber-400' : ''}>
              <Card.Body className="text-center">
                {index === 1 && (
                  <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    🎂 Compleanno!
                  </span>
                )}
                <p className="text-lg font-bold text-gray-800">{day.label}</p>
                <p className="text-sm text-gray-500">
                  {index === 0 && 'Arrivo e sistemazione'}
                  {index === 1 && 'Festa e attività'}
                  {index === 2 && 'Ultime attività e partenza'}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Card.Body className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Unisciti alla festa!</h2>
              <p className="text-white/90 mb-6">
                Registrati per prenotare il tuo posto e proporre attività
              </p>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Registrati ora
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Home;
