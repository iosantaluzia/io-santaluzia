/**
 * Secure logging utility that disables console.log in production
 * SECURITY: Prevents sensitive information from being exposed in production console
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    // Always log errors, but sanitize sensitive data in production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, log errors without sensitive data
      const sanitized = args.map(arg => {
        if (typeof arg === 'string') {
          // Remove potential sensitive patterns
          return arg
            .replace(/password[=:]\s*\S+/gi, 'password=***')
            .replace(/token[=:]\s*\S+/gi, 'token=***')
            .replace(/key[=:]\s*\S+/gi, 'key=***')
            .replace(/secret[=:]\s*\S+/gi, 'secret=***');
        }
        return arg;
      });
      console.error(...sanitized);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

