import type { Request, Response, NextFunction } from 'express';
import {
  addressRequestSchema,
  addressResponseSchema,
} from '../schemas/address';
import { heuristicValidator } from '../validation';

export const validateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = addressRequestSchema.parse(req.body);
    const result = await heuristicValidator.validate(parsed);
    const response = addressResponseSchema.parse(result);
    res.json(response);
  } catch (err) {
    next(err);
  }
};
