import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { RiskContingency } from '../types/event';

interface RiskSentinelSectionProps {
  risks: RiskContingency[];
}

export const RiskSentinelSection: React.FC<RiskSentinelSectionProps> = ({ risks }) => {
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
