import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { problemJson } from '../lib/problem';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(
    problemJson({
      status: 404,
      title: 'Not Found',
      detail: `Route ${req.originalUrl} not found`,
      instance: req.originalUrl,
    }),
  );
};

export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next;
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const detail = status >= 500 ? 'Internal server error' : err.message;
  logger.error('Request failed', {
    status,
    detail: err.message,
    requestId: (req as Request & { requestId?: string }).requestId,
  });

  res
    .status(status)
    .type('application/problem+json')
    .json(
      problemJson({
        status,
        title: status >= 500 ? 'Internal Server Error' : 'Bad Request',
        detail,
        instance: req.originalUrl,
      }),
    );
};
