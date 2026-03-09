# Libera Ecosystem

Utility web app mobile-first per uso personale.

## Installazione Locale

1. Clona la repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## Build e Deploy

1. Genera la build di produzione:
   ```bash
   npm run build
   ```
2. Carica il contenuto della cartella `dist` sulla tua repository GitHub.
3. Assicurati che il `base` path in `vite.config.js` corrisponda al nome della tua repository.

## Note sulla Sicurezza
L'accesso tramite PIN è puramente locale e serve a prevenire l'uso accidentale da parte di terzi che hanno accesso fisico al dispositivo. Non è un sistema di autenticazione server-side.
