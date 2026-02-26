# Strategia di Storage: Cloudflare R2

È stato scelto Cloudflare R2 per la gestione degli asset multimediali (foto e video).

## Motivazioni Tecniche
* **Zero Egress Fees**: Eliminazione dei costi di trasferimento dati in uscita verso gli utenti.
* **Compatibilità S3**: Utilizzo dell'SDK AWS standard tramite endpoint personalizzati.
* **Performance**: Integrazione nativa con la rete CDN globale di Cloudflare.

## Configurazione
* **Endpoint**: `https://<account_id>.r2.cloudflarestorage.com`.
* **Costi**: Storage a $0.015/GB con 10GB gratuiti permanenti.
* **Policy**: Implementazione di regole di lifecycle per l'eliminazione automatica dei file temporanei dopo 30 giorni.