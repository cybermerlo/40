import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, ExternalLink, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { BAITE } from '../data/baite';
import { getBedsByBaita, NIGHTS } from '../data/beds';
import { BedSlot } from '../components/Baite';
import { Button, Card, ComfortBadge } from '../components/Common';
import { useApp } from '../context/AppContext';

const BaitaDetail = () => {
  const { id } = useParams();
  const baita = BAITE[id];
  const { currentUser } = useApp();
  
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedNight, setSelectedNight] = useState(NIGHTS[0].id);

  if (!baita) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Baita non trovata</p>
        <Link to="/baite" className="text-blue-600 hover:underline">
          Torna alle baite
        </Link>
      </div>
    );
  }

  const beds = getBedsByBaita(id);
  const bedsByRoom = beds.reduce((acc, bed) => {
    if (!acc[bed.stanza]) acc[bed.stanza] = [];
    acc[bed.stanza].push(bed);
    return acc;
  }, {});

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % baita.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + baita.images.length) % baita.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/baite"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alle baite</span>
      </Link>

      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Gallery */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={baita.images[currentImage]}
              alt={`${baita.nome} foto ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Navigation arrows */}
          {baita.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {baita.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === index ? 'border-blue-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{baita.nome}</h1>
          <p className="text-lg text-gray-500 mb-4">{baita.soprannome}</p>
          
          <p className="text-gray-600 mb-6">{baita.descrizione}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{baita.postiTotali} posti letto</span>
            </div>
            <a
              href={baita.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Apri in Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Caratteristiche */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Caratteristiche</h3>
            <ul className="grid grid-cols-2 gap-2">
              {baita.caratteristiche.map((car, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  {car}
                </li>
              ))}
            </ul>
          </div>

          {/* Legenda comfort */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Legenda comfort:</h4>
            <div className="flex flex-wrap gap-3">
              <ComfortBadge comfort="STANDARD" />
              <ComfortBadge comfort="ALLA_BUONA" />
            </div>
          </div>
        </div>
      </div>

      {/* Selezione notte */}
      <Card className="mb-8">
        <Card.Body>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Prenota il tuo posto</h2>
          
          {!currentUser && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800">
                <Link to="/login" className="font-medium underline hover:no-underline">
                  Accedi
                </Link>{' '}
                per prenotare un posto letto
              </p>
            </div>
          )}

          {/* Night selector */}
          <div className="flex gap-2 mb-6">
            {NIGHTS.map((night) => (
              <button
                key={night.id}
                onClick={() => setSelectedNight(night.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  selectedNight === night.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {night.label}
              </button>
            ))}
          </div>

          {/* Beds by room */}
          <div className="space-y-6">
            {Object.entries(bedsByRoom).map(([roomName, roomBeds]) => (
              <div key={roomName}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
                  {roomName}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomBeds.map((bed) => (
                    <BedSlot key={bed.id} bedId={bed.id} night={selectedNight} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BaitaDetail;
