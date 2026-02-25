# Autenticazione JWT - Documentazione Tecnica

## Architettura dei Token

Abbiamo adottato un sistema **Stateless** basato su due tipologie di JSON Web Token (JWT) per bilanciare sicurezza e usabilità.

### 1. Access Token

* **Scopo**: Autorizzare le richieste API.
* **Durata**: Breve (es. 15 minuti).
* **Gestione**: Memorizzato in **memoria volatile** (Zustand/Redux). Mai nel localStorage.

### 2. Refresh Token

* **Scopo**: Ottenere nuovi Access Token.
* **Durata**: Lunga (es. 7 giorni).
* **Sicurezza**: `HttpOnly`, `Secure`, `SameSite: Strict`.

---

## Invalidamento Sessioni (Token Versioning)

Per superare il limite della natura stateless dei JWT (impossibilità di revoca immediata), abbiamo implementato il **Token Versioning**.

### Funzionamento

1. **Database**: Ogni utente ha un campo `tokenVersion` (integer, default `0`).
2. **Payload JWT**: Sia l'Access che il Refresh Token contengono il campo `version`.
3. **Validazione**: Durante ogni richiesta, il middleware verifica che la `version` nel token corrisponda esattamente al `tokenVersion` salvato nel database.
4. **Revoca Globale**: Incrementando il `tokenVersion` nel DB (es. in caso di cambio password o "Logout da tutti i dispositivi"), tutti i token precedentemente emessi diventano istantaneamente invalidi.

---

## Sanitizzazione e Sicurezza Input

Tutti i dati in entrata passano attraverso un middleware di sanitizzazione proattiva prima della validazione dei DTO.

### Middleware di Sanitizzazione

Il sistema utilizza la libreria `validator` per trasformare stringhe potenzialmente pericolose in entità HTML innocue, prevenendo attacchi **XSS (Cross-Site Scripting)**.

#### Trasformazione Caratteri (Escape)

La funzione di escape converte i caratteri speciali secondo la seguente mappatura:

| Carattere Originale | Entità Trasformata | Scopo |
| --- | --- | --- |
| `<` | `&lt;` | Impedisce l'apertura di tag HTML/Script |
| `>` | `&gt;` | Impedisce la chiusura di tag HTML |
| `&` | `&amp;` | Neutralizza riferimenti a entità |
| `"` | `&quot;` | Previene l'uscita da attributi HTML (es. `value="..."`) |
| `'` | `&#x27;` | Previene vulnerabilità negli attributi con apici singoli |
| `/` | `&#x2F;` | Impedisce la chiusura di tag in contesti vulnerabili |

### Regole di Applicazione

* **Esclusione Password**: Il campo `password` (e relativi campi sensibili) viene esplicitamente ignorato dalla sanitizzazione per evitare di corrompere caratteri speciali legittimi e impedire errori di login.
* **Whitelisting**: Grazie a `class-validator`, i campi non definiti nel DTO vengono rimossi automaticamente (`whitelist: true`), prevenendo attacchi di **Mass Assignment**.

---

## Endpoint di Riferimento

| Metodo | Endpoint | Input | Output | Note |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Email, Password | `User`, `AccessToken` | Imposta `refreshToken` nel cookie. |
| `POST` | `/auth/refresh` | (Cookie) | `User`, `AccessToken` | Esegue la rotazione e verifica la `version`. |
| `POST` | `/auth/logout` | (Cookie) | Success | Cancella il cookie. |
| `PATCH` | `/auth/security/reset` | Password | Success | Incrementa `tokenVersion` (Logout Globale). |

---

### Note per il futuro

* In caso di necessità di accettare HTML (es. editor di testo), utilizzare `DOMPurify` invece dell'escape globale per un filtraggio granulare dei tag ammessi.