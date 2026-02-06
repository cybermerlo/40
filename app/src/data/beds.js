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
  // Baita A - Antica Patta (11 posti)
  A1: {
    id: 'A1',
    baita: 'A',
    stanza: 'Camera Matrimoniale',
    tipo: 'Letto Matrimoniale',
    posti: 2,
    comfort: 'STANDARD',
    note: 'Letto principale della camera',
    canBookSingle: true,
  },
  A2: {
    id: 'A2',
    baita: 'A',
    stanza: 'Camera Matrimoniale',
    tipo: 'Brandina Singola',
    posti: 1,
    comfort: 'ALLA_BUONA',
    note: 'Aggiuntivo nella matrimoniale',
    canBookSingle: false,
  },
  A3: {
    id: 'A3',
    baita: 'A',
    stanza: 'Camera Matrimoniale',
    tipo: 'Matrimoniale Gonfiabile',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Materasso gonfiabile aggiuntivo',
    canBookSingle: true,
  },
  A4: {
    id: 'A4',
    baita: 'A',
    stanza: 'Camera Doppia',
    tipo: 'Letto a Castello',
    posti: 2,
    comfort: 'STANDARD',
    note: '1 sopra, 1 sotto',
    canBookSingle: true,
  },
  A5: {
    id: 'A5',
    baita: 'A',
    stanza: 'Camera Doppia',
    tipo: 'Letto Singolo',
    posti: 1,
    comfort: 'STANDARD',
    note: 'Aggiuntivo nella doppia',
    canBookSingle: false,
  },
  A6: {
    id: 'A6',
    baita: 'A',
    stanza: 'Disimpegno (Tenda)',
    tipo: 'Materassi a terra',
    posti: 2,
    comfort: 'ALLA_BUONA',
    note: 'Spazio separato da tenda, non completamente chiuso',
    canBookSingle: true,
  },
  A7: {
    id: 'A7',
    baita: 'A',
    stanza: 'Soggiorno',
    tipo: 'Divano',
    posti: 1,
    comfort: 'ALLA_BUONA',
    note: 'Posto di fortuna',
    canBookSingle: false,
  },
  
  // Baita B - Nuova Forza (7 posti)
  B1: {
    id: 'B1',
    baita: 'B',
    stanza: 'Camera Matrimoniale',
    tipo: 'Letto Matrimoniale',
    posti: 2,
    comfort: 'STANDARD',
    note: 'Letto principale',
    canBookSingle: true,
  },
  B2: {
    id: 'B2',
    baita: 'B',
    stanza: 'Soggiorno',
    tipo: 'Divano Letto',
    posti: 2,
    comfort: 'STANDARD',
    note: 'In zona comune',
    canBookSingle: true,
  },
  B3: {
    id: 'B3',
    baita: 'B',
    stanza: 'Mansarda/Disimpegno',
    tipo: 'Materassi',
    posti: 3,
    comfort: 'ALLA_BUONA',
    note: 'Con cuscini, stile "Grauno"',
    canBookSingle: true,
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
];

export const DAYS = [
  { id: '2026-02-20', label: 'Venerdì 20 Febbraio', shortLabel: 'Ven 20' },
  { id: '2026-02-21', label: 'Sabato 21 Febbraio (Compleanno!)', shortLabel: 'Sab 21 🎂' },
  { id: '2026-02-22', label: 'Domenica 22 Febbraio', shortLabel: 'Dom 22' },
];

export const DAY_PERIODS = [
  { id: 'mattina', label: 'Mattina', icon: 'Sunrise', time: '8:00 - 12:00' },
  { id: 'pomeriggio', label: 'Pomeriggio', icon: 'Sun', time: '12:00 - 18:00' },
  { id: 'sera', label: 'Sera', icon: 'Moon', time: '18:00 - 24:00' },
];
