import Redis from 'ioredis';
import config from '../../config/config';

const shouldConnect = config.nodeEnv === 'production' || config.useRedis === 'true';

// Creiamo l'istanza solo se necessario, altrimenti esportiamo un oggetto dummy o null
const redisClient = shouldConnect 
  ? new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      lazyConnect: false // ioredis cercherà comunque di connettersi subito
    })
  : new Redis({ offlineQueue: false }); // Mock minimo per evitare tentativi di connessione

if (shouldConnect) {
  redisClient.on('connect', () => console.log('Client connected'));
  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
}

export { redisClient };