import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../core/redis/client';
import { RATE_LIMIT_CONFIG } from '../config/rateLimit.config';

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const path = req.path;

  if (!ip) {
    return res.status(400).json({ message: "Inability to retrieve IP address." });
  }

  const config = RATE_LIMIT_CONFIG.overrides[path as keyof typeof RATE_LIMIT_CONFIG.overrides] 
                 || RATE_LIMIT_CONFIG.default;

  const key = `rate-limit:${path}:${ip}`;

  try {
    const requests = await redisClient.incr(key);

    if (requests === 1) {
      // Imposta la scadenza della finestra temporale solo alla prima richiesta
      await redisClient.pexpire(key, config.windowMs);
    }

    if (requests > config.max) {
      return res.status(429).json({
        status: 'fail',
        code: 'TOO_MANY_REQUESTS',
        message: config.message,
        retryAfter: `${config.windowMs / 60000} minutes`
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    next();
  }
};