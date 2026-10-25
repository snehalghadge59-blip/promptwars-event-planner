import { describe, it, expect } from 'vitest';
import {
  calculateTotalAllocated,
  calculateRemainingVariance,
  isBudgetCoherent,
  formatCurrency,
} from '../utils/budgetCalculator';
import { generateICS, generateMarkdownSummary } from '../utils/exportUtils';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';

describe('Event Orchestrator Edge Cases', () => {
  it('should calculate budget variances correctly with zero or full allocation', () => {
    const emptyVariance = calculateRemainingVariance(50000, [], 5000);
    expect(emptyVariance).toBe(45000);

    const fullAllocation = [
      { category: 'Venue', allocated: 25000, percentage: 50, tips: 'Negotiate early', actualSpent: 24000 },
      { category: 'Catering', allocated: 20000, percentage: 40, tips: 'Fixed rate per plate', actualSpent: 19500 },
    ];
    const zeroVariance = calculateRemainingVariance(50000, fullAllocation, 5000);
    expect(zeroVariance).toBe(0);
  });

  it('should gracefully handle empty category arrays in calculateTotalAllocated', () => {
    const emptySum = calculateTotalAllocated([]);
    expect(emptySum).toBe(0);
  });

  it('should validate budget coherence bounds accurately', () => {
    expect(isBudgetCoherent(0, [])).toBe(false);
    expect(isBudgetCoherent(-100, [])).toBe(false);

    const categories = [
      { category: 'Production', allocated: 88000, percentage: 88, tips: 'Package discount', actualSpent: 80000 },
    ];
    // 88000 + 12000 contingency = 100000 total
    expect(isBudgetCoherent(100000, categories, 12000)).toBe(true);
    expect(isBudgetCoherent(150000, categories, 12000)).toBe(false);
  });

  it('should format currency across multiple regional locales without crashing', () => {
    const formattedINR = formatCurrency(50000, 'INR');
    expect(formattedINR).toContain('50,000');

    const formattedUSD = formatCurrency(25000, 'USD');
    expect(formattedUSD).toContain('25,000');
  });

  it('should generate valid RFC 5545 format without throwing on complex multiline descriptions', () => {
    const plan = { ...MOCK_BLUEPRINTS['royal-wedding'] };
    const ics = generateICS(plan);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//AuraPlan AI//Celebration Planner//EN');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('should produce structured markdown summaries with valid headings', () => {
    const plan = MOCK_BLUEPRINTS['milestone-birthday'];
    const md = generateMarkdownSummary(plan);

    expect(md).toContain(`# ${plan.eventSummary.title}`);
    expect(md).toContain('## 💰 Budget Breakdown');
    expect(md).toContain('## ⏱️ Run-of-Show Timeline');
    expect(md).toContain('## 📋 Critical Vendor & Procurement Checklist');
    expect(md).toContain('## 🛡️ Risk & Contingency Matrix');
  });
});
