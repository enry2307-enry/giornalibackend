# Implementazione Rate Limiting e IP Blacklist

Documentazione tecnica del sistema di protezione del traffico basato su Redis.

## Architettura
Il sistema utilizza **Redis** come archivio in-memory per garantire performance elevate ($O(1)$) e scalabilità. La logica è suddivisa in due layer di middleware che precedono l'elaborazione della richiesta.

### 1. IP Blacklist (Layer 1)
- **Scopo**: Blocco immediato di IP identificati come malevoli.
- **Implementazione**: Il middleware interroga un set Redis (`blacklist:ips`) tramite il comando `SISMEMBER`.
- **Vantaggio**: Risparmio di risorse computazionali bloccando la richiesta prima del parsing di body o sessioni.

### 2. Rate Limiting Dinamico (Layer 2)
Il sistema adotta una politica di "Default con Override".
- **Default**: Applicato a tutte le rotte non esplicitamente mappate (configurato in `RATE_LIMIT_CONFIG`).
- **Overrides**: Endpoint sensibili (es. `/auth/login`, `/auth/register`) hanno limiti più restrittivi.
- **Identificazione**: Basata su `req.ip`.

## Configurazione Infrastrutturale
Per il corretto funzionamento in ambiente production/staging:
1. **Trust Proxy**: In `app.ts`, è configurato `app.set('trust proxy', 1)`. Questo è fondamentale per recuperare l'IP reale del client quando l'app è dietro un load balancer o proxy (Nginx, AWS ALB), evitando che l'intero traffico venga limitato sotto l'IP del proxy.
2. **Redis Client**: Utilizza `ioredis` con una `retryStrategy` per gestire riconnessioni automatiche.

## Ambiente di Sviluppo e Test
- **Development**: Il sistema è disattivato per default a meno che `USE_REDIS=true` non sia presente nel `.env`.
- **Testing**: Per evitare l'errore `ECONNREFUSED` durante i test di Jest senza avviare Redis, viene utilizzato `ioredis-mock`. Questo simula il comportamento di Redis in memoria.

## Parole Chiave per Manutenzione
`Redis INCR`, `EXPIRE pattern`, `X-Forwarded-For`, `Rate Limit Overrides`.