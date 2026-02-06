# 🏔️ Compleanno in Montagna

App web per gestire le prenotazioni degli ospiti alla festa di compleanno di Manuel in montagna (20-22 Febbraio 2026).

## Funzionalità

- 🛏️ **Prenotazione posti letto**: Visualizza disponibilità e prenota il tuo posto in una delle due baite
- 📅 **Calendario**: Panoramica dei tre giorni con attività programmate
- 💡 **Proposte attività**: Proponi cosa fare e metti "mi piace" alle idee degli altri
- 📍 **Info pratiche**: Indicazioni su come arrivare, cosa portare e consigli sulla neve
- 👤 **Profilo**: Gestisci le tue prenotazioni e il tuo avatar

## Le Baite

### Baita A - "Antica Patta" (La Baita Alta)
- 11 posti letto
- Camera matrimoniale + Camera doppia + Disimpegno + Soggiorno
- [Posizione su Google Maps](https://maps.app.goo.gl/LeBE97UevXWNvCkHA?g_st=iw)

### Baita B - "Nuova Forza" (La Baita Bassa)
- 7 posti letto
- Camera matrimoniale + Divano letto + Mansarda
- [Posizione su Google Maps](https://maps.app.goo.gl/sjFk9KAtUw2fjJVn7?g_st=iw)

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Database**: GitHub Gist API
- **Avatar**: DiceBear API + Emoji preimpostati
- **Hosting**: GitHub Pages

## Sviluppo locale

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## Variabili d'ambiente

Crea un file `.env` nella root del progetto:

```
VITE_GIST_ID=il_tuo_gist_id
VITE_GITHUB_TOKEN=il_tuo_github_token
```

## Deploy

Il deploy avviene automaticamente su GitHub Pages quando viene fatto push sul branch `main`.

Per il deploy manuale:
```bash
npm run build
# Carica la cartella dist/ su GitHub Pages
```

## Configurazione GitHub Secrets

Per il deploy automatico, aggiungi questi secrets nelle impostazioni del repository:
- `VITE_GIST_ID`: ID del Gist usato come database
- `VITE_GITHUB_TOKEN`: Token GitHub per accedere al Gist

---

Fatto con ❤️ per gli amici
