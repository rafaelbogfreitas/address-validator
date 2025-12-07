import type { Request, Response, NextFunction } from 'express';
import {
  addressRequestSchema,
  addressResponseSchema,
} from '../schemas/address';
import { getValidator } from '../validation';

export const validateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = addressRequestSchema.parse(req.body);
    const validator = getValidator();
    const result = await validator.validate(parsed);
    const response = addressResponseSchema.parse(result);
    res.json(response);
  } catch (err) {
    if (err instanceof Error && 'errors' in (err as never)) {
      (err as Error & { status?: number }).status = 400;
    }
    next(err);
  }
};
