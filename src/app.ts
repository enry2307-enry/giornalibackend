import express from 'express';
import { UserBaseRouter } from './routes/userBaseRouter';
import { errorHandler } from './middleware/errorHandler';

import helmet from 'helmet';

const app = express();

app.use(express.json());

app.use(helmet());

// Routes
app.use('UserBase', UserBaseRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;