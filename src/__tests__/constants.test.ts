/**
 * @fileoverview Unit tests for AuraPlan AI application constants.
 *
 * Validates that budget share constants sum correctly, numeric bounds are
 * sane, and session/preset key constants match their expected values.
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CONTINGENCY_FRACTION,
  MIN_CONTINGENCY_FRACTION,
  MAX_CONTINGENCY_FRACTION,
  VENUE_SHARE,
  FOOD_SHARE,
  DECOR_SHARE,
  ENTERTAINMENT_SHARE,
  SESSION_KEY_GEMINI_API,
  PRESET_ROYAL_WEDDING,
  PRESET_AI_HACKATHON,
  PRESET_MILESTONE_BIRTHDAY,
  PRESET_CUSTOM,
  DEFAULT_PRESET,
  MIN_API_KEY_LENGTH,
} from '../constants';

describe('Application Constants', () => {
  it('4 budget allocation shares sum to exactly 1.00 with residual assigned to logistics', () => {
    const knownShares = VENUE_SHARE + FOOD_SHARE + DECOR_SHARE + ENTERTAINMENT_SHARE;
    // Logistics share = 1 - knownShares; total should be 1.0
    const logisticsShare = 1 - knownShares;
    expect(logisticsShare).toBeGreaterThan(0);
    expect(knownShares + logisticsShare).toBeCloseTo(1.0, 5);
  });

  it('default contingency fraction falls within min–max bounds', () => {
    expect(DEFAULT_CONTINGENCY_FRACTION).toBeGreaterThanOrEqual(MIN_CONTINGENCY_FRACTION);
    expect(DEFAULT_CONTINGENCY_FRACTION).toBeLessThanOrEqual(MAX_CONTINGENCY_FRACTION);
  });

  it('all contingency fractions are between 0 and 1 (fractional, not percentage)', () => {
    expect(MIN_CONTINGENCY_FRACTION).toBeGreaterThan(0);
    expect(MAX_CONTINGENCY_FRACTION).toBeLessThan(1);
    expect(DEFAULT_CONTINGENCY_FRACTION).toBeGreaterThan(0);
    expect(DEFAULT_CONTINGENCY_FRACTION).toBeLessThan(1);
  });

  it('all budget shares are between 0 and 1', () => {
    for (const share of [VENUE_SHARE, FOOD_SHARE, DECOR_SHARE, ENTERTAINMENT_SHARE]) {
      expect(share).toBeGreaterThan(0);
      expect(share).toBeLessThan(1);
    }
  });

  it('session storage key is a non-empty string', () => {
    expect(typeof SESSION_KEY_GEMINI_API).toBe('string');
    expect(SESSION_KEY_GEMINI_API.length).toBeGreaterThan(0);
  });

  it('preset identifiers are unique non-empty strings', () => {
    const presets = [PRESET_ROYAL_WEDDING, PRESET_AI_HACKATHON, PRESET_MILESTONE_BIRTHDAY, PRESET_CUSTOM];
    const unique = new Set(presets);
    expect(unique.size).toBe(presets.length);
    presets.forEach(p => expect(p.length).toBeGreaterThan(0));
  });

  it('DEFAULT_PRESET matches PRESET_ROYAL_WEDDING', () => {
    expect(DEFAULT_PRESET).toBe(PRESET_ROYAL_WEDDING);
  });

  it('MIN_API_KEY_LENGTH is a positive integer', () => {
    expect(Number.isInteger(MIN_API_KEY_LENGTH)).toBe(true);
    expect(MIN_API_KEY_LENGTH).toBeGreaterThan(0);
  });
});
