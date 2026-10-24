import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { EventInput } from '../types/event';

interface EventInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  isLoading: boolean;
}

export const EventInputModal: React.FC<EventInputModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  if (!isOpen) return null;

  const [eventType, setEventType] = useState('Royal Heritage Wedding');
  const [totalBudget, setTotalBudget] = useState(2500000);
  const [currency, setCurrency] = useState('INR');
  const [guestCount, setGuestCount] = useState(250);
  const [durationHours, setDurationHours] = useState(8);
  const [locationType, setLocationType] = useState('Open-air Courtyard & Palace Lawn');
  const [specialRequirements, setSpecialRequirements] = useState('Live acoustic Sufi music, sunset varmala, strict vegan banquet wing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      eventType,
      totalBudget: Number(totalBudget),
      currency,
      guestCount: Number(guestCount),
      durationHours: Number(durationHours),
      locationType,
      specialRequirements,
    });
  };

  const handleQuickPreset = (type: string, budget: number, guests: number, dur: number, loc: string, req: string) => {
    setEventType(type);
    setTotalBudget(budget);
    setGuestCount(guests);
    setDurationHours(dur);
    setLocationType(loc);
    setSpecialRequirements(req);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#6366f1" />
            <h2 id="modal-title" style={{ fontSize: '1.25rem', color: '#ffffff' }}>Synthesize New Event Blueprint</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick archetypes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Quick Archetypes:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickPreset('Destination Wedding', 3500000, 350, 12, 'Palace Courtyard, Udaipur', 'Royal baraat entry, vegetarian royal thali')}
            >
              💍 Palace Wedding
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickPreset('24-Hour AI Hackathon', 800000, 200, 24, 'Tech University Innovation Lab', '10Gbps redundant fiber, midnight Red Bull & pizzas')}
            >
              💻 Tech Hackathon
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickPreset('Corporate Leadership Gala', 1500000, 120, 5, '5-Star Grand Ballroom', 'Keynote stage, award mementos, jazz cocktail hour')}
            >
              🏆 Leadership Gala
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="eventType">Event Type & Occasion</label>
            <input
              id="eventType"
              type="text"
              className="form-input"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="totalBudget">Total Budget ({currency})</label>
              <input
                id="totalBudget"
                type="number"
                className="form-input"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                required
                min={1000}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="guestCount">Expected Guest Count</label>
              <input
                id="guestCount"
                type="number"
                className="form-input"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                required
                min={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="durationHours">Duration (Hours)</label>
              <input
                id="durationHours"
                type="number"
                className="form-input"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                required
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="locationType">Setting & Location Type</label>
            <input
              id="locationType"
              type="text"
              className="form-input"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              placeholder="e.g. Skyline Rooftop Lounge / Beachfront Resort"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="specialRequirements">Special Constraints & Specific Needs</label>
            <textarea
              id="specialRequirements"
              className="form-textarea"
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Strict vegan menu, elderly wheelchair accessibility, live stream setup"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Blueprint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
