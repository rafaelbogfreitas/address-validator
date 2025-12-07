import http from 'node:http';
import { createApp } from './app';
import { config } from './config';
import { logger } from './lib/logger';

const app = createApp();
const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server listening on port ${config.PORT}`);
});

const shutdown = () => {
  logger.info('Shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
