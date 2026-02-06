import { MapPin, Navigation, Snowflake, Backpack, Phone, Wifi, ExternalLink } from 'lucide-react';
import { BAITE, INFO_VIAGGIO, IMAGES } from '../data/baite';
import { Card } from '../components/Common';

const Info = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Informazioni Utili</h1>
        <p className="text-gray-600">
          Tutto quello che devi sapere per arrivare e goderti il weekend
        </p>
      </div>

      {/* Mappa */}
      <Card className="mb-8">
        <Card.Body className="p-0">
          <img
            src={IMAGES.mappaBaite}
            alt="Mappa delle baite"
            className="w-full h-auto"
          />
        </Card.Body>
        <Card.Body>
          <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Dove siamo</h2>
          <p className="text-gray-600 mb-4">{INFO_VIAGGIO.distanzaTraBaite}</p>
          <p className="text-gray-600 mb-4">Altitudine: {INFO_VIAGGIO.altitudine}</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.values(BAITE).map(baita => (
              <a
                key={baita.id}
                href={baita.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-${baita.colore}-100 flex items-center justify-center`}>
                  <MapPin className={`w-5 h-5 text-${baita.colore}-600`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{baita.nome}</p>
                  <p className="text-sm text-gray-500">{baita.soprannome}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Consigli */}
      <div className="grid gap-6">
        {INFO_VIAGGIO.consigli.map((consiglio, index) => (
          <Card key={index}>
            <Card.Body>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{consiglio.titolo}</h3>
              <p className="text-gray-600">{consiglio.contenuto}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Checklist cosa portare */}
      <Card className="mt-8">
        <Card.Header>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Backpack className="w-6 h-6" />
            Checklist: cosa portare
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              '❄️ Vestiti caldi (strati)',
              '🥾 Scarponi da neve / doposci',
              '🧤 Guanti e cappello',
              '🧣 Sciarpa / scaldacollo',
              '🕶️ Occhiali da sole',
              '🧴 Crema solare (si riflette sulla neve!)',
              '🛏️ Sacco a pelo (se posto "alla buona")',
              '🩴 Ciabatte per le baite',
              '🧺 Asciugamani',
              '🪥 Necessaire / prodotti personali',
              '💊 Preservativi e anticoncezionali',
              '📱 Caricatore telefono',
              '🎿 Attrezzatura sci (se hai)',
              '🎲 Giochi da tavolo',
              '🍫 Snack da condividere',
              '🍷 Qualcosa da bere!',
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Avviso importante */}
      <Card className="mt-8 bg-amber-50 border-amber-200">
        <Card.Body className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Snowflake className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-amber-800 mb-1">⚠️ Importante: Neve!</h3>
            <p className="text-amber-700">
              C'è molta neve in questo periodo! Le catene da neve sono <strong>obbligatorie</strong>. 
              Se non le hai, organizzati con qualcuno che le ha o valuta di noleggiarle. 
              La strada per le baite può essere impegnativa con il ghiaccio.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Contatti */}
      <Card className="mt-8">
        <Card.Header>
          <h2 className="text-xl font-bold text-gray-800">📞 In caso di bisogno</h2>
        </Card.Header>
        <Card.Body>
          <p className="text-gray-600 mb-4">
            Per qualsiasi domanda o emergenza, contatta Manuel:
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+393384805118"
              className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Chiama</span>
            </a>
            <a
              href="https://wa.me/393384805118"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-medium">WhatsApp</span>
            </a>
          </div>
        </Card.Body>
      </Card>

      {/* Foto camminata */}
      <Card className="mt-8">
        <Card.Body className="p-0">
          <img
            src={IMAGES.camminata}
            alt="Camminata tra le baite"
            className="w-full h-64 object-cover"
          />
        </Card.Body>
        <Card.Body className="text-center">
          <p className="text-gray-600 italic">
            "La strada tra le due baite... preparatevi a camminare nella neve!" 🏔️
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Info;
