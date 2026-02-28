# Storage Strategy: Cloudflare R2 & Presigned URLs

Questa documentazione definisce l'architettura per la gestione dei file multimediali (immagini e video) utilizzando **Cloudflare R2** in modalità privata.

## 1. Architettura Generale
Per ottimizzare le performance e ridurre i costi di banda del server, adottiamo un approccio **Direct-to-R2**. Il backend non tocca mai i byte del file; agisce solo come autorità di certificazione che rilascia permessi temporanei.



### Componenti
* **Bucket R2**: Configurato come **privato**. L'accesso pubblico è disabilitato.
* **Backend**: Gestisce l'autorizzazione e genera **Presigned URLs** (firme crittografiche temporanee).
* **Frontend**: Esegue l'upload/download binario direttamente verso Cloudflare.

---

## 2. Flusso di Upload (Creazione Post/Media)

L'upload non avviene tramite un normale form multipart verso il backend, ma segue questo handshake:

1.  **Richiesta di Firma**: Il frontend chiede al backend un URL di upload inviando `contentType` (es. `image/jpeg`).
2.  **Validazione**: Il backend verifica tramite middleware `protect` e `requiresActiveUser` che l'utente sia autorizzato.
3.  **Generazione**: Il backend genera una `mediaKey` unica (UUID) e un **Presigned URL (PUT)** valido per 5 minuti.
4.  **Upload**: Il frontend esegue una `PUT` verso quell'URL inviando il file binario.
5.  **Finalizzazione**: Il frontend invia i dati del post (titolo, testo, ecc.) insieme alla `mediaKey` al backend per il salvataggio nel database.

---

## 3. Flusso di Download (Visualizzazione)

Poiché il bucket è privato, le immagini caricate non sono accessibili tramite URL statici.

1.  Il backend recupera la `mediaKey` dal database.
2.  Genera un **Presigned URL (GET)** temporaneo (scadenza consigliata: 1 ora).
3.  Il frontend riceve l'URL e lo inserisce nel tag `<img src="...">` o `<video src="...">`.

---

## 4. Note per il Frontend

### Configurazione delle richieste
* **Metodo HTTP**: Per l'upload deve essere utilizzato rigorosamente il metodo **`PUT`**.
* **Headers**: È fondamentale impostare l'header `Content-Type` esattamente uguale a quello dichiarato durante la richiesta della firma. Cloudflare rifiuterà l'upload se i tipi non corrispondono.
* **CORS**: Le richieste verso R2 funzioneranno solo se effettuate dal dominio autorizzato nelle impostazioni del bucket.

### Error Handling
* Se l'URL è scaduto, R2 restituirà un `403 Forbidden`. Il frontend deve gestire questo scenario richiedendo un nuovo URL al backend.
* Se l'utente è `SUSPENDED`, il backend negherà la generazione del link a monte.

---

## 5. Sicurezza e CORS

La sicurezza è garantita su tre livelli:
1.  **Sessione**: Solo utenti attivi e non sospesi ricevono link firmati.
2.  **Crittografia**: Gli URL sono firmati con chiavi segrete S3 non esposte al client.
3.  **CORS**: Cloudflare è configurato per accettare richieste solo dal nostro dominio frontend, impedendo hotlinking o attacchi da altri siti.

```json
// Esempio Configurazione CORS su R2
[
  {
    "AllowedOrigins": ["[https://tuo-frontend.com](https://tuo-frontend.com)"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]