import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config';
import { userRouter } from './domains/auth/user.router';
import { errorHandler } from './middleware/errorHandler';

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
app.use('/api/v1/users', userRouter);

// Global error handler
app.use(errorHandler);

export default app;