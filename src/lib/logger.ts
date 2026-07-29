/**
 * Environment-aware logger.
 * Detailed diagnostics are only emitted during development so production
 * builds never leak internal implementation details to the browser console.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
    // In production, forward to a monitoring service instead of the console.
  },
};

/** Generic, user-safe error message. */
export const userErrorMessage = (fallback = "Something went wrong. Please try again.") => fallback;
