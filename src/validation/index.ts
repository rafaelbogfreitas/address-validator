import { config } from '../config';
import { heuristicValidator, HeuristicValidator } from './heuristic';
import { geocodioProvider } from './providers/geocodio';
import type { Validator } from './validator';
import { logger } from '../lib/logger';

export type { Validator } from './validator';
export { heuristicValidator, HeuristicValidator };

export const getValidator = (): Validator => {
  if (config.ENABLE_PROVIDER === 'geocodio' && geocodioProvider) {
    logger.debug('Using Geocodio provider', { provider: 'geocodio' });
    return geocodioProvider;
  }

  logger.debug('Using Heuristic validator', { provider: 'heuristic' });
  return heuristicValidator;
};
