import config from './config/config.js';
import express, { Application } from 'express';

// Routes
import healthRouter from './routes/health.js';

const app: Application = express();
const healthRoute = healthRouter;

app.use(healthRoute);

app.listen(config.port, () => {
  console.log(`API up — env: ${config.nodeEnv} — port: ${config.port} — health: http://localhost:${config.port}/health`);
});
