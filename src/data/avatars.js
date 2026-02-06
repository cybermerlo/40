// Avatar personalizzati (immagini locali)
import avatarFesteggiato from '../assets/images/Avatar_Festaggiato.png';

export const CUSTOM_AVATARS = {
  festeggiato: avatarFesteggiato,
};

// Avatar preimpostati e configurazione DiceBear

// Stili DiceBear disponibili
export const DICEBEAR_STYLES = [
  { id: 'adventurer', label: 'Avventuriero' },
  { id: 'adventurer-neutral', label: 'Avventuriero Neutro' },
  { id: 'avataaars', label: 'Avataaars' },
  { id: 'bottts', label: 'Robot' },
  { id: 'fun-emoji', label: 'Emoji Divertenti' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'notionists', label: 'Notionists' },
  { id: 'open-peeps', label: 'Open Peeps' },
  { id: 'personas', label: 'Personas' },
  { id: 'pixel-art', label: 'Pixel Art' },
];

// Genera URL avatar DiceBear
export const getDiceBearUrl = (seed, style = 'adventurer', size = 150) => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
};

// Avatar preimpostati a tema montagna
export const PRESET_AVATARS = [
  // Attività invernali
  { id: 'sciatore', emoji: '⛷️', label: 'Sciatore' },
  { id: 'snowboarder', emoji: '🏂', label: 'Snowboarder' },
  { id: 'ciaspolatore', emoji: '🥾', label: 'Ciaspolatore' },
  { id: 'escursionista', emoji: '🧗', label: 'Escursionista' },
  { id: 'slittino', emoji: '🛷', label: 'Slittino' },
  
  // Animali di montagna
  { id: 'orso', emoji: '🐻', label: 'Orso' },
  { id: 'cervo', emoji: '🦌', label: 'Cervo' },
  { id: 'marmotta', emoji: '🦫', label: 'Marmotta' },
  { id: 'aquila', emoji: '🦅', label: 'Aquila' },
  { id: 'lupo', emoji: '🐺', label: 'Lupo' },
  { id: 'volpe', emoji: '🦊', label: 'Volpe' },
  { id: 'coniglio', emoji: '🐰', label: 'Coniglio' },
  
  // Natura e elementi
  { id: 'montagna', emoji: '🏔️', label: 'Montagna' },
  { id: 'abete', emoji: '🌲', label: 'Abete' },
  { id: 'fiocco', emoji: '❄️', label: 'Fiocco di Neve' },
  { id: 'sole', emoji: '☀️', label: 'Sole' },
  { id: 'luna', emoji: '🌙', label: 'Luna' },
  { id: 'stella', emoji: '⭐', label: 'Stella' },
  
  // Bevande e cibo
  { id: 'cioccolata', emoji: '☕', label: 'Cioccolata Calda' },
  { id: 'birra', emoji: '🍺', label: 'Birra' },
  { id: 'vino', emoji: '🍷', label: 'Vino' },
  { id: 'torta', emoji: '🎂', label: 'Torta' },
  
  // Varie
  { id: 'fuoco', emoji: '🔥', label: 'Fuoco' },
  { id: 'baita', emoji: '🏠', label: 'Baita' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'musica', emoji: '🎵', label: 'Musica' },
];

// Funzione per ottenere l'URL dell'avatar in base al tipo
export const getAvatarUrl = (avatarType, avatarId, userName = '') => {
  if (avatarType === 'custom') {
    return CUSTOM_AVATARS[avatarId] || '👤';
  }

  if (avatarType === 'dicebear') {
    return getDiceBearUrl(userName || avatarId, avatarId);
  }
  
  if (avatarType === 'preset') {
    const preset = PRESET_AVATARS.find(a => a.id === avatarId);
    return preset ? preset.emoji : '👤';
  }
  
  return '👤';
};

// Funzione per verificare se l'avatar è un emoji
export const isEmojiAvatar = (avatarType) => avatarType === 'preset';
