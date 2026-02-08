// Informazioni sulle baite

import baitaA1 from '../assets/images/Foto_Baita_A_1.jpeg';
import baitaA2 from '../assets/images/Foto_Baita_A_2.jpeg.jpg';
import baitaA3 from '../assets/images/Foto_Baita_A_3.jpeg.jpg';
import baitaA4 from '../assets/images/Foto_Baita_A_4.jpeg';
import baitaB1 from '../assets/images/Foto_Baita_B_1.jpeg';
import baitaB2 from '../assets/images/Foto_Baita_B_2.jpeg';
import baitaB3 from '../assets/images/Foto_Baita_B_3.jpeg';
import baitaB4 from '../assets/images/Foto_Baita_B_4.jpg';
import baitaB5 from '../assets/images/Foto_Baita_B_5.jpeg';
import panorama from '../assets/images/Panorama_2.jpg';
import panoramaSecret from '../assets/images/Panorama_3.png';
import camminata from '../assets/images/Camminata_tra_le_due_baite_2.jpg';
import mappaBaite from '../assets/images/Mappa_Baite.jpg';
import baitaB6 from '../assets/images/Foto_Aggiuntiva_Baita_Bassa.jpeg';
import sentieroNeve from '../assets/images/Foto_Sentiero_Neve.jpeg';
import paesaggioInnevato from '../assets/images/Paesaggio_Innevato.jpeg';

export const IMAGES = {
  panorama,
  panoramaSecret,
  camminata,
  mappaBaite,
  sentieroNeve,
  paesaggioInnevato,
};

export const BAITE = {
  A: {
    id: 'A',
    nome: 'Antica Patta',
    soprannome: 'La Baita Alta',
    descrizione: 'Baita tradizionale in posizione elevata con vista panoramica. Dispone di più stanze e spazi per dormire.',
    postiTotali: 12,
    coordinate: {
      lat: 46.077874,
      lng: 11.321807,
    },
    indirizzo: "46°04'40.4\"N 11°19'18.5\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/LeBE97UevXWNvCkHA?g_st=iw',
    images: [baitaA1, baitaA2, baitaA3, baitaA4],
    mainImage: baitaA1,
    caratteristiche: [
      'Camera matrimoniale',
      'Camera doppia con castello',
      'Disimpegno con tenda',
      'Soggiorno con divano + spazio materasso',
      'Cucina attrezzata',
    ],
    colore: 'blue',
  },
  B: {
    id: 'B',
    nome: 'Nuova Forza',
    soprannome: 'La Baita Bassa',
    descrizione: 'Baita accogliente e moderna, costruita sulla falsa riga di quella di Grauno. Più spazio per eventi in comune..',
    postiTotali: 10,
    coordinate: {
      lat: 46.071622,
      lng: 11.322063,
    },
    indirizzo: "46°04'17.8\"N 11°19'19.4\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/sjFk9KAtUw2fjJVn7?g_st=iw',
    images: [baitaB1, baitaB2, baitaB3, baitaB4, baitaB5, baitaB6],
    mainImage: baitaB1,
    caratteristiche: [
      'Camera matrimoniale',
      'Divano letto + materasso in soggiorno',
      'Mansarda con 4 materassi',
      'Cucina attrezzata',
      'Atmosfera intima',
    ],
    colore: 'emerald',
  },
};

export const PARCHEGGI = [
  {
    id: 1,
    nome: 'Parcheggio Baita Alta',
    posti: '5',
    coordinate: { lat: 46.077889, lng: 11.321806 },
    indirizzo: "46°04'40.4\"N 11°19'18.5\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/SEBuPP2vptycNzD5A',
    servizio: 'Baita Alta',
    nevePercentuale: 90,
    sempreRaggiungibile: false,
    distanze: { baitaBassa: 8, baitaAlta: 0 },
    navettaJeep: false,
    note: null,
  },
  {
    id: 2,
    nome: 'Parcheggio Baita Bassa',
    posti: '2',
    coordinate: { lat: 46.071611, lng: 11.322056 },
    indirizzo: "46°04'17.8\"N 11°19'19.4\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/v6fYvNFfw6aU2CET6',
    servizio: 'Baita Bassa',
    nevePercentuale: 70,
    sempreRaggiungibile: false,
    distanze: { baitaBassa: 0, baitaAlta: 8 },
    navettaJeep: false,
    note: null,
  },
  {
    id: 3,
    nome: 'Parcheggio Distaccato Baita Bassa',
    posti: '4',
    coordinate: { lat: 46.072389, lng: 11.320556 },
    indirizzo: "46°04'20.6\"N 11°19'14.0\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/8Y1B79XsSNG78Uzt9',
    servizio: 'Baita Bassa',
    nevePercentuale: 60,
    sempreRaggiungibile: false,
    distanze: { baitaBassa: 1, baitaAlta: 8 },
    navettaJeep: true,
    note: null,
  },
  {
    id: 4,
    nome: 'Parcheggio Biforcazione',
    posti: '6',
    coordinate: { lat: 46.076556, lng: 11.310778 },
    indirizzo: "46°04'35.6\"N 11°18'38.8\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/nMrpbE6pRQq3XpLG8',
    servizio: 'Entrambe le Baite',
    nevePercentuale: 40,
    sempreRaggiungibile: false,
    distanze: { baitaBassa: 3, baitaAlta: 5 },
    navettaJeep: true,
    note: null,
  },
  {
    id: 5,
    nome: 'Parcheggio Kamauz',
    posti: '10+',
    coordinate: { lat: 46.075056, lng: 11.303111 },
    indirizzo: "46°04'30.2\"N 11°18'11.2\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/zX4HGaVSJPNyXrb7A',
    servizio: 'Entrambe le Baite',
    nevePercentuale: 0,
    sempreRaggiungibile: true,
    distanze: { baitaBassa: 4, baitaAlta: 7 },
    navettaJeep: true,
    note: 'Punto di incontro principale in caso di forte neve. Sempre accessibile.',
  },
  {
    id: 6,
    nome: 'Parcheggio Pergine',
    posti: '50+',
    coordinate: { lat: 46.065333, lng: 11.250333 },
    indirizzo: "46°03'55.2\"N 11°15'01.2\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/U8RCCu22XkN7DKoV9',
    servizio: 'Entrambe le Baite',
    nevePercentuale: 0,
    sempreRaggiungibile: true,
    distanze: { baitaBassa: 22, baitaAlta: 24 },
    navettaJeep: false,
    note: 'No servizio navetta Jeep (troppo distante). Buon punto per radunare le macchine e proseguire con una sola.',
  },
];

export const INFO_VIAGGIO = {
  distanzaTraBaite: '~700 metri in linea d\'aria tra le due baite (20–30 minuti a piedi via sentiero)',
  altitudine: '~1200m s.l.m.',
  consigli: [
    {
      titolo: '🚗 Come arrivare',
      contenuto: 'Le baite si raggiungono in auto, ma con 60 cm di neve l\'accesso è molto difficile. Consulta la sezione Parcheggi per sapere dove lasciare l\'auto. Manuel viene a prenderti con la Jeep!',
    },
    {
      titolo: '❄️ Neve e catene',
      contenuto: 'C\'è molta neve (circa 60 cm)! Le catene sono OBBLIGATORIE. Se non le hai, organizzati con qualcuno che le ha o valuta di noleggiarle.',
    },
    {
      titolo: '🎒 Cosa portare',
      contenuto: 'Vestiti caldi, doposci, sacco a pelo se hai un posto "alla buona", ciabatte, asciugamani, necessaire.',
    },
    {
      titolo: '🥾 Abbigliamento',
      contenuto: 'Scarponi da neve o doposci sono essenziali per muoversi tra le baite. Porta strati caldi!',
    },
    {
      titolo: '📱 Connessione',
      contenuto: 'La copertura telefonica potrebbe essere limitata. WiFi disponibile nelle baite.',
    },
    {
      titolo: '🍕 Cibo e bevande',
      contenuto: 'Organizzeremo la spesa insieme. Porta i tuoi snack preferiti e qualcosa da condividere!',
    },
    {
      titolo: '🛷 Slittino',
      contenuto: 'Consigliatissimo portare lo slittino! Con tutta questa neve è il momento giusto per qualche discesa e per spostare roba comodamente.',
    },
    {
      titolo: '🍖 Griglia',
      contenuto: 'C\'è una griglia disponibile per fare grigliate. Organizziamoci per una (o più) grigliate di gruppo!',
    },
    {
      titolo: '👨‍🍳 Collaborazione',
      contenuto: 'Serve collaborazione e voglia di fare per riempire le giornate con attività e per gestire pranzi e cene. Rimboccatevi le maniche e cucinate insieme!',
    },
  ],
};
