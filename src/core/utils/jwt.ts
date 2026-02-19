import jwt from 'jsonwebtoken';
import config from '../../config/config';

export const jwtUtils = {
  generateAccessToken: (payload: object): string => {
    return jwt.sign(payload, config.jwtAccessSecret, { 
      expiresIn: '15m' 
    });
  },

  generateRefreshToken: (payload: object): string => {
    return jwt.sign(payload, config.jwtRefreshSecret, { 
      expiresIn: '7d' 
    });
  },

  verifyAccessToken: (token: string) => {
    return jwt.verify(token, config.jwtAccessSecret);
  },

  verifyRefreshToken: (token: string) => {
    return jwt.verify(token, config.jwtRefreshSecret);
  }
};