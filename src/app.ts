import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { validateRouter } from './routes/validate';
import { notFoundHandler, errorHandler } from './middlewares/error-handler';
import { requestIdMiddleware } from './middlewares/request-id';

export const createApp = () => {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(
    cors({
      origin: true,
      methods: ['POST'],
    }),
  );
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined', {
      skip: () => config.NODE_ENV === 'test',
    }),
  );

  app.use('/v1', validateRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
