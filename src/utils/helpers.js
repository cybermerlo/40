import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

// Formatta una data in italiano
export const formatDate = (dateString, formatStr = 'EEEE d MMMM') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr, { locale: it });
  } catch {
    return dateString;
  }
};

// Formatta una data corta
export const formatShortDate = (dateString) => {
  return formatDate(dateString, 'EEE d');
};

// Capitalizza la prima lettera
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Genera colore basato su stringa (per avatar)
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// Nome visualizzato (nome + cognome, senza spazi superflui)
export const getDisplayName = (user) => {
  if (!user) return '';
  return [user.nome, user.cognome].filter(Boolean).join(' ').trim();
};

// Ottieni le iniziali da nome e cognome
export const getInitials = (nome, cognome) => {
  const n = nome?.charAt(0)?.toUpperCase() || '';
  const c = cognome?.charAt(0)?.toUpperCase() || '';
  return `${n}${c}`;
};

// Plurale italiano semplice
export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

// Formatta il numero di posti
export const formatSpots = (count) => {
  return `${count} ${pluralize(count, 'posto', 'posti')}`;
};

// Classnames helper (simile a clsx)
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Aggiunge 2 ore a un orario in formato "HH:MM"
export const addTwoHours = (time) => {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  const totalMin = h * 60 + m + 120;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

// Scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Ordina per data creazione (più recente prima)
export const sortByCreatedAt = (items, ascending = false) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Raggruppa array per chiave
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};
