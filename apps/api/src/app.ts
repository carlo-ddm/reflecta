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

const allowedMethods = ['GET', 'POST', 'DELETE', 'OPTIONS', 'HEAD'] as const;
const allowedMethodsSet = new Set<string>(allowedMethods);
const rateLimitWindowMs = 10_000;
const rateLimitMax = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

app.disable('x-powered-by');

app.use((req, res, next) => {
  if (config.corsOrigin === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use((req, res, next) => {
  if (allowedMethodsSet.has(req.method)) {
    return next();
  }

  res.setHeader('Allow', allowedMethods.join(', '));
  return res.status(405).json({ message: 'Method Not Allowed' });
});

app.use((req, res, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  if (!req.is('application/json')) {
    return res.status(415).json({ message: 'Content-Type must be application/json' });
  }

  next();
});

app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return next();
  }

  const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return next();
  }

  if (entry.count >= rateLimitMax) {
    return res.status(429).json({ message: 'Too Many Requests' });
  }

  entry.count += 1;
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(healthRoute);
app.use(analysisRoute);
app.use(entriesRoute);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, config.bindHost, () => {
  console.log(
    `API up — env: ${config.nodeEnv} — host: ${config.bindHost} — port: ${config.port} — health: http://localhost:${config.port}/health`,
  );
});
