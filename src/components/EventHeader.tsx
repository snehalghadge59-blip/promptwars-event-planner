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
    <div
      className="glass-card glass-card-accent"
      style={{
        padding: '2rem',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Venue Photo Ambient Layer */}
      {plan.coverImage && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${plan.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
              filter: 'saturate(1.2) contrast(1.1)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.82) 55%, rgba(255, 255, 255, 0.94) 100%)',
              zIndex: 1,
            }}
          />
        </>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Main Title & Tagline */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-amber">
              <Sparkles size={12} /> {plan.eventType}
            </span>
            {plan.eventDate && (
              <span className="badge badge-indigo">
                Target: {plan.eventDate}
              </span>
            )}
            <span className="badge badge-emerald">
              Production Ready
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: '0.5rem', color: '#1c1917', fontFamily: 'var(--font-serif)' }}>
            {eventSummary.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#b48c48', fontStyle: 'italic', marginBottom: '0.85rem', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
            "{eventSummary.tagline}"
          </p>

          <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: 1.6, maxWidth: '850px' }}>
            {eventSummary.themeConcept}
          </p>

          {/* Quick Meta Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.25rem' }}>
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

        {/* Right Column: Venue Thumbnail & Palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: '240px' }}>
          {/* Venue Preview Thumbnail */}
          {plan.coverImage && (
            <div
              className="glass-card"
              style={{
                height: '110px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: `url(${plan.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={11} color="#f59e0b" /> Verified Venue Atmosphere
                </span>
              </div>
            </div>
          )}

          {/* Color Palette Card */}
          <div className="glass-card" style={{ padding: '0.85rem 1rem', background: '#ffffff', border: '1px solid #e7e5e0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Architectural Palette
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              {eventSummary.colorPalette.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleCopyHex(hex)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: hex,
                    border: '2px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s ease',
                  }}
                  title={`Click to copy ${hex}`}
                  aria-label={`Copy colour ${hex} to clipboard`}
                >
                  {copiedHex === hex && <Check size={14} color="#ffffff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              {copiedHex ? `Copied ${copiedHex}!` : 'Click swatch to copy HEX'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
