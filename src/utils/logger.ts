/**
 * @fileoverview Structured application logger for AuraPlan AI.
 *
 * Wraps native `console` methods behind a consistent interface so that:
 * - Log calls are prefixed with the application name for easy filtering.
 * - All logging can be disabled in test environments via the
 *   `VITE_DISABLE_LOGS` environment variable (set to `"true"`).
 * - Production builds never surface debug-level noise.
 *
 * @example
 * ```ts
 * import { logger } from '../utils/logger';
 * logger.warn('Gemini API failed, switching to fallback', err);
 * logger.error('Unhandled synthesis error', err);
 * ```
 */

/** Log level constants used for structured emission. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const PREFIX = '[AuraPlan]';

/**
 * Returns `true` when logging should be completely suppressed.
 * Logging is suppressed in Vitest test runs to keep output clean.
 */
function isSilenced(): boolean {
  // Respect explicit opt-out via env var
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DISABLE_LOGS === 'true') {
    return true;
  }
  // Suppress in Vitest test environment
  if (typeof process !== 'undefined' && process.env?.VITEST === 'true') {
    return true;
  }
  return false;
}

/**
 * Emits a debug-level message. Only visible in development builds.
 *
 * @param message - Human-readable message.
 * @param data    - Optional additional structured data to emit.
 */
function debug(message: string, ...data: unknown[]): void {
  if (isSilenced()) return;
  if (import.meta.env?.DEV) {
    console.debug(`${PREFIX} [DEBUG] ${message}`, ...data);
  }
}

/**
 * Emits an informational message.
 *
 * @param message - Human-readable message.
 * @param data    - Optional additional structured data to emit.
 */
function info(message: string, ...data: unknown[]): void {
  if (isSilenced()) return;
  console.info(`${PREFIX} ${message}`, ...data);
}

/**
 * Emits a warning — used for recoverable error conditions such as
 * API fallbacks or unexpected-but-handled state transitions.
 *
 * @param message - Human-readable warning.
 * @param data    - Optional additional structured data to emit.
 */
function warn(message: string, ...data: unknown[]): void {
  if (isSilenced()) return;
  console.warn(`${PREFIX} ⚠️  ${message}`, ...data);
}

/**
 * Emits an error — used for unrecoverable failures and boundary conditions.
 *
 * @param message - Human-readable error description.
 * @param data    - Optional additional structured data to emit.
 */
function error(message: string, ...data: unknown[]): void {
  if (isSilenced()) return;
  console.error(`${PREFIX} ❌ ${message}`, ...data);
}

/** Singleton logger instance exported for use throughout the application. */
export const logger = { debug, info, warn, error } as const;
