# Note sulla Sicurezza e Debito Tecnico

Questo documento tiene traccia delle decisioni architetturali riguardanti la sicurezza e delle implementazioni temporaneamente sospese.

## Sanitizzazione Input (Stato: IN PAUSA)

### Descrizione
Era stata inizialmente prevista l'integrazione di un middleware di sanitizzazione basato su `validator.escape()` per prevenire attacchi XSS a livello di DTO.

### Motivazione della Sospensione
L'implementazione è stata messa in pausa per i seguenti motivi tecnici:
1. **Corruzione Dati Tecnici**: La funzione di escape trasforma caratteri legittimi (es. `/` in `&#x2F;`), invalidando campi critici come URL, Email e UUID prima che arrivino alla fase di validazione (`class-validator`).
2. **Incompatibilità Test di Integrazione**: I generatori di dati mock producono stringhe che, se sanitizzate in modo "bruto", causano fallimenti a catena (Errori 400 di validazione e conseguenti Errori 500 nel database per ID non generati).
3. **Priorità Startup**: Per garantire la velocità di sviluppo (momentum), si è deciso di delegare la protezione SQL esclusivamente alle **query parametrizzate** nei Repository.

### Strategia Futura Consigliata
Quando la sanitizzazione verrà riattivata, dovrà seguire questi criteri:
- **Whitelist di Campi**: Utilizzare la costante `SANITIZATION_BLACKLIST` per escludere campi sensibili o tecnici (password, email, id, token).
- **Sanitizzazione Granulare**: Utilizzare librerie come `DOMPurify` solo per i campi che devono effettivamente supportare markup, evitando l'escape globale sulle stringhe semplici.