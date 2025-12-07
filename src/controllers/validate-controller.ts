import type { Request, Response, NextFunction } from 'express';
import {
  addressRequestSchema,
  addressResponseSchema,
} from '../schemas/address';
import { getValidator } from '../validation';
import { ValidationOutcome } from '../validation/validator';
import { CacheService } from '../services/CacheService';
import { logger } from '../lib/logger';

const validationCache = new CacheService<ValidationOutcome>((key) =>
  key.trim().toLowerCase(),
);

export const validateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = addressRequestSchema.parse(req.body);

    const response = await validationCache.remember(
      parsed.address,
      async (): Promise<ValidationOutcome> => {
        const validator = getValidator();
        const result = await validator.validate(parsed);
        return addressResponseSchema.parse(result);
      },
    );

    logger.debug('Cache lookup for address', { address: parsed.address });

    res.json(response);
  } catch (err) {
    if (err instanceof Error && 'errors' in (err as never)) {
      (err as Error & { status?: number }).status = 400;
    }
    next(err);
  }
};
