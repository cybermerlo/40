// Configurazione posti letto delle baite

export const COMFORT_LEVELS = {
  STANDARD: {
    id: 'standard',
    label: 'Standard',
    icon: 'Bed',
    description: 'Letto comodo e tradizionale',
    color: 'bg-green-100 text-green-800',
  },
  ALLA_BUONA: {
    id: 'alla_buona',
    label: 'Alla buona',
    icon: 'Tent',
    description: 'Sistemazione avventurosa',
    color: 'bg-amber-100 text-amber-800',
  },
};

export const BEDS = {
  // Baita A - Antica Patta (12 posti)
  A1: {
    id: 'A1',
    baita: 'A',
    stanza: 'Camera Matrimoniale',
    tipo: 'Letto Matrimoniale',
    posti: 2,
    comfort: 'STANDARD',
    note: 'Letto principale della camera - Completi di tutto (Cusc., Lenz., Cop.)',
  },
  A2: {
    id: 'A2',
    baita: 'A',
    stanza: 'Camera Matrimoniale',
    tipo: 'Matrimoniale Gonfiabile',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Materasso gonfiabile aggiuntivo',
  },
  A3: {
    id: 'A3',
    baita: 'A',
    stanza: 'Camera Doppia',
    tipo: 'Letto a Castello',
    posti: 2,
    comfort: 'STANDARD',
    note: '1 sopra, 1 sotto - Completi di tutto (Cusc., Lenz., Cop.) nella cassettiera',
  },
  A4: {
    id: 'A4',
    baita: 'A',
    stanza: 'Camera Doppia',
    tipo: 'Brandina',
    posti: 1,
    comfort: 'ALLA_BUONA',
    note: 'Aggiuntivo nella doppia',
  },
  A5: {
    id: 'A5',
    baita: 'A',
    stanza: 'Disimpegno (Tenda)',
    tipo: 'Materassi a terra',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Spazio separato da tenda, non completamente chiuso - Ci sono Coperte e cuscina, manca lenzuolo federe e copri mat',
  },
  A6: {
    id: 'A6',
    baita: 'A',
    stanza: 'Soggiorno',
    tipo: 'Divano',
    posti: 1,
    comfort: 'ALLA_BUONA',
    note: 'Ci sono cuscini e coperte, mancano copri materass. lenzuolo e federe.',
  },
  A7: {
    id: 'A7',
    baita: 'A',
    stanza: 'Soggiorno',
    tipo: 'Materasso Matrimoniale',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Spazio davanti al divano – EMERGENZA: devi portare il materasso (non è disponibile in loco)',
  },

  // Baita B - Nuova Forza (12 posti)
  B1: {
    id: 'B1',
    baita: 'B',
    stanza: 'Camera Matrimoniale',
    tipo: 'Letto Matrimoniale',
    posti: 2,
    comfort: 'STANDARD',
    note: 'Letto principale - Completo di tutto',
  },
  B2: {
    id: 'B2',
    baita: 'B',
    stanza: 'Soggiorno',
    tipo: 'Divano Letto',
    posti: 2,
    comfort: 'STANDARD',
    note: 'In zona comune',
  },
  B3: {
    id: 'B3',
    baita: 'B',
    stanza: 'Mansarda/Disimpegno',
    tipo: 'Materassi',
    posti: 6,
    comfort: 'ALLA_BUONA',
    note: '3 materassi matrimoniali (come si vede dalla foto), stile "Grauno" - Ci sono copri materasso e coperta, mancano federe e lenzuoli. Utile sacco a pelo.',
  },
  B4: {
    id: 'B4',
    baita: 'B',
    stanza: 'Soggiorno',
    tipo: 'Materasso Matrimoniale',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Davanti al divano letto',
  },
};

export const getBedsByBaita = (baitaId) => {
  return Object.values(BEDS).filter(bed => bed.baita === baitaId);
};

export const getTotalSpotsByBaita = (baitaId) => {
  return getBedsByBaita(baitaId).reduce((sum, bed) => sum + bed.posti, 0);
};

export const NIGHTS = [
  { id: '2026-02-20', label: 'Venerdì 20', shortLabel: 'Ven 20' },
  { id: '2026-02-21', label: 'Sabato 21', shortLabel: 'Sab 21' },
  { id: '2026-02-22', label: 'Domenica 22', shortLabel: 'Dom 22' },
];

export const DAYS = [
  { id: '2026-02-20', label: 'Venerdì 20 Febbraio', shortLabel: 'Ven 20' },
  { id: '2026-02-21', label: 'Sabato 21 Febbraio (Compleanno!)', shortLabel: 'Sab 21 🎂' },
  { id: '2026-02-22', label: 'Domenica 22 Febbraio', shortLabel: 'Dom 22' },
  { id: '2026-02-23', label: 'Lunedì 23 Febbraio (Si sbaracca!)', shortLabel: 'Lun 23 🧹' },
];

export const DAY_PERIODS = [
  { id: 'mattina', label: 'Mattina', icon: 'Sunrise', time: '8:00 - 12:00' },
  { id: 'pomeriggio', label: 'Pomeriggio', icon: 'Sun', time: '12:00 - 18:00' },
  { id: 'sera', label: 'Sera', icon: 'Moon', time: '18:00 - 24:00' },
];
