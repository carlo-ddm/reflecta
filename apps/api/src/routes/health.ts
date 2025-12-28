import express, { Router } from 'express';

const healthRouter: Router = express.Router();

// Fix me (await)
healthRouter.get('/health', async (req, res) => {
  const event = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: event.toLocaleDateString('it-IT', options),
  };

  try {
    res.status(200).send(healthCheck);
  } catch {
    ((healthCheck.message = 'error'), res.status(503).send());
  }
});

export default healthRouter;
