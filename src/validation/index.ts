import { config } from '../config';
import { heuristicValidator, HeuristicValidator } from './heuristic';
import { geocodioProvider } from './providers/geocodio';
import type { Validator } from './validator';

export type { Validator } from './validator';
export { heuristicValidator, HeuristicValidator };

export const getValidator = (): Validator => {
  if (config.ENABLE_PROVIDER === 'geocodio' && geocodioProvider) {
    return geocodioProvider;
  }
  return heuristicValidator;
};
