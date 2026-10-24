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
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Operational Risk & Contingency Sentinel</h2>
            <span className="badge badge-rose">
              <ShieldAlert size={13} /> Sentinel Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Failure Mode & Effects Analysis (FMEA): Pre-emptive Plan B triggers for weather, power, and logistics
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {risks.map((r, idx) => {
          const impactBadge = r.impact === 'Critical' ? 'badge-rose' : r.impact === 'High' ? 'badge-amber' : 'badge-cyan';
          const probBadge = r.probability === 'High' ? 'badge-rose' : r.probability === 'Med' ? 'badge-amber' : 'badge-emerald';

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.2rem',
                background: 'rgba(15, 21, 35, 0.65)',
                borderLeft: r.impact === 'Critical' ? '4px solid #f43f5e' : '4px solid #f59e0b',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color={r.impact === 'Critical' ? '#fb7185' : '#fbbf24'} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                    {r.risk}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span className={`badge ${probBadge}`} style={{ fontSize: '0.7rem' }}>
                    Probability: {r.probability}
                  </span>
                  <span className={`badge ${impactBadge}`} style={{ fontSize: '0.7rem' }}>
                    Impact: {r.impact}
                  </span>
                </div>
              </div>

              {/* Trigger Condition */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.785rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24' }}>⚡ Trigger Condition:</strong> {r.triggerCondition}
              </div>

              {/* Contingency Plan */}
              <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.825rem', color: '#34d399' }}>
                <strong>🛡️ Autonomous Plan B Action:</strong> {r.contingencyPlan}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
