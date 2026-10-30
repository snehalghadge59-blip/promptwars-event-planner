/**
 * @fileoverview Global application constants for AuraPlan AI.
 *
 * Centralises all magic strings, numeric thresholds, and configuration values
 * to eliminate hard-coded literals scattered across the codebase and ensure
 * a single source of truth for every tunable parameter.
 */

// ---------------------------------------------------------------------------
// Budget configuration
// ---------------------------------------------------------------------------

/** Default contingency reserve as a fraction of total budget (12%). */
export const DEFAULT_CONTINGENCY_FRACTION = 0.12;

/** Minimum contingency fraction allowed (10%). */
export const MIN_CONTINGENCY_FRACTION = 0.10;

/** Maximum contingency fraction allowed (15%). */
export const MAX_CONTINGENCY_FRACTION = 0.15;

/** Rounding tolerance for budget coherence check (0.1% of total or 1 currency unit). */
export const BUDGET_COHERENCE_TOLERANCE_FRACTION = 0.001;

/** Catering portion buffer above confirmed RSVP count (5%). */
export const CATERING_BUFFER_FRACTION = 0.05;

// ---------------------------------------------------------------------------
// Budget allocation percentages (spendable budget after contingency)
// ---------------------------------------------------------------------------

/** Venue & Infrastructure allocation share. */
export const VENUE_SHARE = 0.35;

/** Food & Beverage allocation share. */
export const FOOD_SHARE = 0.30;

/** Decor, Lighting & AV allocation share. */
export const DECOR_SHARE = 0.15;

/** Entertainment & Media allocation share. */
export const ENTERTAINMENT_SHARE = 0.12;

// ---------------------------------------------------------------------------
// Session storage keys
// ---------------------------------------------------------------------------

/** sessionStorage key used to persist the Gemini API key for the browser session. */
export const SESSION_KEY_GEMINI_API = 'gemini_api_key';

// ---------------------------------------------------------------------------
// AI / Gemini API
// ---------------------------------------------------------------------------

/** Gemini model identifier used for event plan synthesis. */
export const GEMINI_MODEL = 'gemini-2.0-flash';

/** Gemini API base URL template. */
export const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Sampling temperature for Gemini generation (lower = more deterministic). */
export const GEMINI_TEMPERATURE = 0.4;

/** Minimum character length for a valid API key. */
export const MIN_API_KEY_LENGTH = 10;

// ---------------------------------------------------------------------------
// ICS / Calendar export
// ---------------------------------------------------------------------------

/** PRODID string embedded in generated RFC 5545 iCalendar files. */
export const ICS_PRODID = '-//AuraPlan AI//Celebration Planner//EN';

// ---------------------------------------------------------------------------
// UI / UX timing
// ---------------------------------------------------------------------------

/** Duration (ms) for which the "Copied!" clipboard confirmation is shown. */
export const CLIPBOARD_CONFIRM_DURATION_MS = 2000;

/** Duration (ms) for which the colour swatch copy confirmation is shown. */
export const COLOUR_COPY_CONFIRM_DURATION_MS = 1500;

// ---------------------------------------------------------------------------
// Event presets
// ---------------------------------------------------------------------------

/** Identifier for the Royal Wedding evaluator preset. */
export const PRESET_ROYAL_WEDDING = 'royal-wedding';

/** Identifier for the AI Hackathon evaluator preset. */
export const PRESET_AI_HACKATHON = 'ai-hackathon';

/** Identifier for the Milestone Birthday evaluator preset. */
export const PRESET_MILESTONE_BIRTHDAY = 'milestone-birthday';

/** Identifier used when a user-synthesised custom plan is active. */
export const PRESET_CUSTOM = 'custom';

/** Default preset loaded on first render. */
export const DEFAULT_PRESET = PRESET_ROYAL_WEDDING;

// ---------------------------------------------------------------------------
// Confetti
// ---------------------------------------------------------------------------

/** Number of confetti particles fired on invitation copy. */
export const CONFETTI_PARTICLE_COUNT = 50;

/** Confetti spread angle in degrees. */
export const CONFETTI_SPREAD = 60;

/** Vertical origin of confetti burst (0 = top, 1 = bottom). */
export const CONFETTI_ORIGIN_Y = 0.8;
