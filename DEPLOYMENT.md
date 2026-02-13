# Istruzioni per il Deployment su GitHub Pages

## Sicurezza Token

Il token GitHub **NON** viene più incluso nel codice compilato. L'admin lo inserisce al login e viene salvato in `sessionStorage` (cancellato alla chiusura del browser).

## Configurazione Secrets su GitHub

### Passo 1: Aggiungi i Secrets nella Repository

1. Vai su: https://github.com/cybermerlo/40/settings/secrets/actions
2. Clicca su **"New repository secret"**
3. Aggiungi i seguenti secrets:

#### Secret 1: `VITE_GIST_ID`
- **Name:** `VITE_GIST_ID`
- **Value:** `70fb9b38686a85b429ed60fef11b017c` (ID del Gist dalla URL)

> **Nota:** `VITE_GITHUB_TOKEN` non è più necessario come secret del repository.
> L'admin inserisce il token al login direttamente nel browser.

### Passo 2: Abilita GitHub Pages

1. Vai su: https://github.com/cybermerlo/40/settings/pages
2. Sotto **"Source"**, seleziona:
   - **Deploy from a branch** → **None** (prima disabilita se già configurato)
   - Poi seleziona: **GitHub Actions** (questo abiliterà il deploy automatico dal workflow)
3. Clicca **Save**

**IMPORTANTE:** GitHub Pages deve essere configurato per usare **GitHub Actions**, non un branch diretto!

### Passo 3: Attiva il Workflow

Il workflow si attiverà automaticamente al prossimo push su `main`, oppure:

1. Vai su: https://github.com/cybermerlo/40/actions
2. Clicca su **"Deploy to GitHub Pages"**
3. Clicca **"Run workflow"** → **"Run workflow"**

## Configurazione Locale (Sviluppo)

Crea un file `.env` nella root del progetto con:

```env
VITE_GIST_ID=70fb9b38686a85b429ed60fef11b017c
```

> Il token GitHub non serve più nel `.env`. L'admin lo inserisce al login nel browser.

## URL del Progetto

Dopo il deploy, il progetto sarà disponibile su:
**https://cybermerlo.github.io/40/**

## Note sulla Sicurezza

- Il token GitHub **non** è più nel codice compilato
- L'admin lo inserisce al login e viene salvato in `sessionStorage` (si cancella alla chiusura del browser)
- Gli utenti normali possono leggere i dati senza token (il Gist è pubblico)
- Solo l'admin necessita del token per salvare modifiche
