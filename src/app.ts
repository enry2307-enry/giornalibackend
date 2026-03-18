// src/app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Config
import config from './config/config';

// Middlewares
import { errorHandler } from './middleware/errHandler.middleware';
import { blacklistMiddleware } from './middleware/blacklist.middleware';
import { rateLimiterMiddleware } from './middleware/rateLimiter.middleware';

// Routers
import { authRouter } from './domains/auth/auth.router';
import { profileRouter } from './domains/profiles/profiles.router';
import { postRouter } from './domains/content/post/post.router';
import { scrollVideoRouter } from './domains/content/scroll-video/scroll-video.router';
import { storageRouter } from './domains/storage/storage.router';
import { categoryRouter } from './domains/content/category/category.router';
import { bookmarkRouter } from './domains/social/bookmark/bookmark.router';
import { requiresAuth } from './middleware/auth.middleware';
import { requiresActiveUser } from './middleware/activeUser.middleware';
import { likeRouter } from './domains/social/like/like.router';

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
if (config.nodeEnv === 'production' || config.useRedis === 'true') {
  app.use(blacklistMiddleware);
  app.use(rateLimiterMiddleware);
}
// 5. Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', requiresAuth, requiresActiveUser, profileRouter);
app.use('/api/v1/post', requiresAuth, requiresActiveUser, postRouter);
app.use('/api/v1/scroll-video', requiresAuth, requiresActiveUser, scrollVideoRouter);
app.use('/api/v1/storage', requiresAuth, requiresActiveUser, storageRouter);
app.use('/api/v1/categories', requiresAuth, requiresActiveUser, categoryRouter);
app.use('/api/v1/social/bookmarks', requiresAuth, requiresActiveUser, bookmarkRouter);
app.use('/api/v1/social/like', requiresAuth, requiresActiveUser, likeRouter);

// 6. Global error handler
app.use(errorHandler);

export default app;