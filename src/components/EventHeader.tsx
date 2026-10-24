import React, { useState } from 'react';
import { Users, Clock, MapPin, Sparkles, Shirt, Check } from 'lucide-react';
import { EventPlan } from '../types/event';

interface EventHeaderProps {
  plan: EventPlan;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ plan }) => {
  const { eventSummary, guestCount, durationHours, locationType } = plan;
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="glass-card glass-card-accent" style={{ padding: '1.85rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Main Title & Tagline */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-indigo">
              <Sparkles size={12} /> {plan.eventType}
            </span>
            {plan.eventDate && (
              <span className="badge badge-cyan">
                Target: {plan.eventDate}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: '0.5rem', color: '#ffffff' }}>
            {eventSummary.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '0.85rem' }}>
            "{eventSummary.tagline}"
          </p>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '850px' }}>
            {eventSummary.themeConcept}
          </p>

          {/* Quick Meta Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.2rem' }}>
            <div className="badge badge-indigo" style={{ padding: '0.35rem 0.8rem' }}>
              <Users size={14} /> <strong>{guestCount}</strong> Guests
            </div>
            <div className="badge badge-amber" style={{ padding: '0.35rem 0.8rem' }}>
              <Clock size={14} /> <strong>{durationHours}</strong> Hours Duration
            </div>
            <div className="badge badge-emerald" style={{ padding: '0.35rem 0.8rem' }}>
              <MapPin size={14} /> {locationType}
            </div>
            <div className="badge badge-purple" style={{ padding: '0.35rem 0.8rem' }}>
              <Shirt size={14} /> Dress Code: <strong>{eventSummary.dressCode}</strong>
            </div>
          </div>
        </div>

        {/* Color Palette Card */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.4)', minWidth: '220px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.05em' }}>
            Architectural Palette
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {eventSummary.colorPalette.map((hex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopyHex(hex)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: hex,
                  border: '2px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease',
                }}
                title={`Click to copy ${hex}`}
              >
                {copiedHex === hex && <Check size={16} color="#ffffff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            {copiedHex ? `Copied ${copiedHex}!` : 'Click swatch to copy HEX'}
          </div>
        </div>

      </div>
    </div>
  );
};
