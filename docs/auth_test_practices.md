# Best Practices: Testing Autenticazione

## 1. Gestione del Ciclo di Vita
* **Cleanup**: Ogni suite deve eliminare i record creati tramite `afterAll` per evitare collisioni su indici univoci (email, username).
* **Isolamento**: Utilizzare prefissi temporali per le email di test (es. `test_17000000@example.com`).

## 2. Verifica degli Stati
* **Transizioni**: Testare il passaggio di stato dell'utente (es. da `pending` a `active`) solo in presenza di token validi.
* **Revoca**: Verificare che la generazione di un nuovo token invalidi automaticamente i precedenti dello stesso tipo.

## 3. Sicurezza Temporale
* **Scadenza**: Testare esplicitamente i casi di `expires_at` nel passato per validare la clausola `.gt('expires_at', now())` del repository.
* **Refresh Token**: Verificare l'invalidazione dei token basata sul `token_version` dopo modifiche critiche (password change, logout).

## 4. Codici di Risposta
* **403 Forbidden**: Per utenti autenticati con stato non idoneo (es. email non verificata).
* **404 Not Found**: Per token inesistenti, scaduti o revocati, evitando di confermare l'esistenza del codice a potenziali attaccanti.