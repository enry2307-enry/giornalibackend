import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../core/redis/client';

export const blacklistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userIp = req.ip;

  if (!userIp) {
    return next(); 
  }

  try {
    const isBlacklisted = await redisClient.sismember('blacklist:ips', userIp);
    
    if (isBlacklisted) {
      return res.status(403).json({
        status: 'fail',
        code: 'IP_BANNED',
        message: 'Access denied from this IP address.'
      });
    }
    
    next();
  } catch (error) {
    // Fail-safe: se Redis è giù, facciamo passare la richiesta e logghiamo l'errore
    console.error('Blacklist check error:', error);
    next();
  }
};