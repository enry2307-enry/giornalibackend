import express from 'express';
import { userBaseRouter } from './routes/userBase';
import { viewerRouter } from './routes/viewer';
import { errorHandler } from './middleware/errorHandler';

import helmet from 'helmet';

const app = express();

app.use(express.json());

app.use(helmet());

// Routes
app.use('/userbase', userBaseRouter);
app.use('/viewer', viewerRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;

// GET https://nostrosito.com/userbase/0000-abdefg