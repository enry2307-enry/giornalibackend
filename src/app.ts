import express from 'express';
import { UserBaseRouter } from './routes/userBaseRouter';
import { ViewerRouter } from './routes/viewerRouter';
import { errorHandler } from './middleware/errorHandler';

import helmet from 'helmet';

const app = express();

app.use(express.json());

app.use(helmet());

// Routes
app.use('/userbase', UserBaseRouter);
app.use('/viewer', ViewerRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;