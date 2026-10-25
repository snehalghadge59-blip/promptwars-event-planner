import React, { useState, useMemo } from 'react';
import { ClipboardList, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { VendorTask } from '../types/event';

interface VendorSectionProps {
  tasks: VendorTask[];
}

export const VendorSection: React.FC<VendorSectionProps> = ({ tasks }) => {
  const [items, setItems] = useState<VendorTask[]>(tasks);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map(t => t.category)))],
    [items]
  );

  const handleToggle = (id: string) => {
    setItems(items.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const completedCount = useMemo(() => items.filter(t => t.completed).length, [items]);
  const completionPct = useMemo(
    () => (items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0),
    [completedCount, items.length]
  );

  const filteredTasks = useMemo(
    () => (filterCategory === 'All' ? items : items.filter(t => t.category === filterCategory)),
    [filterCategory, items]
  );

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', color: '#1c1917' }}>Smart Vendor & Procurement Matrix</h2>
            <span className="badge badge-amber">
              <ClipboardList size={13} /> Logistics Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#57534e' }}>
            Contract negotiation checks, lead-time milestones, and SLA guarantees
          </p>
        </div>

        {/* Progress Metric */}
        <div style={{ minWidth: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#57534e', marginBottom: '0.35rem' }}>
            <span>Procurement Progress</span>
            <strong style={{ color: '#047857' }}>{completionPct}% ({completedCount}/{items.length})</strong>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${completionPct}%`, background: '#059669' }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            onClick={() => setFilterCategory(cat)}
            aria-pressed={filterCategory === cat}
            aria-label={`Filter vendors by category: ${cat}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTasks.map((t) => {
          const isDone = t.completed;
          const priorityBadgeClass = t.priority === 'High' ? 'badge-rose' : t.priority === 'Medium' ? 'badge-amber' : 'badge-cyan';

          return (
            <div
              key={t.id}
              className="glass-card"
              style={{
                padding: '1rem',
                background: isDone ? '#ecfdf5' : '#ffffff',
                borderColor: isDone ? '#a7f3d0' : '#e7e5e0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <button
                type="button"
                onClick={() => handleToggle(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDone ? '#059669' : '#a8a29e',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.15rem',
                }}
                title={isDone ? 'Mark Incomplete' : 'Mark Complete'}
                aria-label={isDone ? `Mark "${t.task}" as incomplete` : `Mark "${t.task}" as complete`}
                aria-checked={isDone}
                role="checkbox"
              >
                {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isDone ? '#78716c' : '#1c1917', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {t.task}
                    </span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.675rem' }}>
                      {t.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                      {t.deadlineWeeksBefore}w before event
                    </span>
                    <span className={`badge ${priorityBadgeClass}`} style={{ fontSize: '0.675rem' }}>
                      {t.priority}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#fdfbf7', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #b48c48', border: '1px solid #e7e5e0', borderLeftColor: '#b48c48', marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', color: '#44403c' }}>
                    <ShieldCheck size={14} color="#b48c48" />
                    <strong>Mandatory Contract Clause:</strong> {t.negotiationCheck}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
