# Autenticazione JWT - Documentazione Tecnica

## Architettura dei Token

Abbiamo adottato un sistema **Stateless** basato su due tipologie di JSON Web Token (JWT) per bilanciare sicurezza e usabilità.

### 1. Access Token

* **Scopo**: Autorizzare le richieste API.
* **Durata**: Breve (es. 15 minuti).
* **Trasmissione**: Inviato dal backend nel corpo della risposta JSON al login/refresh.
* **Gestione Frontend**: Deve essere memorizzato in **memoria volatile** (variabile JS o stato dell'applicazione come Zustand/Redux). Non salvarlo nel localStorage per prevenire attacchi XSS.
* **Utilizzo**: Inserire nell'header HTTP di ogni richiesta protetta:
`Authorization: Bearer <token>`

### 2. Refresh Token

* **Scopo**: Ottenere nuovi Access Token senza richiedere le credenziali all'utente.
* **Durata**: Lunga (es. 7 giorni).
* **Trasmissione**: Inviato dal backend tramite header `Set-Cookie`.
* **Gestione Frontend**: **Automatica**. Il browser memorizza e invia il cookie senza intervento di JavaScript.
* **Sicurezza**:
* `HttpOnly`: Non accessibile da script (protezione XSS).
* `Secure`: Inviato solo su connessioni HTTPS.
* `SameSite: Strict`: Protezione da attacchi CSRF.



---

## Flussi di Comunicazione (Consigli per il Frontend)

### 1. Gestione della Scadenza (Axios Interceptors)

Si consiglia di utilizzare un **interceptor** di risposta per gestire automaticamente l'errore `401 Unauthorized` (Token scaduto):

1. Se una richiesta fallisce con `401`, il frontend deve mettere in "pausa" le richieste in uscita.
2. Eseguire una chiamata `POST /api/v1/auth/refresh`.
3. Se il refresh ha successo, aggiornare l'Access Token in memoria e rieseguire la richiesta fallita originariamente.
4. Se il refresh fallisce (cookie scaduto), reindirizzare l'utente al `/login`.

### 2. Persistenza della Sessione al Refresh (F5)

Poiché l'Access Token è in memoria, si perde al ricaricamento della pagina:

* Al caricamento dell'App (es. in un `useEffect` o `App Init`), chiamare immediatamente `POST /auth/refresh`.
* Se il server risponde positivamente, l'utente è loggato silenziosamente e l'app recupera lo stato.

### 3. Logout

* Chiamare l'endpoint `POST /auth/logout`.
* Il backend invierà l'istruzione `clearCookie` per rimuovere il Refresh Token.
* Il frontend deve poi svuotare l'Access Token dalla memoria e pulire lo stato globale.

---

## Endpoint di Riferimento

| Metodo | Endpoint | Input | Output | Note |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Email, Password | `User`, `AccessToken` | Imposta il `refreshToken` nel cookie. |
| `POST` | `/auth/register` | "Email, Password" | `"User, AccessToken"` |Crea l'account e logga l'utente.
| `POST` | `/auth/refresh` | (Cookie) | `User`, `AccessToken` | Emette nuovi token (Rotazione). |
| `POST` | `/auth/logout` | (Cookie) | Success Message | Cancella il cookie lato browser. |
| `GET` | `/auth/me` | AccessToken | `User` | Verifica la validità dei dati utente. |
