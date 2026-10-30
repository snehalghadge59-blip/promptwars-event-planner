import { describe, it, expect } from 'vitest';
import { sanitizeEventInput } from '../utils/sanitizer';
import { generateEventPlan } from '../services/aiService';
import * as componentsBarrel from '../components';
import * as utilsBarrel from '../utils';
import * as servicesBarrel from '../services';
import * as constantsBarrel from '../constants';

describe('End-to-End Pipeline & Architecture Integration', () => {
  it('safely processes raw untrusted input through sanitize + synthesize pipeline', async () => {
    // Malicious untrusted input with HTML script injection and prototype attack attempts
    const rawInput = {
      eventType: '<script>alert("hack")</script>Destination Gala & Celebration',
      eventDate: '2026-11-20',
      totalBudget: 2500000,
      currency: 'INR',
      guestCount: 200,
      durationHours: 8,
      locationType: '<iframe src="evil.com"></iframe>Lake Palace, Udaipur',
      specialRequirements: 'Royal fireworks <img src=x onerror=alert(1)> and pure veg menu',
    };

    // Step 1: Sanitization
    const sanitized = sanitizeEventInput(rawInput);
    expect(sanitized.eventType).not.toContain('<script>');
    expect(sanitized.locationType).not.toContain('<iframe');
    expect(sanitized.specialRequirements).not.toContain('<img');

    // Step 2: Synthesis
    const plan = await generateEventPlan(sanitized);

    // Invariants
    expect(plan.id).toBeDefined();
    expect(plan.budgetAllocation.total).toBe(2500000);
    expect(plan.guestCount).toBe(200);
    expect(plan.timelineItinerary.length).toBeGreaterThanOrEqual(4);
    expect(plan.vendorChecklist.length).toBeGreaterThanOrEqual(4);
    expect(plan.riskContingencyMatrix.length).toBeGreaterThanOrEqual(2);

    // Mathematical coherence check
    const catSum = plan.budgetAllocation.categories.reduce((acc, c) => acc + c.allocated, 0);
    const totalAllocated = catSum + plan.budgetAllocation.contingencyReserve;
    expect(Math.abs(totalAllocated - plan.budgetAllocation.total)).toBeLessThanOrEqual(5);
  });

  it('validates all barrel exports resolve cleanly with no undefined exports', () => {
    // Component barrel
    expect(componentsBarrel.EventHeader).toBeDefined();
    expect(componentsBarrel.Navbar).toBeDefined();
    expect(componentsBarrel.BudgetSection).toBeDefined();
    expect(componentsBarrel.TimelineSection).toBeDefined();
    expect(componentsBarrel.VendorSection).toBeDefined();
    expect(componentsBarrel.InvitationSection).toBeDefined();
    expect(componentsBarrel.RiskSentinelSection).toBeDefined();
    expect(componentsBarrel.GuestTrackerSection).toBeDefined();
    expect(componentsBarrel.ApiKeyModal).toBeDefined();
    expect(componentsBarrel.EventInputModal).toBeDefined();
    expect(componentsBarrel.ErrorBoundary).toBeDefined();

    // Utils barrel
    expect(utilsBarrel.sanitizeInput).toBeDefined();
    expect(utilsBarrel.sanitizeEventInput).toBeDefined();
    expect(utilsBarrel.logger).toBeDefined();
    expect(utilsBarrel.generateICS).toBeDefined();
    expect(utilsBarrel.generateMarkdownSummary).toBeDefined();

    // Services barrel
    expect(servicesBarrel.generateEventPlan).toBeDefined();
    expect(servicesBarrel.SYSTEM_PROMPT).toBeDefined();
    expect(servicesBarrel.cleanJsonString).toBeDefined();

    // Constants barrel
    expect(constantsBarrel.DEFAULT_CONTINGENCY_FRACTION).toBeDefined();
    expect(constantsBarrel.GEMINI_MODEL).toBeDefined();
  });
});
