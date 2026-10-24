import { describe, it, expect } from 'vitest';
import {
  calculateTotalAllocated,
  calculateTotalActualSpent,
  calculateRemainingVariance,
  isBudgetCoherent,
  formatCurrency,
} from '../utils/budgetCalculator';
import { BudgetCategory } from '../types/event';

describe('Budget Calculator Operations', () => {
  const sampleCategories: BudgetCategory[] = [
    { category: 'Venue', allocated: 400000, percentage: 40, tips: 'Negotiate' },
    { category: 'Catering', allocated: 300000, percentage: 30, tips: 'Live counters', actualSpent: 290000 },
    { category: 'Decor', allocated: 200000, percentage: 20, tips: 'Florals', actualSpent: 210000 },
  ];

  it('accurately sums total allocated budget across categories', () => {
    const total = calculateTotalAllocated(sampleCategories);
    expect(total).toBe(900000);
  });

  it('accurately computes total actual expenditure', () => {
    const actual = calculateTotalActualSpent(sampleCategories);
    expect(actual).toBe(500000);
  });

  it('calculates remaining variance including contingency reserve', () => {
    const totalBudget = 1000000;
    const contingency = 100000;
    const variance = calculateRemainingVariance(totalBudget, sampleCategories, contingency);
    expect(variance).toBe(0); // 1,000,000 - (900,000 + 100,000) = 0
  });

  it('validates budget mathematical coherence correctly', () => {
    const totalBudget = 1000000;
    const contingency = 100000;
    const coherent = isBudgetCoherent(totalBudget, sampleCategories, contingency);
    expect(coherent).toBe(true);

    // Should fail when amounts do not match
    const incoherent = isBudgetCoherent(totalBudget, sampleCategories, 50000);
    expect(incoherent).toBe(false);
  });

  it('formats currency correctly without NaN or undefined artifacts', () => {
    const formatted = formatCurrency(500000, 'INR');
    expect(formatted).toContain('5,00,000');
  });
});
