/**
 * @fileoverview EventInputModal — Custom event synthesis form dialog.
 *
 * Provides a fully-accessible modal form for users to configure a custom
 * event blueprint. All user-supplied string inputs are sanitized via
 * {@link sanitizeEventInput} before being dispatched to the AI service,
 * providing XSS and prototype-pollution defence at the form boundary.
 */

import React, { useState } from 'react';
import { X, Sparkles, Loader2, CalendarDays, AlertCircle } from 'lucide-react';
import { EventInput } from '../types/event';
import { sanitizeEventInput } from '../utils/sanitizer';

/**
 * Props for the {@link EventInputModal} component.
 */
interface EventInputModalProps {
  /** Whether the modal dialog is visible. */
  isOpen: boolean;
  /** Callback to close the modal without submitting. */
  onClose: () => void;
  /**
   * Async callback invoked with the sanitized {@link EventInput} on form submit.
   * If this rejects, the modal remains open for the user to correct the error.
   */
  onSubmit: (input: EventInput) => Promise<void>;
  /** When `true`, shows a loading spinner and disables form controls. */
  isLoading: boolean;
}

/**
 * Minimum event date getter — returns today in YYYY-MM-DD format
 * to prevent selection of past event dates.
 *
 * @returns ISO date string for the current day.
 */
const getTodayString = (): string => new Date().toISOString().split('T')[0];

/** Named presets extracted as a typed constant for maintainability and reusability */
const QUICK_PRESETS: Array<{
  emoji: string;
  label: string;
  eventType: string;
  totalBudget: number;
  guestCount: number;
  durationHours: number;
  locationType: string;
  specialRequirements: string;
}> = [
  {
    emoji: '💍',
    label: 'Palace Wedding',
    eventType: 'Destination Wedding',
    totalBudget: 3500000,
    guestCount: 350,
    durationHours: 12,
    locationType: 'Palace Courtyard, Udaipur',
    specialRequirements: 'Royal baraat entry, vegetarian royal thali',
  },
  {
    emoji: '💻',
    label: 'Tech Hackathon',
    eventType: '24-Hour AI Hackathon',
    totalBudget: 800000,
    guestCount: 200,
    durationHours: 24,
    locationType: 'Tech University Innovation Lab',
    specialRequirements: '10Gbps redundant fiber, midnight Red Bull & pizzas',
  },
  {
    emoji: '🏆',
    label: 'Leadership Gala',
    eventType: 'Corporate Leadership Gala',
    totalBudget: 1500000,
    guestCount: 120,
    durationHours: 5,
    locationType: '5-Star Grand Ballroom',
    specialRequirements: 'Keynote stage, award mementos, jazz cocktail hour',
  },
];

/**
 * Modal dialog component for synthesising a custom AI event blueprint.
 *
 * Includes quick-fill archetypes, form validation, loading state management,
 * and full sanitization of all user inputs before dispatch to the AI service.
 */
export const EventInputModal: React.FC<EventInputModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [eventType, setEventType] = useState('Royal Heritage Wedding');
  const [eventDate, setEventDate] = useState('');
  const [totalBudget, setTotalBudget] = useState(2500000);
  const [currency, setCurrency] = useState('INR');
  const [guestCount, setGuestCount] = useState(250);
  const [durationHours, setDurationHours] = useState(8);
  const [locationType, setLocationType] = useState('Open-air Courtyard & Palace Lawn');
  const [specialRequirements, setSpecialRequirements] = useState('Live acoustic Sufi music, sunset varmala, strict vegan banquet wing');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    if (!eventType.trim()) {
      setValidationError('Event type is required.');
      return false;
    }
    if (totalBudget < 1000) {
      setValidationError('Total budget must be at least 1,000.');
      return false;
    }
    if (guestCount < 5) {
      setValidationError('Guest count must be at least 5.');
      return false;
    }
    if (durationHours < 1) {
      setValidationError('Duration must be at least 1 hour.');
      return false;
    }
    if (!locationType.trim()) {
      setValidationError('Location / setting is required.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    // Sanitize all user-supplied string fields before dispatch
    const sanitized = sanitizeEventInput({
      eventType,
      eventDate,
      totalBudget: Number(totalBudget),
      currency,
      guestCount: Number(guestCount),
      durationHours: Number(durationHours),
      locationType,
      specialRequirements,
    });
    await onSubmit(sanitized);
  };

  const handleQuickPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setEventType(preset.eventType);
    setTotalBudget(preset.totalBudget);
    setGuestCount(preset.guestCount);
    setDurationHours(preset.durationHours);
    setLocationType(preset.locationType);
    setSpecialRequirements(preset.specialRequirements);
    setValidationError(null);
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
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickPreset(preset)}
                aria-label={`Load ${preset.label} preset`}
              >
                {preset.emoji} {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              padding: '0.65rem 0.9rem',
              marginBottom: '1rem',
              fontSize: '0.825rem',
              color: '#9f1239',
            }}
          >
            <AlertCircle size={16} color="#be123c" aria-hidden="true" />
            {validationError}
          </div>
        )}

        {/* Loading ARIA announcement */}
        {isLoading && (
          <div role="status" aria-live="polite" aria-label="Synthesizing event blueprint, please wait" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
            Synthesizing event blueprint…
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="eventType">Event Type &amp; Occasion</label>
            <input
              id="eventType"
              type="text"
              className="form-input"
              value={eventType}
              onChange={(e) => { setEventType(e.target.value); setValidationError(null); }}
              required
              aria-required="true"
              aria-describedby={validationError && !eventType.trim() ? 'form-error' : undefined}
            />
          </div>

          {/* Event Date field — captures the actual date so ICS exports are accurate */}
          <div className="form-group">
            <label className="form-label" htmlFor="eventDate">
              <CalendarDays size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} aria-hidden="true" />
              Event Date <span style={{ fontWeight: 400, color: '#a8a29e' }}>(optional)</span>
            </label>
            <input
              id="eventDate"
              type="date"
              className="form-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={getTodayString()}
              aria-label="Event date — used to generate accurate calendar exports"
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
                onChange={(e) => { setTotalBudget(Number(e.target.value)); setValidationError(null); }}
                required
                aria-required="true"
                min={1000}
                aria-label={`Total budget in ${currency}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Select currency"
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
                onChange={(e) => { setGuestCount(Number(e.target.value)); setValidationError(null); }}
                required
                aria-required="true"
                min={5}
                aria-label="Expected number of guests (minimum 5)"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="durationHours">Duration (Hours)</label>
              <input
                id="durationHours"
                type="number"
                className="form-input"
                value={durationHours}
                onChange={(e) => { setDurationHours(Number(e.target.value)); setValidationError(null); }}
                required
                aria-required="true"
                min={1}
                max={72}
                aria-label="Event duration in hours (1–72)"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="locationType">Setting &amp; Location Type</label>
            <input
              id="locationType"
              type="text"
              className="form-input"
              value={locationType}
              onChange={(e) => { setLocationType(e.target.value); setValidationError(null); }}
              placeholder="e.g. Skyline Rooftop Lounge / Beachfront Resort"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="specialRequirements">Special Constraints &amp; Specific Needs</label>
            <textarea
              id="specialRequirements"
              className="form-textarea"
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Strict vegan menu, elderly wheelchair accessibility, live stream setup"
              aria-label="Any special requirements or constraints for this event"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Synthesizing Plan…</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} aria-hidden="true" />
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
