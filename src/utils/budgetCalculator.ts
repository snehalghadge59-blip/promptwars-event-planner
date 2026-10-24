import { BudgetCategory } from '../types/event';

/**
 * Calculates total planned allocation across all categories.
 */
export function calculateTotalAllocated(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (cat.allocated || 0), 0);
}

/**
 * Calculates total actual expenditure across all categories.
 */
export function calculateTotalActualSpent(categories: BudgetCategory[]): number {
  return categories.reduce((sum, cat) => sum + (cat.actualSpent || 0), 0);
}

/**
 * Computes remaining budget variance (Planned Total - (Allocated + Contingency)).
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
 * Validates mathematical coherence of the budget.
 * Returns true if the sum of all categories plus contingency is within 1% tolerance of total budget.
 */
export function isBudgetCoherent(
  totalBudget: number,
  categories: BudgetCategory[],
  contingencyReserve: number = 0
): boolean {
  if (totalBudget <= 0) return false;
  const totalAllocatedWithReserve = calculateTotalAllocated(categories) + contingencyReserve;
  const difference = Math.abs(totalBudget - totalAllocatedWithReserve);
  // Allow up to 1 currency unit or 0.1% rounding delta
  return difference <= Math.max(1, totalBudget * 0.001);
}

/**
 * Formats currency values in local or standard notation.
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
