import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { validateRouter } from './routes/validate';
import { notFoundHandler, errorHandler } from './middlewares/error-handler';
import { requestIdMiddleware } from './middlewares/request-id';
import {
  addressResponseUnionSchema,
  addressRequestSchema,
} from './schemas/address';
import { openApiDocument } from './openapi/doc';

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

  app.get('/docs/schema', (_req, res) => {
    const requestSchema = (
      addressRequestSchema as unknown as { openapi?: unknown }
    ).openapi;
    const responseSchema = (
      addressResponseUnionSchema as unknown as { openapi?: unknown }
    ).openapi;
    res.json({
      request: requestSchema ?? addressRequestSchema,
      response: responseSchema ?? addressResponseUnionSchema,
    });
  });

  app.get('/docs', (_req, res) => {
    res.json(openApiDocument);
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
