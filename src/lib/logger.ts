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
};
