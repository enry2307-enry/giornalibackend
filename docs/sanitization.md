# Documentazione Sanitizzazione Input

Questo documento descrive l'implementazione del layer di sanitizzazione per la protezione contro attacchi injection e Cross-Site Scripting (XSS).

---

## Obiettivo e Funzionamento

La sanitizzazione interviene prima della validazione del Data Transfer Object (DTO) per pulire le stringhe in entrata da caratteri potenzialmente malevoli. Il sistema utilizza un middleware centralizzato che agisce ricorsivamente su tutte le proprietà del corpo della richiesta.

---

## Implementazione Tecnica

### 1. Middleware di Sanitizzazione

Il middleware (`src/middleware/dto.middleware.ts`) esegue le seguenti operazioni in ordine:

1. **Ricezione**: Intercetta il `req.body`.
2. **Sanitizzazione**: Applica la funzione `escape()` di `validator` a tutti i campi di tipo stringa.
3. **Trasformazione**: Converte l'oggetto semplice in un'istanza della classe DTO tramite `plainToInstance`.
4. **Validazione**: Verifica i vincoli del DTO (es. `@IsEmail`, `@IsInt`).

### 2. Mappatura Caratteri Escaped

I seguenti caratteri vengono trasformati per neutralizzare script o tag HTML:

| Carattere | Trasformazione | Motivazione |
| --- | --- | --- |
| `<` | `&lt;` | Previene l'apertura di tag script/HTML. |
| `>` | `&gt;` | Previene la chiusura di tag script/HTML. |
| `&` | `&amp;` | Neutralizza riferimenti a entità HTML. |
| `"` | `&quot;` | Impedisce l'uscita da attributi HTML delimitati da virgolette. |
| `'` | `&#x27;` | Impedisce l'uscita da attributi HTML delimitati da apici. |
| `/` | `&#x2F;` | Impedisce la chiusura di tag in contesti di attributo o percorsi. |

---

## Regole di Sicurezza ed Eccezioni

### Esclusione Campi Sensibili

Per garantire l'integrità dei dati crittografici, i campi che contengono il termine **password** sono esplicitamente esclusi dal processo di sanitizzazione. Questo evita che caratteri speciali legittimi contenuti nelle password vengano alterati, impedendo errori di autenticazione.

### Whitelisting e Mass Assignment

Il middleware applica una politica di whitelist rigorosa:

* **Rimozione Campi**: Tutti i parametri non definiti esplicitamente nel DTO vengono rimossi (`whitelist: true`).
* **Blocco Richiesta**: Se vengono inviati campi non autorizzati (es. `role`, `isAdmin`), la richiesta viene respinta con un errore di validazione (`forbidNonWhitelisted: true`).

---

### Gestione Blacklist
Per evitare la corruzione di dati tecnici e fallimenti nella validazione (es. UUID, Email, Password), il middleware consulta la costante `SANITIZATION_BLACKLIST` (`src/core/constants/security.ts`). I campi inclusi in questa lista vengono processati senza subire l'encoding dei caratteri speciali.

## Note per la Manutenzione

* **Localizzazione**: Il file risiede in `src/middlewares/dto.middleware.ts`.
* **Test**: Ogni modifica alla logica di sanitizzazione deve essere verificata con lo script di test dedicato per assicurarsi che i caratteri `/` e `"` siano correttamente trasformati.