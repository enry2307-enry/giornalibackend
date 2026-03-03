import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config';
import { errorHandler } from './middleware/errHandler.middleware';

// Routers
import { authRouter } from './domains/auth/auth.router';
import { profileRouter } from './domains/profiles/profiles.router';
import { blacklistMiddleware } from './middleware/blacklist.middleware';
import { rateLimiterMiddleware } from './middleware/rateLimiter.middleware';
import { postRouter } from './domains/content/post/post.router';
import { scrollVideoRouter } from './domains/content/scroll-video/scroll-video.router';
import { storageRouter } from './domains/storage/storage.router';
import { categoryRouter } from './domains/content/category/category.router';

const app = express();

// 1. Indispensabile per rilevare correttamente req.ip dietro proxy
app.set('trust proxy', 1); 

// 2. Security Headers (Primo livello di difesa)
app.use(helmet());
app.use(cors({
  origin: config.nodeEnv === 'production' ? 'https://tuodominio.it' : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Parsers
app.use(express.json());
app.use(cookieParser());
// 4. Custom Security Middlewares (Redis-based)
// La blacklist prima del rate limiter per risparmiare risorse
if (process.env.NODE_ENV === 'production' || process.env.USE_REDIS === 'true') {
  app.use(blacklistMiddleware);
  app.use(rateLimiterMiddleware);
}
// 5. Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/scroll-video', scrollVideoRouter);
app.use('/api/v1/storage', storageRouter);
app.use('/api/v1/categories', categoryRouter);

// 6. Global error handler
app.use(errorHandler);

export default app;