/* istanbul ignore file */
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'test') return;
    if (meta) {
      console.info(message, meta);
    } else {
      console.info(message);
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'test') return;
    if (meta) {
      console.error(message, meta);
    } else {
      console.error(message);
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'test') return;
    if (meta) {
      console.warn(message, meta);
    } else {
      console.warn(message);
    }
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'development') return;
    if (meta) {
      console.debug(message, meta);
    } else {
      console.debug(message);
    }
  },
};
