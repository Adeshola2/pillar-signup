import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './lib/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();

// Needed so rate limiting and secure cookies work behind a reverse proxy in production.
if (env.isProd) app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
