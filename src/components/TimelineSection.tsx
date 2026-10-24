import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, Circle, Filter } from 'lucide-react';
import { TimelineItem } from '../types/event';

interface TimelineSectionProps {
  timeline: TimelineItem[];
  onExportICS: () => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline, onExportICS }) => {
  const [items, setItems] = useState<TimelineItem[]>(timeline);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Extract distinct phases
  const phases = ['All', ...Array.from(new Set(items.map(i => i.phase)))];

  const handleToggleComplete = (idx: number) => {
    const updated = [...items];
    updated[idx].completed = !updated[idx].completed;
    setItems(updated);
  };

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(i => i.phase === activeFilter);

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Run-of-Show Master Itinerary</h2>
            <span className="badge badge-amber">
              <Clock size={13} /> ChronoPlanner Engine
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Sequential timeline with friction dampening and operational transition buffers
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onExportICS}
          title="Download RFC 5545 iCalendar file"
        >
          <Calendar size={14} color="#6366f1" />
          <span>Sync to Calendar (.ICS)</span>
        </button>
      </div>

      {/* Phase Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '0.25rem' }}>
          <Filter size={13} /> Filter:
        </span>
        {phases.map((phase, idx) => (
          <button
            key={idx}
            type="button"
            className={`btn btn-sm ${activeFilter === phase ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            onClick={() => setActiveFilter(phase)}
          >
            {phase}
          </button>
        ))}
      </div>

      {/* Timeline Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredItems.map((item, idx) => {
          const isDone = item.completed;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(15, 21, 35, 0.65)',
                borderColor: isDone ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => handleToggleComplete(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDone ? '#10b981' : 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.2rem',
                }}
                title={isDone ? 'Mark Pending' : 'Mark Completed'}
              >
                {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              {/* Time Column */}
              <div style={{ minWidth: '100px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  {item.time}
                </span>
                <span className="badge badge-indigo" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', marginTop: '0.25rem' }}>
                  {item.phase}
                </span>
              </div>

              {/* Content Column */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: isDone ? 'var(--text-muted)' : '#ffffff', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.activity}
                  </h3>
                  {item.bufferMinutes > 0 && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.685rem' }}>
                      +{item.bufferMinutes}m buffer
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {item.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
