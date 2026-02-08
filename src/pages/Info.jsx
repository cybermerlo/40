import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Backpack, Phone, ExternalLink, AlertTriangle, Car, Video } from 'lucide-react';
import { BAITE, INFO_VIAGGIO, IMAGES, PARCHEGGI } from '../data/baite';
import { Card } from '../components/Common';

// ============================================
// Helper: colore per percentuale irraggiungibilità neve
// ============================================
const getNeveColors = (pct) => {
  if (pct >= 80) return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' };
  if (pct >= 60) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' };
  if (pct >= 30) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' };
  return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' };
};

// ============================================
// Helper: crea SVG marker per Google Maps
// ============================================
const buildMarkerSvg = (fillColor, label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><path d="M18 0C8 0 0 8 0 18c0 13 18 26 18 26s18-13 18-26C36 8 28 0 18 0z" fill="${fillColor}" stroke="#fff" stroke-width="2"/><text x="18" y="23" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial,sans-serif">${label}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

// ============================================
// Componente: Mappa interattiva Google Maps
// ============================================
const MappaInterattiva = () => {
  const mapRef = useRef(null);
  const [stato, setStato] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const tryInit = () => {
      if (cancelled) return;
      if (window.google?.maps) {
        initMap();
        return;
      }
      if (++attempts > 80) {
        setStato('error');
        return;
      }
      setTimeout(tryInit, 100);
    };

    const initMap = () => {
      if (!mapRef.current || cancelled) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 46.073, lng: 11.295 },
        zoom: 14,
        mapTypeId: 'terrain',
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: true,
      });

      const openInfoWindows = [];

      const addMarker = (position, title, svgUrl, size, zIndex, infoHtml) => {
        const marker = new window.google.maps.Marker({
          position,
          map,
          title,
          icon: {
            url: svgUrl,
            scaledSize: new window.google.maps.Size(size, Math.round(size * 44 / 36)),
            anchor: new window.google.maps.Point(size / 2, Math.round(size * 44 / 36)),
          },
          zIndex,
        });
        if (infoHtml) {
          const iw = new window.google.maps.InfoWindow({ content: infoHtml });
          marker.addListener('click', () => {
            openInfoWindows.forEach(w => w.close());
            iw.open(map, marker);
            openInfoWindows.push(iw);
          });
        }
        return marker;
      };

      // ---- Baite ----
      Object.values(BAITE).forEach(b => {
        const color = b.id === 'A' ? '#1e40af' : '#059669';
        addMarker(
          b.coordinate,
          b.nome,
          buildMarkerSvg(color, b.id),
          38,
          10,
          `<div style="padding:4px;font-family:Arial,sans-serif;min-width:160px">
            <strong style="font-size:14px">${b.nome}</strong><br>
            <span style="color:#666;font-size:12px">${b.soprannome}</span><br><br>
            <a href="${b.googleMapsUrl}" target="_blank" rel="noopener" style="color:#1e40af;font-size:12px;text-decoration:none">📍 Apri in Google Maps</a>
          </div>`
        );
      });

      // ---- Sentiero pedonale tratteggiato ----
      new window.google.maps.Polyline({
        path: [BAITE.A.coordinate, BAITE.B.coordinate],
        strokeOpacity: 0,
        icons: [{
          icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.5, strokeColor: '#6b7280', scale: 3 },
          offset: '0',
          repeat: '12px',
        }],
        map,
      });

      // ---- Parcheggi ----
      PARCHEGGI.forEach(p => {
        const c = p.sempreRaggiungibile ? '#16a34a' :
          p.nevePercentuale >= 80 ? '#dc2626' :
          p.nevePercentuale >= 60 ? '#ea580c' :
          p.nevePercentuale >= 30 ? '#d97706' : '#16a34a';

        // Offset P1 e P2 per non sovrapporsi alle baite
        const pos = { ...p.coordinate };
        if (p.id <= 2) pos.lng -= 0.001;

        const neveStr = p.sempreRaggiungibile
          ? '✅ Sempre raggiungibile'
          : `⚠️ ${p.nevePercentuale}% irraggiungibile per neve`;

        addMarker(
          pos,
          `P${p.id} – ${p.nome}`,
          buildMarkerSvg(c, `P${p.id}`),
          34,
          5,
          `<div style="padding:4px;font-family:Arial,sans-serif;min-width:200px">
            <strong style="font-size:14px">P${p.id} – ${p.nome}</strong><br>
            <span style="font-size:12px">${p.posti} posti · ${neveStr}</span><br>
            <span style="font-size:12px">Servizio: ${p.servizio}</span><br><br>
            <a href="${p.googleMapsUrl}" target="_blank" rel="noopener" style="color:#1e40af;font-size:12px;text-decoration:none">📍 Vedi su Maps</a>
            &nbsp;&nbsp;
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.coordinate.lat},${p.coordinate.lng}&travelmode=driving" target="_blank" rel="noopener" style="color:#059669;font-size:12px;text-decoration:none">🧭 Naviga qui</a>
          </div>`
        );
      });

      // Fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(BAITE).forEach(b => bounds.extend(b.coordinate));
      PARCHEGGI.forEach(p => bounds.extend(p.coordinate));
      map.fitBounds(bounds, 40);

      setStato('ready');
    };

    tryInit();
    return () => { cancelled = true; };
  }, []);

  return (
    <Card className="mb-8 overflow-hidden">
      <Card.Header>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🗺️ Mappa Interattiva
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tocca i marcatori per i dettagli. Blu/verde = baite, P1–P6 = parcheggi.
        </p>
      </Card.Header>
      <div className="relative">
        {stato === 'loading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Caricamento mappa…</p>
            </div>
          </div>
        )}
        {stato === 'error' ? (
          <div className="flex items-center justify-center bg-gray-50 py-16">
            <div className="text-center text-gray-400">
              <p className="text-3xl mb-2">🗺️</p>
              <p>Mappa non disponibile</p>
              <p className="text-sm">Usa i link Google Maps qui sotto</p>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-[300px] sm:h-[420px]" />
        )}
      </div>
      {stato === 'ready' && (
        <Card.Body className="bg-gray-50 border-t border-gray-100 py-3">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700 inline-block" /> Baita Alta
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Baita Bassa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" /> P. raggiungibile
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> P. a rischio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> P. prob. irraggiungibile
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 border-t-2 border-dashed border-gray-400" /> Sentiero a piedi
            </span>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

// ============================================
// Componente: Card singolo parcheggio
// ============================================
const ParcheggioCard = ({ p }) => {
  const neve = p.sempreRaggiungibile ? getNeveColors(0) : getNeveColors(p.nevePercentuale);

  return (
    <Card className={`border ${neve.border} ${neve.light}`}>
      <Card.Body>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Badge numerico */}
          <div className={`flex-shrink-0 w-12 h-12 ${neve.bg} rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow`}>
            P{p.id}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800">{p.nome}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {p.posti} posti · Serve: <strong>{p.servizio}</strong>
            </p>

            {/* Barra neve */}
            {p.sempreRaggiungibile ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full mb-2">
                ✅ Sempre raggiungibile
              </span>
            ) : (
              <div className="mb-2">
                <span className={`text-sm font-medium ${neve.text}`}>
                  ⚠️ Irraggiungibile per neve: {p.nevePercentuale}%
                </span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`${neve.bg} h-1.5 rounded-full`}
                    style={{ width: `${p.nevePercentuale}%` }}
                  />
                </div>
              </div>
            )}

            {/* Distanze in auto */}
            <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 flex-shrink-0" />
                {p.distanze.baitaAlta === 0
                  ? 'Presso Baita Alta'
                  : `${p.distanze.baitaAlta} min → Baita Alta`}
              </span>
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 flex-shrink-0" />
                {p.distanze.baitaBassa === 0
                  ? 'Presso Baita Bassa'
                  : `${p.distanze.baitaBassa} min → Baita Bassa`}
              </span>
            </div>

            {/* Navetta Jeep */}
            {p.navettaJeep && (
              <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg mb-2 inline-flex items-center gap-1">
                🚙 Navetta Jeep disponibile
              </p>
            )}

            {/* Note */}
            {p.note && <p className="text-sm text-gray-500 italic mb-2">{p.note}</p>}

            {/* Azioni */}
            <div className="flex flex-wrap gap-2 mt-1">
              <a
                href={p.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Vedi su Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.coordinate.lat},${p.coordinate.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Naviga qui
              </a>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// ============================================
// Pagina Info principale
// ============================================
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

      {/* ======== AVVISO NEVE CRITICO ======== */}
      <Card className="mb-8 bg-red-50 border-2 border-red-300 ring-2 ring-red-100 overflow-hidden">
        <Card.Body className="p-0">
          <img
            src={IMAGES.paesaggioInnevato}
            alt="Paesaggio innevato nella zona delle baite"
            className="w-full h-40 sm:h-56 object-cover"
          />
        </Card.Body>
        <Card.Body>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-red-800 mb-2">
                🚨 Situazione Neve – Attenzione!
              </h2>
              <p className="text-red-700 mb-2">
                Al momento c&apos;è <strong>circa 60 cm di neve</strong> nella zona delle baite.
                Raggiungere le baite in auto è <strong>quasi impossibile</strong> nella maggior parte dei casi.
              </p>
              <p className="text-red-700 mb-2">
                Manuel ha una <strong>vecchia Jeep</strong> con cui verrà a prendere chi arriva al
                parcheggio praticabile più vicino. Consulta la sezione <strong>Parcheggi</strong> qui
                sotto per capire dove lasciare l&apos;auto e coordinarti.
              </p>
              <p className="text-red-700 text-sm mb-3">
                Le catene da neve sono <strong>obbligatorie</strong>. Se non le hai, organizzati con
                qualcuno che le ha o valuta di noleggiarle.
              </p>
              <a
                href={`${import.meta.env.BASE_URL}video_strade_neve.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm bg-red-100 text-red-800 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Video className="w-4 h-4" />
                🎥 Guarda il video delle strade con la neve
              </a>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* ======== MAPPA INTERATTIVA ======== */}
      <MappaInterattiva />

      {/* ======== DOVE SIAMO ======== */}
      <Card className="mb-8">
        <Card.Body>
          <h2 className="text-xl font-bold text-gray-800 mb-2">📍 Dove siamo</h2>
          <p className="text-gray-600 mb-1">{INFO_VIAGGIO.distanzaTraBaite}</p>
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  baita.id === 'A' ? 'bg-blue-100' : 'bg-emerald-100'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    baita.id === 'A' ? 'text-blue-600' : 'text-emerald-600'
                  }`} />
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

      {/* ======== PERCORSO PEDONALE TRA LE BAITE ======== */}
      <Card className="mb-8 overflow-hidden">
        <Card.Body className="p-0">
          <div className="grid grid-cols-3">
            <img
              src={IMAGES.camminata}
              alt="Sentiero tra le due baite in estate"
              className="col-span-2 w-full h-56 sm:h-72 object-cover"
            />
            <img
              src={IMAGES.sentieroNeve}
              alt="Sentiero tra le baite con la neve"
              className="col-span-1 w-full h-56 sm:h-72 object-cover"
            />
          </div>
        </Card.Body>
        <Card.Body>
          <h2 className="text-xl font-bold text-gray-800 mb-2">🥾 Percorso pedonale tra le baite</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              Tra Baita Alta e Baita Bassa esiste un <strong>sentiero pedonale</strong> che{' '}
              <strong>non è indicato su Google Maps</strong>.
            </p>
            <p>
              Il percorso richiede circa <strong>20–30 minuti a piedi</strong>.
            </p>
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
              ⚠️ Con la neve è necessario essere <strong>adeguatamente attrezzati</strong>: scarponi
              da neve, abbigliamento caldo, e preferibilmente bastoncini da trekking. Non avventuratevi
              senza la giusta preparazione!
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* ======== PARCHEGGI ======== */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🅿️ Parcheggi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ecco tutti i parcheggi disponibili, ordinati dal più vicino alle baite al più distante.
            Usa il <strong>numero P</strong> per comunicare facilmente dove sei quando chiami Manuel.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
            🚙 Manuel con la Jeep viene a prenderti al parcheggio raggiungibile più vicino!
          </div>
        </div>

        <div className="grid gap-4">
          {PARCHEGGI.map(p => (
            <ParcheggioCard key={p.id} p={p} />
          ))}
        </div>
      </div>

      {/* ======== CONSIGLI ======== */}
      <div className="grid gap-6 mb-8">
        {INFO_VIAGGIO.consigli.map((consiglio, index) => (
          <Card key={index}>
            <Card.Body>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{consiglio.titolo}</h3>
              <p className="text-gray-600">{consiglio.contenuto}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* ======== CHECKLIST ======== */}
      <Card className="mb-8">
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
              '🛷 Slittino! (consigliatissimo con tutta questa neve)',
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

      {/* ======== CONTATTI ======== */}
      <Card className="mb-8">
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
    </div>
  );
};

export default Info;
