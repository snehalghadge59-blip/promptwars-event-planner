import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { BudgetAllocation, BudgetCategory } from '../types/event';
import {
  calculateTotalAllocated,
  calculateTotalActualSpent,
  formatCurrency,
  isBudgetCoherent,
} from '../utils/budgetCalculator';

interface BudgetSectionProps {
  budget: BudgetAllocation;
  onUpdateCategorySpent?: (categoryName: string, newSpent: number) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget, onUpdateCategorySpent }) => {
  const [categories, setCategories] = useState<BudgetCategory[]>(budget.categories);
  const totalAllocated = calculateTotalAllocated(categories);
  const totalActual = calculateTotalActualSpent(categories);
  const coherent = isBudgetCoherent(budget.total, categories, budget.contingencyReserve);

  const handleSpentChange = (categoryName: string, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = categories.map(c => (c.category === categoryName ? { ...c, actualSpent: num } : c));
    setCategories(updated);
    if (onUpdateCategorySpent) onUpdateCategorySpent(categoryName, num);
  };

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Dynamic Budget Optimizer</h2>
            {coherent ? (
              <span className="badge badge-emerald" title="Category allocations mathematically balance with total budget">
                <CheckCircle2 size={13} /> Mathematically Coherent
              </span>
            ) : (
              <span className="badge badge-amber" title="Variance detected between category sum and total budget">
                <AlertTriangle size={13} /> Variance Rebalance Needed
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            [Quant Agent]: 5-pillar algorithmic allocation with dedicated 12% dynamic contingency reserve
          </p>
        </div>

        {/* Global Summary Metrics */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Total Budget</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              {formatCurrency(budget.total, budget.currency)}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>Contingency Fund (12%)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>
              {formatCurrency(budget.contingencyReserve, budget.currency)}
            </div>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ fontSize: '0.72rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 600 }}>Actual Spent</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: totalActual > totalAllocated ? '#f43f5e' : '#818cf8' }}>
              {formatCurrency(totalActual, budget.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {categories.map((cat, idx) => {
          const spent = cat.actualSpent || 0;
          const pctSpent = cat.allocated > 0 ? Math.min(100, Math.round((spent / cat.allocated) * 100)) : 0;
          const isOver = spent > cat.allocated;

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.15rem',
                background: 'rgba(15, 21, 35, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{cat.category}</h3>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                    {cat.percentage}%
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Planned:</span>
                  <strong style={{ color: '#ffffff' }}>{formatCurrency(cat.allocated, budget.currency)}</strong>
                </div>

                {/* Progress bar */}
                <div className="progress-container" style={{ marginBottom: '0.65rem' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pctSpent}%`,
                      background: isOver ? 'var(--accent-rose)' : 'linear-gradient(90deg, #6366f1, #34d399)',
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  💡 <em>{cat.tips}</em>
                </p>
              </div>

              {/* Editable Actual Spent input */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actual Spend:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{budget.currency}</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '110px', padding: '0.25rem 0.5rem', fontSize: '0.785rem', textAlign: 'right' }}
                    value={cat.actualSpent ?? ''}
                    onChange={(e) => handleSpentChange(cat.category, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
