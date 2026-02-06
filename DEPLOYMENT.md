# Istruzioni per il Deployment su GitHub Pages

## ⚠️ IMPORTANTE - Sicurezza Token -

Il token GitHub viene esposto nel frontend (variabili `VITE_*` sono pubbliche). 
**Dopo aver configurato i secrets, RIGENERA il token** per invalidare quello condiviso.

## Configurazione Secrets su GitHub

### Passo 1: Aggiungi i Secrets nella Repository

1. Vai su: https://github.com/cybermerlo/40/settings/secrets/actions
2. Clicca su **"New repository secret"**
3. Aggiungi i seguenti secrets:

#### Secret 1: `VITE_GIST_ID`
- **Name:** `VITE_GIST_ID`
- **Value:** `70fb9b38686a85b429ed60fef11b017c` (ID del Gist dalla URL)

#### Secret 2: `VITE_GITHUB_TOKEN`
- **Name:** `VITE_GITHUB_TOKEN`
- **Value:** [Inserisci qui il tuo token GitHub - inizia con `ghp_`]

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

Crea un file `.env` nella cartella `app/` con:

```env
VITE_GIST_ID=70fb9b38686a85b429ed60fef11b017c
VITE_GITHUB_TOKEN=ghp_il_tuo_token_qui
```

**⚠️ NON committare il file `.env`** (è già nel `.gitignore`)

## URL del Progetto

Dopo il deploy, il progetto sarà disponibile su:
**https://cybermerlo.github.io/40/**

## Note sulla Sicurezza

- Il token GitHub è esposto nel codice frontend
- Chiunque può vedere il token aprendo gli strumenti sviluppatore del browser
- **Raccomandazione:** Rigenera il token dopo la configurazione e limita i permessi solo ai Gist necessari
- Considera di creare un token con permessi limitati solo al Gist specifico
