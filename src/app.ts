import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config';
import { errorHandler } from './middleware/errHandler.middleware';

// Routers
import { authRouter } from './domains/auth/auth.router';
import { profileRouter } from './domains/profiles/profiles.router';


const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({
  origin: config.nodeEnv === 'production' ? 'https://tuodominio.it' : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profileRouter);

// Global error handler
app.use(errorHandler);

export default app;