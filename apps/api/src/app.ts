import http from 'http';
import config from './config/config.js';
import express from 'express';

const app = express();

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
