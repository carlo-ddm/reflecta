import config from './config/config.js';
import express, { Application } from 'express';

// Routes
import healthRouter from './routes/health.js';
import analysisRouter from './routes/analysis.js';
import entriesRouter from './routes/entries.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

const app: Application = express();
const healthRoute = healthRouter;
const analysisRoute = analysisRouter;
const entriesRoute = entriesRouter;

app.use((req, res, next) => {
  if (config.corsOrigin === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());
app.use(healthRoute);
app.use(analysisRoute);
app.use(entriesRoute);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API up — env: ${config.nodeEnv} — port: ${config.port} — health: http://localhost:${config.port}/health`);
});
