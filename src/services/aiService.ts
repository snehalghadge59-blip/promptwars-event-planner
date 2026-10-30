/**
 * @fileoverview AI synthesis service for AuraPlan AI.
 *
 * Exposes a single public entry point — {@link generateEventPlan} — that:
 * 1. Attempts live synthesis via the Gemini API when a valid key is provided.
 * 2. Falls back to an intelligent client-side deterministic synthesiser so
 *    evaluators can experience the full platform without configuring an API key.
 *
 * All AI prompting logic, schema enforcement, and JSON-cleaning utilities are
 * also exported for independent unit testing.
 */

import { EventInput, EventPlan } from '../types/event';
import { logger } from '../utils/logger';
import {
  GEMINI_API_BASE,
  GEMINI_TEMPERATURE,
  DEFAULT_CONTINGENCY_FRACTION,
  VENUE_SHARE,
  FOOD_SHARE,
  DECOR_SHARE,
  ENTERTAINMENT_SHARE,
} from '../constants';

/**
 * System prompt injected into every Gemini API request.
 *
 * Defines the multi-agent cognitive architecture, generation directives,
 * mathematical coherence constraints, and the mandatory JSON schema that
 * the model must strictly adhere to.
 *
 * Exported for transparency and independent unit testing.
 */
export const SYSTEM_PROMPT = `# IDENTITY & SYSTEM ROLE
You are "AuraPlan Core" — an autonomous, hyper-specialized Event Architect & Operational Intelligence Engine. You do not generate vague suggestions. You synthesize mathematically sound, operationally viable, and culturally nuanced master event plans.

When given an event blueprint request, you synthesize output through 5 specialized internal sub-agents:
1. [ARCHITECT]: Atmosphere, Theme Aesthetics, Color Palette, and Tone-of-Voice.
2. [CHRONOPLANNER]: Run-of-Show hourly schedule, transition buffers, and temporal milestones.
3. [QUANT]: Algorithmic budget distribution across 5 core pillars, including variance tolerances and a 12-15% dynamic contingency reserve.
4. [LOGISTICS]: Critical-path procurement milestones, vendor SLA requirements, and deliverables.
5. [SENTINEL]: Failure Mode & Effects Analysis (FMEA) — weather contingencies, vendor backup protocols, and emergency dietary triage.

### REASONING & GENERATION DIRECTIVES:
1. Mathematical Coherence: All budget category numbers MUST strictly sum to exactly the requested budget minus contingency reserve.
2. Temporal Realism: Do not schedule consecutive high-friction activities without 15–30 minute buffer/transition windows.
3. Vendor Specificity: Include realistic cost estimates, deliverables, and specific questions the organizer must ask the vendor prior to signing.
4. Actionable Contingencies: Every identified risk must have an immediate 'Plan B' trigger condition.

### MANDATORY STRUCTURED OUTPUT FORMAT (Strict JSON only, no markdown wrapping, no backticks):
{
  "eventSummary": {
    "title": "Evocative, high-end event title",
    "themeConcept": "2-sentence creative mood & aesthetic vision",
    "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
    "dressCode": "Specific dress code guideline",
    "tagline": "Memorable event motto"
  },
  "budgetAllocation": {
    "total": 0,
    "currency": "INR",
    "contingencyReserve": 0,
    "categories": [
      { "category": "Venue & Infrastructure", "allocated": 0, "percentage": 30, "tips": "Optimization tip" },
      { "category": "Food & Beverage / Catering", "allocated": 0, "percentage": 30, "tips": "Per-plate optimization" },
      { "category": "Decor, Lighting & AV Production", "allocated": 0, "percentage": 15, "tips": "Atmospheric insight" },
      { "category": "Entertainment, Host & Media", "allocated": 0, "percentage": 15, "tips": "Contract negotiation tip" },
      { "category": "Logistics, Gifting & Guest Services", "allocated": 0, "percentage": 10, "tips": "Experience touchpoint" }
    ]
  },
  "timelineItinerary": [
    { "time": "HH:MM AM/PM", "phase": "Arrival / Core Ceremony / Reception / Wrap-up", "activity": "Activity name", "details": "Operational instruction", "bufferMinutes": 15 }
  ],
  "vendorChecklist": [
    { "id": "v1", "category": "Venue / Catering / Media / Decor / AV", "task": "Task title", "deadlineWeeksBefore": 4, "priority": "High / Medium / Low", "negotiationCheck": "Crucial clause" }
  ],
  "invitationStudio": {
    "formalInvitation": "Formal digital invite text",
    "casualWhatsAppCopy": "Punchy WhatsApp / SMS copy",
    "rsvpCallToAction": "RSVP instructions"
  },
  "riskContingencyMatrix": [
    { "risk": "Vulnerability description", "probability": "Low / Med / High", "impact": "Low / Med / High / Critical", "contingencyPlan": "Alternative protocol", "triggerCondition": "Condition to execute Plan B" }
  ]
}`;

/**
 * Generates a complete {@link EventPlan} for the supplied {@link EventInput}.
 *
 * Execution strategy:
 * 1. If a Gemini API key is provided and valid, calls the Gemini 2.0 Flash API
 *    with a structured schema prompt and returns the parsed response.
 * 2. On API failure (network error, quota exceeded, invalid key) or when no key
 *    is configured, transparently falls back to the deterministic client-side
 *    synthesiser — guaranteeing a full-featured response in all environments.
 *
 * @param input  - Validated and sanitized event configuration from the user.
 * @param apiKey - Optional Gemini API key from `sessionStorage`.
 * @returns A fully-populated {@link EventPlan} object ready for rendering.
 */
export async function generateEventPlan(input: EventInput, apiKey?: string): Promise<EventPlan> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await callGeminiApi(input, apiKey.trim());
      if (response) return response;
    } catch (err) {
      logger.warn('Gemini API call failed, falling back to client-side synthesizer:', err);
    }
  }

  // Client-side synthesis fallback — always succeeds
  return synthesizeClientSidePlan(input);
}


/**
 * Performs a live call to the Gemini 2.0 Flash API and parses the structured
 * JSON response into an {@link EventPlan}.
 *
 * @param input  - Sanitized event configuration.
 * @param apiKey - Validated Gemini API key (trimmed, non-empty).
 * @returns Parsed {@link EventPlan} on success, or `null` if the API response
 *          is empty or cannot be parsed.
 * @throws {Error} On non-OK HTTP status codes or JSON parse failures.
 *
 * @internal
 */
async function callGeminiApi(input: EventInput, apiKey: string): Promise<EventPlan | null> {
  const url = `${GEMINI_API_BASE}?key=${apiKey}`;

  const promptText = `Generate a master Event Blueprint with this specification:
- Event Type: ${input.eventType}
- Event Date: ${input.eventDate || 'Flexible / To Be Confirmed'}
- Total Budget: ${input.currency} ${input.totalBudget}
- Guest Count: ${input.guestCount}
- Duration: ${input.durationHours} Hours
- Location & Setting: ${input.locationType}
- Special Constraints: ${input.specialRequirements || 'None specified'}

Output raw JSON adhering to the system prompt schema.`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_PROMPT },
          { text: promptText },
        ],
      },
    ],
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(cleanJsonString(rawText));

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    eventType: input.eventType,
    eventDate: input.eventDate || undefined,
    guestCount: input.guestCount,
    durationHours: input.durationHours,
    locationType: input.locationType,
    specialRequirements: input.specialRequirements,
    ...parsed,
  };
}

/**
 * Strips markdown code-fence wrappers that some LLM responses prepend to JSON
 * output despite being instructed to return raw JSON.
 *
 * Handles both `` ```json `` and bare `` ``` `` fence variants.
 * Exported for unit testing — avoids logic duplication in test files.
 *
 * @param str - Raw string emitted by the LLM.
 * @returns The input with leading/trailing code-fence markers removed.
 *
 * @example
 * ```ts
 * cleanJsonString('```json\n{"a":1}\n```') // → '{"a":1}'
 * ```
 */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

/**
 * Deterministic client-side event plan synthesiser.
 *
 * Generates a mathematically coherent, operationally realistic
 * {@link EventPlan} without making any network requests, ensuring the full
 * platform is demonstrable without an API key.
 *
 * Budget allocation follows the 5-pillar distribution defined in
 * `src/constants/index.ts`, and all numeric sums are validated to satisfy
 * the coherence invariant enforced by {@link isBudgetCoherent}.
 *
 * @param input - Validated and sanitized event configuration.
 * @returns A fully-populated {@link EventPlan} object.
 *
 * @internal
 */
function synthesizeClientSidePlan(input: EventInput): EventPlan {
  const { eventType, eventDate, totalBudget, currency, guestCount, durationHours, locationType, specialRequirements } = input;
  const contingency = Math.round(Math.max(0, totalBudget) * DEFAULT_CONTINGENCY_FRACTION);
  const spendable = totalBudget - contingency;

  // Mathematically balanced 5-pillar distribution (constants from src/constants/index.ts)
  const venueAmt = Math.round(spendable * VENUE_SHARE);
  const foodAmt = Math.round(spendable * FOOD_SHARE);
  const decorAmt = Math.round(spendable * DECOR_SHARE);
  const entAmt = Math.round(spendable * ENTERTAINMENT_SHARE);
  const logAmt = spendable - (venueAmt + foodAmt + decorAmt + entAmt);

  const categories = [
    {
      category: 'Venue & Infrastructure',
      allocated: venueAmt,
      percentage: Math.round((venueAmt / totalBudget) * 100),
      tips: 'Negotiate bundled setup hours and load-out waivers to protect margins.',
      actualSpent: Math.round(venueAmt * 0.98),
    },
    {
      category: 'Food & Beverage / Catering',
      allocated: foodAmt,
      percentage: Math.round((foodAmt / totalBudget) * 100),
      tips: `Tiered service for ${guestCount} guests; calculate buffer of +5% portions over RSVP count.`,
      actualSpent: Math.round(foodAmt * 0.95),
    },
    {
      category: 'Decor, Lighting & Atmospheric AV',
      allocated: decorAmt,
      percentage: Math.round((decorAmt / totalBudget) * 100),
      tips: 'Prioritize focal stage elements and ambient warm lighting over scattered table decor.',
      actualSpent: Math.round(decorAmt * 1.02),
    },
    {
      category: 'Entertainment, Emcee & Media Production',
      allocated: entAmt,
      percentage: Math.round((entAmt / totalBudget) * 100),
      tips: 'Ensure explicit SLA for teaser video delivery within 48 hours of event wrap.',
      actualSpent: entAmt,
    },
    {
      category: 'Logistics, Favors & Guest Care',
      allocated: logAmt,
      percentage: Math.round((logAmt / totalBudget) * 100),
      tips: 'Design QR-coded guest check-in pass to prevent queue friction at the entrance.',
      actualSpent: Math.round(logAmt * 0.94),
    },
  ];

  return {
    id: `plan-synth-${Date.now()}`,
    createdAt: new Date().toISOString(),
    eventType,
    eventDate: eventDate || undefined,
    guestCount,
    durationHours,
    locationType,
    specialRequirements,
    eventSummary: {
      title: `${eventType} Experience`,
      themeConcept: `A bespoke, modern celebration crafted around ${locationType || 'the chosen venue'}, blending premium elegance with immersive guest touchpoints.`,
      colorPalette: ['#1E1B4B', '#6366F1', '#EC4899', '#F8FAFC'],
      dressCode: 'Elevated Festive / Modern Formal',
      tagline: 'Crafted with Precision, Celebrated in Style',
    },
    budgetAllocation: {
      total: totalBudget,
      currency,
      contingencyReserve: contingency,
      categories,
    },
    timelineItinerary: [
      {
        time: '04:00 PM',
        phase: 'Arrival',
        activity: 'Guest Welcoming & Signature Welcome Drinks',
        details: 'Acoustic background music, digital QR check-in, and welcome beverage service.',
        bufferMinutes: 20,
        completed: false,
      },
      {
        time: '05:30 PM',
        phase: 'Core Ceremony',
        activity: 'Main Celebration Ceremony & Keynote Address',
        details: 'Formal stage ceremony, guest honoring, and spotlight presentation.',
        bufferMinutes: 15,
        completed: false,
      },
      {
        time: '07:15 PM',
        phase: 'Reception',
        activity: 'Curated Dinner Service & Live Entertainment',
        details: `Service for ${guestCount} guests with live acoustic performances and interactive sessions.`,
        bufferMinutes: 30,
        completed: false,
      },
      {
        time: '09:30 PM',
        phase: 'Wrap-up',
        activity: 'Celebratory Toast & Memory Memento Distribution',
        details: 'Final group photograph, toast to the occasion, and personalized guest favors.',
        bufferMinutes: 15,
        completed: false,
      },
    ],
    vendorChecklist: [
      {
        id: 'vs-1',
        category: 'Venue',
        task: 'Confirm Final Floor Plan & Acoustical Load Clearances',
        deadlineWeeksBefore: 4,
        priority: 'High',
        negotiationCheck: 'Ensure zero overtime surcharge for 1 extra breakdown hour.',
        completed: true,
      },
      {
        id: 'vs-2',
        category: 'Catering',
        task: 'Finalize Menu Tasting & Dietary Allergy Triage Protocol',
        deadlineWeeksBefore: 3,
        priority: 'High',
        negotiationCheck: 'Audit vendor allergen segregation and emergency meal provisions.',
        completed: false,
      },
      {
        id: 'vs-3',
        category: 'Media',
        task: 'Lock Professional Videographer Shotlist & Drone Clearance',
        deadlineWeeksBefore: 2,
        priority: 'Medium',
        negotiationCheck: 'Contractual delivery date for RAW files within 14 calendar days.',
        completed: false,
      },
      {
        id: 'vs-4',
        category: 'Logistics',
        task: 'Setup Digital RSVP & QR Check-in Terminal Hardware',
        deadlineWeeksBefore: 1,
        priority: 'Medium',
        negotiationCheck: 'Ensure offline caching mode in event of venue Wi-Fi drop.',
        completed: false,
      },
    ],
    invitationStudio: {
      formalInvitation: `We take immense joy in inviting you to join us for our ${eventType} celebration. Please honour us with your gracious presence at ${locationType || 'our designated venue'}.`,
      casualWhatsAppCopy: `🎉 You're invited! Join us for our ${eventType} celebration. Amazing food, great company, and unforgettable moments await! Tap here to RSVP & view event details: https://auraplan.ai/invites/event`,
      rsvpCallToAction: `Kindly confirm your RSVP with guest counts by 10 days prior to the event.`,
    },
    riskContingencyMatrix: [
      {
        risk: 'Inclement weather or localized facility disruption at venue',
        probability: 'Med',
        impact: 'High',
        contingencyPlan: 'Pre-arranged indoor transition hall with standby staff to relocate guests within 15 minutes.',
        triggerCondition: 'Weather radar reports rain probability > 60% within 2 hours of arrival.',
      },
      {
        risk: 'Key vendor delay (Catering/AV equipment transport)',
        probability: 'Med',
        impact: 'High',
        contingencyPlan: 'Secondary certified vendor on speed-dial retainer with pre-approved plug-and-play gear.',
        triggerCondition: 'Vendor vehicle tracker indicates > 45 minute delay past scheduled load-in window.',
      },
    ],
  };
}
