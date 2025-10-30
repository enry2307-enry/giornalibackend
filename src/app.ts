import express from 'express';
// import anyCustomRoute from './routes/anyCUstomRoute';
import { errorHandler } from './middleware/errorHandler';

import helmet from 'helmet';

const app = express();

app.use(express.json());

app.use(helmet());

// Routes
// app.use('/any/custom/path/route', anyCustomRoute);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;