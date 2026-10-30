/**
 * Tests for useEventPlan hook — using lightweight vitest mocks
 * without @testing-library/react to keep dependencies minimal.
 * These tests exercise the pure logic that the hook encapsulates.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';
import { generateEventPlan } from '../services/aiService';

// Verify the hook's underlying service functions are consistent with the preset blueprints
describe('useEventPlan — Business Logic Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have all 3 expected preset blueprints available for selection', () => {
    const keys = Object.keys(MOCK_BLUEPRINTS);
    expect(keys).toContain('royal-wedding');
    expect(keys).toContain('ai-hackathon');
    expect(keys).toContain('milestone-birthday');
    expect(keys.length).toBeGreaterThanOrEqual(3);
  });

  it('should produce a valid plan from generateEventPlan without an API key (client-side fallback)', async () => {
    const plan = await generateEventPlan({
      eventType: 'Corporate Anniversary',
      eventDate: '2026-12-15',
      totalBudget: 500000,
      currency: 'INR',
      guestCount: 80,
      durationHours: 4,
      locationType: 'Hotel Conference Hall',
      specialRequirements: 'Vegetarian menu, live band',
    });

    expect(plan).toBeDefined();
    expect(plan.id).toMatch(/^plan-synth-/);
    expect(plan.eventType).toBe('Corporate Anniversary');
    expect(plan.eventDate).toBe('2026-12-15');
    expect(plan.budgetAllocation.total).toBe(500000);
    expect(plan.budgetAllocation.categories.length).toBeGreaterThan(0);
    expect(plan.timelineItinerary.length).toBeGreaterThan(0);
    expect(plan.vendorChecklist.length).toBeGreaterThan(0);
    expect(plan.riskContingencyMatrix.length).toBeGreaterThan(0);
    expect(plan.invitationStudio.formalInvitation.length).toBeGreaterThan(10);
  });

  it('should correctly thread eventDate into the synthesized plan', async () => {
    const plan = await generateEventPlan({
      eventType: 'Birthday Party',
      eventDate: '2026-11-20',
      totalBudget: 100000,
      currency: 'INR',
      guestCount: 30,
      durationHours: 3,
      locationType: 'Rooftop',
      specialRequirements: '',
    });

    expect(plan.eventDate).toBe('2026-11-20');
  });

  it('should produce a plan with no eventDate when the field is empty', async () => {
    const plan = await generateEventPlan({
      eventType: 'Farewell Party',
      eventDate: '',
      totalBudget: 50000,
      currency: 'INR',
      guestCount: 20,
      durationHours: 2,
      locationType: 'Office Cafeteria',
      specialRequirements: '',
    });

    // Empty string eventDate should result in undefined (not empty string)
    expect(plan.eventDate).toBeUndefined();
  });

  it('should maintain mathematically coherent budgets across all preset blueprints', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([key, plan]) => {
      const { total, contingencyReserve, categories } = plan.budgetAllocation;
      const allocated = categories.reduce((sum, c) => sum + c.allocated, 0);
      const delta = Math.abs(total - (allocated + contingencyReserve));
      // Allow ≤1% delta due to floating-point rounding
      expect(delta, `Budget incoherent for preset: ${key}`).toBeLessThanOrEqual(total * 0.01 + 1);
    });
  });

  it('should gracefully handle zero-budget edge case in client-side synthesizer', async () => {
    // Zero budget should not produce NaN or negative amounts
    const plan = await generateEventPlan({
      eventType: 'Test Event',
      eventDate: '',
      totalBudget: 0,
      currency: 'INR',
      guestCount: 10,
      durationHours: 1,
      locationType: 'TBD',
      specialRequirements: '',
    });

    plan.budgetAllocation.categories.forEach((cat) => {
      expect(cat.allocated).toBeGreaterThanOrEqual(0);
      expect(Number.isNaN(cat.allocated)).toBe(false);
    });
  });
});
