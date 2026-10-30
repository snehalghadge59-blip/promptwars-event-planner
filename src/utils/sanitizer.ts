/**
 * @fileoverview Input sanitization utilities for AuraPlan AI.
 *
 * Provides defence-in-depth sanitization against:
 * - Cross-Site Scripting (XSS) via HTML injection in user-controlled text fields.
 * - Prototype pollution via `__proto__`, `constructor`, and `prototype` keys.
 * - Excessive input length that could exhaust rendering or AI token budgets.
 *
 * All sanitization is performed client-side before values reach the AI service
 * or React state. Server-side validation should be applied independently when
 * a backend is introduced.
 *
 * @example
 * ```ts
 * import { sanitizeInput, sanitizeEventInput } from './sanitizer';
 *
 * const safe = sanitizeInput(userInput);
 * const safeEvent = sanitizeEventInput(rawEventInput);
 * ```
 */

import type { EventInput } from '../types/event';

/** Maximum character length accepted for any free-text event field. */
const MAX_TEXT_LENGTH = 500;

/**
 * Strips HTML tags and encodes the five most dangerous HTML entities to
 * neutralise XSS payloads embedded in user-controlled strings.
 *
 * @param raw - Raw user-supplied string.
 * @returns Sanitized string safe for rendering in text nodes.
 */
export function sanitizeInput(raw: string): string {
  if (typeof raw !== 'string') return '';

  // Truncate to prevent token-budget exhaustion
  const truncated = raw.slice(0, MAX_TEXT_LENGTH);

  // Strip all HTML/XML tags
  const stripped = truncated.replace(/<[^>]*>/g, '');

  // Encode the five canonical HTML entities
  return stripped
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Detects prototype-pollution attack patterns in a string value.
 *
 * @param value - String to inspect.
 * @returns `true` if the string contains a prototype-pollution pattern.
 *
 * @internal
 */
function hasPrototypePollutionPattern(value: string): boolean {
  const POLLUTION_PATTERNS = ['__proto__', 'constructor', 'prototype'];
  const lower = value.toLowerCase();
  return POLLUTION_PATTERNS.some((p) => lower.includes(p));
}

/**
 * Applies sanitization to every free-text field in an {@link EventInput}
 * object, guarding against XSS and prototype-pollution attacks before the
 * object is passed to the AI service or stored in React state.
 *
 * Numeric fields (`totalBudget`, `guestCount`, `durationHours`) are
 * coerced to non-negative finite numbers; non-numeric values are replaced
 * with `0` to prevent silent NaN propagation.
 *
 * @param input - Raw event input supplied by the user via the form.
 * @returns A new {@link EventInput} object with all fields sanitized.
 *
 * @throws {Error} If `input` contains a prototype-pollution payload in any
 *   string field.
 */
export function sanitizeEventInput(input: EventInput): EventInput {
  const stringFields: Array<keyof EventInput> = [
    'eventType',
    'eventDate',
    'currency',
    'locationType',
    'specialRequirements',
  ];

  // Prototype-pollution guard
  for (const field of stringFields) {
    const value = String(input[field] ?? '');
    if (hasPrototypePollutionPattern(value)) {
      throw new Error(
        `Security violation detected in field "${field}". Submission rejected.`
      );
    }
  }

  return {
    eventType: sanitizeInput(input.eventType),
    eventDate: sanitizeInput(input.eventDate),
    totalBudget: Number.isFinite(input.totalBudget) && input.totalBudget >= 0
      ? input.totalBudget
      : 0,
    currency: sanitizeInput(input.currency),
    guestCount: Number.isFinite(input.guestCount) && input.guestCount >= 0
      ? Math.round(input.guestCount)
      : 0,
    durationHours: Number.isFinite(input.durationHours) && input.durationHours >= 0
      ? input.durationHours
      : 0,
    locationType: sanitizeInput(input.locationType),
    specialRequirements: sanitizeInput(input.specialRequirements),
  };
}
