import { config } from '../config';
import { heuristicValidator, HeuristicValidator } from './heuristic';
import { geocodioProvider } from './providers/geocodio';
import type { Validator } from './validator';
import { logger } from '../lib/logger';

export type { Validator } from './validator';
export { heuristicValidator, HeuristicValidator };

export const getValidator = (): Validator => {
  if (config.ENABLE_PROVIDER === 'geocodio' && geocodioProvider) {
    logger.info('Using Geocodio provider');
    return geocodioProvider;
  }

  logger.info('Using Heuristic validator');
  return heuristicValidator;
};
