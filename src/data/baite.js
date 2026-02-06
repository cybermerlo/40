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

export const IMAGES = {
  panorama,
  panoramaSecret,
  camminata,
  mappaBaite,
};

export const BAITE = {
  A: {
    id: 'A',
    nome: 'Antica Patta',
    soprannome: 'La Baita Alta',
    descrizione: 'Baita tradizionale in posizione elevata con vista panoramica. Dispone di più stanze e spazi per dormire.',
    postiTotali: 11,
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
      'Soggiorno con divano',
      'Cucina attrezzata',
    ],
    colore: 'blue',
  },
  B: {
    id: 'B',
    nome: 'Nuova Forza',
    soprannome: 'La Baita Bassa',
    descrizione: 'Baita accogliente e moderna, costruita sulla falsa riga di quella di Grauno. Più spazio per eventi in comune..',
    postiTotali: 7,
    coordinate: {
      lat: 46.071622,
      lng: 11.322063,
    },
    indirizzo: "46°04'17.8\"N 11°19'19.4\"E",
    googleMapsUrl: 'https://maps.app.goo.gl/sjFk9KAtUw2fjJVn7?g_st=iw',
    images: [baitaB1, baitaB2, baitaB3, baitaB4, baitaB5],
    mainImage: baitaB1,
    caratteristiche: [
      'Camera matrimoniale',
      'Divano letto in soggiorno',
      'Mansarda con materassi',
      'Cucina attrezzata',
      'Atmosfera intima',
    ],
    colore: 'emerald',
  },
};

export const INFO_VIAGGIO = {
  distanzaTraBaite: '~700 metri a piedi (10 minuti camminando)',
  altitudine: '~1200m s.l.m.',
  consigli: [
    {
      titolo: '🚗 Come arrivare',
      contenuto: 'Le baite si raggiungono in auto. Segui le indicazioni su Google Maps. Gli ultimi km sono su strada di montagna.',
    },
    {
      titolo: '❄️ Neve e catene',
      contenuto: 'C\'è molta neve! Le catene sono OBBLIGATORIE. Se non le hai, organizzati con qualcuno che le ha.',
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
  ],
};
