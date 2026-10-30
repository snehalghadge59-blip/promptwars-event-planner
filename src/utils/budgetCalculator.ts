/**
 * @fileoverview Budget calculation utilities for AuraPlan AI.
 *
 * Pure, side-effect-free functions for computing financial summaries,
 * validating budget coherence, and formatting currency values. All functions
 * are independently unit-tested in `src/__tests__/budgetCalculator.test.ts`.
 */

import { BudgetCategory } from '../types/event';

/**
 * Calculates the total planned allocation across all budget categories.
 *
 * @param categories - Array of budget category objects from the event plan.
 * @returns Sum of `allocated` values across all categories. Returns `0` for
 *          an empty array.
 */
export function calculateTotalAllocated(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (cat.allocated || 0), 0);
}

/**
 * Calculates the total actual expenditure recorded across all budget categories.
 *
 * Categories without an `actualSpent` value contribute `0` to the sum.
 *
 * @param categories - Array of budget category objects from the event plan.
 * @returns Sum of `actualSpent` values across all categories.
 */
export function calculateTotalActualSpent(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (cat.actualSpent || 0), 0);
}

/**
 * Computes the remaining budget variance after accounting for all allocations
 * and the contingency reserve.
 *
 * A positive return value indicates unallocated funds; a negative value
 * indicates that allocations exceed the stated budget.
 *
 * @param totalBudget       - Stated total budget in the event's currency.
 * @param categories        - Array of budget categories with their allocations.
 * @param contingencyReserve - Optional contingency reserve amount (default `0`).
 * @returns `totalBudget - (sum of allocations + contingencyReserve)`.
 */
export function calculateRemainingVariance(
  totalBudget: number,
  categories: BudgetCategory[],
  contingencyReserve: number = 0
): number {
  const allocated = calculateTotalAllocated(categories);
  return totalBudget - (allocated + contingencyReserve);
}

/**
 * Validates the mathematical coherence of a budget plan.
 *
 * Returns `true` when the sum of all category allocations plus the contingency
 * reserve is within the allowed tolerance of the total budget. A tolerance of
 * `max(1, totalBudget × 0.001)` accommodates rounding differences from integer
 * arithmetic without masking genuine allocation errors.
 *
 * @param totalBudget        - Stated total budget in the event's currency.
 * @param categories         - Array of budget categories with their allocations.
 * @param contingencyReserve - Optional contingency reserve amount (default `0`).
 * @returns `true` if the budget is mathematically coherent, `false` otherwise.
 *
 * @example
 * ```ts
 * isBudgetCoherent(100_000, categories, 12_000) // true when sums match
 * isBudgetCoherent(-1, categories)              // false — negative budget
 * ```
 */
export function isBudgetCoherent(
  totalBudget: number,
  categories: BudgetCategory[],
  contingencyReserve: number = 0
): boolean {
  if (totalBudget <= 0) return false;
  // Treat negative contingency as invalid — a reserve cannot be negative
  if (contingencyReserve < 0) return false;
  const totalAllocatedWithReserve = calculateTotalAllocated(categories) + contingencyReserve;
  const difference = Math.abs(totalBudget - totalAllocatedWithReserve);
  // Allow up to 1 currency unit or 0.1% rounding delta
  return difference <= Math.max(1, totalBudget * 0.001);
}

/**
 * Formats a numeric currency amount using the browser's `Intl.NumberFormat`
 * API for locale-aware grouping and currency symbols.
 *
 * Falls back to a plain `"${currency} ${amount}"` string if the browser does
 * not support the requested locale or currency code.
 *
 * @param amount   - Numeric amount to format.
 * @param currency - ISO 4217 currency code (default `'INR'`).
 * @returns Formatted currency string, e.g. `'₹4,50,000'` for INR.
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
