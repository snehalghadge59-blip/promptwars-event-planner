import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../utils/logger';

describe('Logger Utility Suite', () => {
  const originalVitest = process.env.VITEST;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.VITEST = originalVitest;
    vi.restoreAllMocks();
  });

  it('exposes info, warn, error, and debug methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('suppresses logging when VITEST is active', () => {
    process.env.VITEST = 'true';
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('Should be silenced');
    expect(spy).not.toHaveBeenCalled();
  });

  it('delegates warn to console.warn with structured prefix when un-silenced', () => {
    process.env.VITEST = 'false';
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Test warning message', { code: 42 });
    expect(spy).toHaveBeenCalledWith('[AuraPlan] ⚠️  Test warning message', { code: 42 });
  });

  it('delegates error to console.error with structured prefix when un-silenced', () => {
    process.env.VITEST = 'false';
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('Fail');
    logger.error('Test error message', err);
    expect(spy).toHaveBeenCalledWith('[AuraPlan] ❌ Test error message', err);
  });

  it('delegates info to console.info with structured prefix when un-silenced', () => {
    process.env.VITEST = 'false';
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('System initialized');
    expect(spy).toHaveBeenCalledWith('[AuraPlan] System initialized');
  });
});
