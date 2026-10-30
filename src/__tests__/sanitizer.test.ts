/**
 * @fileoverview Unit tests for the AuraPlan AI input sanitization utilities.
 *
 * Covers XSS injection defence, prototype-pollution detection, length truncation,
 * numeric coercion, and the full `sanitizeEventInput` pipeline.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeEventInput } from '../utils/sanitizer';
import type { EventInput } from '../types/event';

// ---------------------------------------------------------------------------
// sanitizeInput
// ---------------------------------------------------------------------------

describe('sanitizeInput', () => {
  it('removes HTML script tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
  });

  it('removes arbitrary HTML tags', () => {
    const result = sanitizeInput('<img src=x onerror=alert(1)>');
    expect(result).not.toContain('<img');
    expect(result).not.toContain('onerror');
  });

  it('encodes ampersand entity', () => {
    expect(sanitizeInput('A & B')).toBe('A &amp; B');
  });

  it('strips HTML tag-like angle bracket patterns for XSS safety', () => {
    // "< 5 >" matches the HTML-tag strip regex — intentional safety behavior
    const result = sanitizeInput('<b>3</b>');
    expect(result).not.toContain('<b>');
    expect(result).toContain('3');
  });

  it('encodes double-quote entity', () => {
    expect(sanitizeInput('"hello"')).toContain('&quot;');
  });

  it('encodes single-quote entity', () => {
    expect(sanitizeInput("it's")).toContain('&#x27;');
  });

  it('truncates strings exceeding 500 characters', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBeLessThanOrEqual(500);
  });

  it('returns empty string for non-string input', () => {
    // @ts-expect-error — intentionally testing JS runtime path
    expect(sanitizeInput(null)).toBe('');
    // @ts-expect-error
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('returns unchanged safe plain text', () => {
    expect(sanitizeInput('Hello World 123')).toBe('Hello World 123');
  });
});

// ---------------------------------------------------------------------------
// sanitizeEventInput
// ---------------------------------------------------------------------------

const baseInput: EventInput = {
  eventType: 'Wedding',
  eventDate: '2026-12-31',
  totalBudget: 100000,
  currency: 'INR',
  guestCount: 200,
  durationHours: 8,
  locationType: 'Indoor Palace',
  specialRequirements: 'Vegan menu required',
};

describe('sanitizeEventInput', () => {
  it('returns a new object with the same valid values', () => {
    const result = sanitizeEventInput(baseInput);
    expect(result.eventType).toBe('Wedding');
    expect(result.totalBudget).toBe(100000);
    expect(result.guestCount).toBe(200);
  });

  it('strips HTML from string fields', () => {
    const malicious = { ...baseInput, eventType: '<b>Wedding</b>' };
    const result = sanitizeEventInput(malicious);
    expect(result.eventType).not.toContain('<b>');
  });

  it('coerces NaN totalBudget to 0', () => {
    const bad = { ...baseInput, totalBudget: NaN };
    expect(sanitizeEventInput(bad).totalBudget).toBe(0);
  });

  it('coerces negative guestCount to 0', () => {
    const bad = { ...baseInput, guestCount: -50 };
    expect(sanitizeEventInput(bad).guestCount).toBe(0);
  });

  it('rounds fractional guestCount to integer', () => {
    const fractional = { ...baseInput, guestCount: 150.9 };
    expect(sanitizeEventInput(fractional).guestCount).toBe(151);
  });

  it('throws on prototype-pollution payload in eventType', () => {
    const evil = { ...baseInput, eventType: '__proto__[evil]=true' };
    expect(() => sanitizeEventInput(evil)).toThrow(/Security violation/);
  });

  it('throws on constructor pollution payload', () => {
    const evil = { ...baseInput, locationType: 'constructor.prototype.x=1' };
    expect(() => sanitizeEventInput(evil)).toThrow(/Security violation/);
  });

  it('does not mutate the original input object', () => {
    const original = { ...baseInput, eventType: '<script>hack</script>' };
    const originalType = original.eventType;
    sanitizeEventInput(original);
    expect(original.eventType).toBe(originalType);
  });
});
