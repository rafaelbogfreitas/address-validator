import { Router } from 'express';
import { validateAddress } from '../controllers/validate-controller';
import { rateLimiter } from '../middlewares/rate-limit';

export const validateRouter = Router();

validateRouter.post('/validate-address', rateLimiter, validateAddress);
