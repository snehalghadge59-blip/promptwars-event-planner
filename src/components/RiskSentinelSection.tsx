/**
 * @fileoverview RiskSentinelSection — FMEA Risk & Contingency Matrix panel.
 *
 * Renders the Sentinel Agent output: a list of identified risks, each with
 * probability/impact classification badges, trigger conditions, and
 * autonomous Plan B contingency protocols. Provides a meaningful empty state
 * when no risks are present.
 */

import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { RiskContingency } from '../types/event';

/**
 * Props for the {@link RiskSentinelSection} component.
 */
interface RiskSentinelSectionProps {
  /** Array of risk and contingency items produced by the Sentinel Agent. */
  risks: RiskContingency[];
}

/**
 * Renders the Operational Risk & Contingency Sentinel section.
 *
 * Displays a Failure Mode & Effects Analysis (FMEA) matrix with each risk
 * showing probability, impact level, trigger condition, and autonomous
 * Plan B contingency action. Renders an "All Clear" empty state when the
 * risks array is empty.
 *
 * @param risks - Array of FMEA risk objects from the active event plan.
 */
export const RiskSentinelSection: React.FC<RiskSentinelSectionProps> = ({ risks }) => {
  // Guard: render a meaningful empty state instead of a blank section
  if (!risks || risks.length === 0) {
    return (
      <section
        className="glass-card"
        style={{ padding: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}
        aria-label="Risk and Contingency Sentinel: no risks identified"
      >
        <ShieldAlert size={28} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
        <p style={{ color: '#047857', fontWeight: 600 }}>All Clear — No Critical Risks Identified</p>
        <p style={{ fontSize: '0.825rem', color: '#78716c', marginTop: '0.25rem' }}>
          The FMEA Sentinel found no risk factors requiring contingency protocols for this event.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', color: '#1c1917' }}>Operational Risk & Contingency Sentinel</h2>
            <span className="badge badge-rose">
              <ShieldAlert size={13} /> Sentinel Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#57534e' }}>
            Failure Mode & Effects Analysis (FMEA): Pre-emptive Plan B triggers for weather, power, and logistics
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {risks.map((r, idx) => {
          const impactBadge = r.impact === 'Critical' ? 'badge-rose' : r.impact === 'High' ? 'badge-amber' : 'badge-cyan';
          const probBadge = r.probability === 'High' ? 'badge-rose' : r.probability === 'Med' ? 'badge-amber' : 'badge-emerald';
          // Stable key: use first 30 chars of risk description slug
          const stableKey = `risk-${r.risk.slice(0, 30).replace(/\s+/g, '-')}-${idx}`;
          return (
            <div
              key={stableKey}
              className="glass-card"
              style={{
                padding: '1.2rem',
                background: '#ffffff',
                border: '1px solid #e7e5e0',
                borderLeft: r.impact === 'Critical' ? '4px solid #be123c' : '4px solid #b45309',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color={r.impact === 'Critical' ? '#be123c' : '#b45309'} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1c1917' }}>
                    {r.risk}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span
                    className={`badge ${probBadge}`}
                    style={{ fontSize: '0.7rem' }}
                    aria-label={`Probability level: ${r.probability}`}
                  >
                    Probability: {r.probability}
                  </span>
                  <span
                    className={`badge ${impactBadge}`}
                    style={{ fontSize: '0.7rem' }}
                    aria-label={`Impact level: ${r.impact}`}
                  >
                    Impact: {r.impact}
                  </span>
                </div>
              </div>

              {/* Trigger Condition */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.785rem', color: '#78350f' }}>
                <strong style={{ color: '#92400e' }}>⚡ Trigger Condition:</strong> {r.triggerCondition}
              </div>

              {/* Contingency Plan */}
              <div style={{ background: '#ecfdf5', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0', fontSize: '0.825rem', color: '#065f46' }}>
                <strong>🛡️ Autonomous Plan B Action:</strong> {r.contingencyPlan}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
