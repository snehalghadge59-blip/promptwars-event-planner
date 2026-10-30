/**
 * @fileoverview Core domain types for AuraPlan AI.
 *
 * Defines the complete TypeScript type contract for event plans, budget
 * allocations, timeline items, vendor tasks, invitations, risk analysis,
 * and user-supplied event configuration.
 *
 * All interfaces are pure data types with no runtime behaviour, making them
 * safe to import in both application and test code.
 */

/**
 * A single budget category within a 5-pillar event budget allocation.
 */
export interface BudgetCategory {
  /** Human-readable category label (e.g. "Venue & Infrastructure"). */
  category: string;
  /** Planned allocation amount in the event's currency. */
  allocated: number;
  /** Share of the total budget as a whole-number percentage (0–100). */
  percentage: number;
  /** Negotiation tip or cost-optimisation insight for this category. */
  tips: string;
  /** Optional actual expenditure recorded during or after the event. */
  actualSpent?: number;
}


/**
 * Complete budget allocation for an event, including the contingency reserve
 * and a breakdown across all expenditure categories.
 */
export interface BudgetAllocation {
  /** Total event budget in the stated currency. */
  total: number;
  /** ISO 4217 currency code (e.g. `'INR'`, `'USD'`). */
  currency: string;
  /** Pre-allocated contingency reserve (typically 12% of total). */
  contingencyReserve: number;
  /** Ordered array of budget category breakdowns. */
  categories: BudgetCategory[];
}


/**
 * A single activity entry in the event run-of-show timeline,
 * as produced by the ChronoPlanner agent.
 */
export interface TimelineItem {
  /** Optional stable identifier used as React key. */
  id?: string;
  /** Human-readable start time (e.g. `"04:00 PM"` or `"18:00"`). */
  time: string;
  /** Phase of the event this activity belongs to. */
  phase: 'Arrival' | 'Core Ceremony' | 'Reception' | 'Wrap-up' | 'Networking' | 'Keynote' | 'Hack Time' | string;
  /** Short activity title displayed in the timeline card. */
  activity: string;
  /** Operational detail or stage-management instruction. */
  details: string;
  /** Friction-damping buffer allocated after this activity (in minutes). */
  bufferMinutes: number;
  /** Whether the organiser has marked this activity as completed. */
  completed?: boolean;
}


/**
 * A vendor procurement task produced by the Logistics Agent,
 * including deadline, priority, and a mandatory contract clause.
 */
export interface VendorTask {
  /** Unique identifier used as React key and for toggle operations. */
  id: string;
  /** Vendor category label (e.g. `"Venue"`, `"Catering"`, `"Media"`). */
  category: string;
  /** Full description of the procurement action required. */
  task: string;
  /** Number of weeks before the event this task must be completed. */
  deadlineWeeksBefore: number;
  /** Task urgency classification. */
  priority: 'High' | 'Medium' | 'Low';
  /** Key contract clause or negotiation point the organiser must verify. */
  negotiationCheck: string;
  /** Whether the organiser has marked this task as complete. */
  completed?: boolean;
}


/**
 * AI-generated dual-channel invitation copy produced by the
 * Concept Architect agent.
 */
export interface InvitationStudio {
  /** Formal digital invitation text suitable for email or printed cards. */
  formalInvitation: string;
  /** Casual, emoji-optimised WhatsApp / social RSVP broadcast copy. */
  casualWhatsAppCopy: string;
  /** RSVP call-to-action instructions (deadline, contact method, link). */
  rsvpCallToAction: string;
}


/**
 * A single entry in the FMEA (Failure Mode & Effects Analysis)
 * risk & contingency matrix, produced by the Sentinel Agent.
 */
export interface RiskContingency {
  /** Plain-language description of the identified vulnerability. */
  risk: string;
  /** Likelihood that this risk will materialise. */
  probability: 'Low' | 'Med' | 'High';
  /** Severity of impact if the risk occurs. */
  impact: 'Low' | 'Med' | 'High' | 'Critical';
  /** Autonomous Plan B action to execute when the trigger fires. */
  contingencyPlan: string;
  /** Measurable condition that activates the contingency protocol. */
  triggerCondition: string;
}


/**
 * Creative identity metadata for the event, produced by the
 * Concept Architect sub-agent.
 */
export interface EventSummary {
  /** Evocative, high-end event title (e.g. "The Grand Jaipur Heritage Royal Wedding"). */
  title: string;
  /** 2-sentence creative mood & aesthetic vision for the event. */
  themeConcept: string;
  /** Array of HEX colour codes defining the event's architectural palette. */
  colorPalette: string[];
  /** Specific dress code guideline for guests. */
  dressCode: string;
  /** Memorable event motto or tagline. */
  tagline: string;
}


/**
 * A fully-synthesised event plan — the primary data model
 * rendered by the AuraPlan AI dashboard.
 *
 * Produced either by the Gemini API or the deterministic
 * client-side synthesiser in {@link generateEventPlan}.
 */
export interface EventPlan {
  /** Unique plan identifier (e.g. `"plan-wedding-01"` or `"plan-synth-1234567890"`). */
  id: string;
  /** ISO 8601 timestamp recording when this plan was created. */
  createdAt: string;
  /** Human-readable event type (e.g. `"Royal Heritage Destination Wedding"`). */
  eventType: string;
  /** Optional ISO date string for the event day (e.g. `"2026-12-15"`). */
  eventDate?: string;
  /** Confirmed or estimated guest count. */
  guestCount: number;
  /** Total planned event duration in hours. */
  durationHours: number;
  /** Venue type and location descriptor. */
  locationType: string;
  /** Any special constraints, dietary requirements, or accessibility needs. */
  specialRequirements?: string;
  /** Optional URL path to the venue atmosphere cover image. */
  coverImage?: string;
  /** Creative identity metadata from the Concept Architect agent. */
  eventSummary: EventSummary;
  /** 5-pillar budget breakdown from the Quant Agent. */
  budgetAllocation: BudgetAllocation;
  /** Ordered run-of-show timeline from the ChronoPlanner agent. */
  timelineItinerary: TimelineItem[];
  /** Procurement task matrix from the Logistics Agent. */
  vendorChecklist: VendorTask[];
  /** Dual-channel invitation copy from the Concept Architect agent. */
  invitationStudio: InvitationStudio;
  /** FMEA risk & contingency matrix from the Sentinel Agent. */
  riskContingencyMatrix: RiskContingency[];
  /** Optional interactive attendee RSVP roster and dietary triage tracking. */
  guestList?: GuestItem[];
}

/**
 * Represents an attendee/guest in the RSVP Management Matrix.
 */
export interface GuestItem {
  /** Unique guest identifier (e.g. `"g-1"`). */
  id: string;
  /** Full name or party title. */
  name: string;
  /** Categorical tier for table seating and priority access. */
  category: 'VIP' | 'Family' | 'General' | 'Crew';
  /** Current RSVP confirmation status. */
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  /** Number of accompanying guests/plus-ones. */
  plusOnes: number;
  /** Dietary preferences or restrictions (e.g. "Pure Vegetarian", "Gluten-Free"). */
  dietary: string;
  /** Table or seating zone assignment. */
  tableNumber?: string;
}


/**
 * User-supplied event configuration collected by the
 * {@link EventInputModal} form, sanitized by {@link sanitizeEventInput},
 * and passed to {@link generateEventPlan}.
 */
export interface EventInput {
  /** Type of event being planned (e.g. `"Wedding"`, `"Hackathon"`). */
  eventType: string;
  /** Target event date in `YYYY-MM-DD` format, or empty string if flexible. */
  eventDate: string;
  /** Total budget in the stated currency unit. */
  totalBudget: number;
  /** ISO 4217 currency code (e.g. `'INR'`, `'USD'`). */
  currency: string;
  /** Expected number of attendees. */
  guestCount: number;
  /** Planned event duration in hours. */
  durationHours: number;
  /** Venue type and geographical setting. */
  locationType: string;
  /** Special requirements, dietary constraints, or accessibility needs. */
  specialRequirements: string;
}
