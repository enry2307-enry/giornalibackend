# Architettura Backend - Decisioni Architetturali

Questo documento riassume le scelte tecniche e strutturali adottate per la gestione delle 21 tabelle del database (Supabase/PostgreSQL).

## 1. Struttura del Progetto (Domain-Driven)

Abbiamo scelto di organizzare il codice per **Domini** (es. `user`, `publisher`, `content`) invece che per tipo di file. Ogni dominio è autosufficiente.

* **`src/core/`**: Contiene la logica trasversale (database client, classi base).
* **`src/domains/`**: Contiene la logica di business divisa per entità.
* **`src/config/`**: Punto unico di accesso per le variabili d'ambiente.

---

## 2. Flusso dei Dati e Responsabilità

Il percorso di una richiesta segue una catena rigida per garantire sicurezza e pulizia del dato:

1. **DTO Middleware**: Valida l'input del client tramite `class-validator` prima che arrivi al controller.
2. **Controller**: Riceve l'input già validato. Non contiene logica di business. Usa `catchAsync` per delegare la gestione errori.
3. **Service**: Il "cervello". Gestisce hashing delle password, calcoli e pulizia dei dati (Destructuring).
4. **Repository**: L'unico strato che parla con Supabase. Esegue query grezze e restituisce l'entità completa.

---

## 3. Decisioni Tecniche Chiave

### Data Access (Repository)

* **BaseRepository**: Una classe astratta in `core/` che standardizza i metodi `create`, `update`, `delete` e `findById`.

### Sicurezza e Validazione

* **Filtro in uscita**: Il Service è responsabile di "pulire" l'oggetto ricevuto dalla Repository (es. rimuovere `password_hash`) usando il pattern rest/spread (`const { password_hash, ...publicUser } = rawUser`).
* **Password Hashing**: Gestito esclusivamente nel Service tramite `bcrypt`.
* **Validazione su più livelli**: Il backend non si fida del database. I vincoli (constraints) del DB sono l'ultima linea di difesa, mentre i DTO sono il filtro primario.

### Gestione Errori

* **`catchAsync`**: Wrapper universale per i controller che cattura le eccezioni asincrone e le invia al middleware globale di errore tramite `next(err)`.
* **Codici HTTP**: Uso di standard REST (es. `501 Not Implemented` per rotte in sviluppo, `401/403` per auth).

---

## 4. Standard di Codifica

* **Indentazione**: 2 spazi (Standard TypeScript/Prettier).
* **Naming Convention**:
    * **Tabelle DB**: Singolare o tecnico (`userbase`, `publisher`).
    * **File/Classi**: Singolare (`user.service.ts`, `UserService`).
    * **Endpoint API**: Plurale (`/users`, `/publishers`).


* **Tipi**: Utilizzo di **Interfacce** per il passaggio dati tra Service e Repo, e **Classi** (DTO) per la validazione dell'input.

---

## 5. Stato dell'Implementazione

* [x] Configurazione centralizzata (`config.ts`)
* [x] BaseRepository asincrona
* [x] Middleware DTO universale
* [x] Pattern di pulizia dati nel Service
* [ ] Mappatura delle restanti 20 tabelle (In corso)
