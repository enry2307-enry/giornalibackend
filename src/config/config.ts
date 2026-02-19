// src/config/config.ts
import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseKey: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'super-secret-access-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'another-secret-refresh-key',
};

export default config;