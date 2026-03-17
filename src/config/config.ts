// src/config/config.ts
import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseKey: string;
  useRedis: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  cloudflareAccountId: string;
  cloudflareAccessKeyId: string;
  cloudflareSecretAccessKey: string;
  cloudflareBucketName: string;
  cloudflareR2Endpoint: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const config: Config = {
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseKey: requireEnv('SUPABASE_KEY'),
  useRedis: requireEnv('USE_REDI'),
  jwtAccessSecret: requireEnv('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  cloudflareAccountId: requireEnv('CLOUDFLARE_ACCOUNT_ID'),
  cloudflareAccessKeyId: requireEnv('CLOUDFLARE_ACCESS_KEY_ID'),
  cloudflareSecretAccessKey: requireEnv('CLOUDFLARE_SECRET_ACCESS_KEY'),
  cloudflareBucketName: requireEnv('CLOUDFLARE_BUCKET_NAME'),
  cloudflareR2Endpoint: requireEnv('CLOUDFLARE_R2_ENDPOINT'),
};

export default config;