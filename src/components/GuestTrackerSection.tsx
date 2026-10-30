/**
 * @fileoverview GuestTrackerSection — Interactive Attendee & RSVP Operations Matrix.
 *
 * Provides event organizers with full attendee lifecycle management:
 * - Dynamic headcount & RSVP status breakdown (Confirmed, Pending, Declined)
 * - Per-guest dietary requirement triage (Vegetarian, Vegan, Gluten-Free, Allergies)
 * - VIP & seating zone categorization
 * - Real-time RSVP toggle and quick-add attendee capability
 */

import React, { useState } from 'react';
import { Users, UserCheck, Clock, UserX, Plus, Utensils, Filter } from 'lucide-react';
import { GuestItem } from '../types/event';

/**
 * Props for the {@link GuestTrackerSection} component.
 */
interface GuestTrackerSectionProps {
  /** Initial or existing guest list from the event plan. */
  initialGuests?: GuestItem[];
  /** Total planned guest count from event configuration. */
  targetGuestCount: number;
}

/** Default sample guests generated if none provided */
const generateDefaultGuests = (): GuestItem[] => {
  return [
    {
      id: 'g-1',
      name: 'Dr. Vikram & Sunita Singhania',
      category: 'VIP',
      rsvpStatus: 'Confirmed',
      plusOnes: 1,
      dietary: 'Pure Vegetarian / Jain',
      tableNumber: 'Table Royal 01',
    },
    {
      id: 'g-2',
      name: 'Aarav Mehta & Family',
      category: 'Family',
      rsvpStatus: 'Confirmed',
      plusOnes: 2,
      dietary: 'Standard Banquet',
      tableNumber: 'Table Heritage 03',
    },
    {
      id: 'g-3',
      name: 'Rohan & Ananya Kapoor',
      category: 'General',
      rsvpStatus: 'Pending',
      plusOnes: 1,
      dietary: 'Gluten-Free',
      tableNumber: 'Table Courtyard 05',
    },
    {
      id: 'g-4',
      name: 'Kabir Oberoi (Keynote Speaker)',
      category: 'VIP',
      rsvpStatus: 'Confirmed',
      plusOnes: 0,
      dietary: 'Vegan / Nut Allergy',
      tableNumber: 'Table Royal 01',
    },
    {
      id: 'g-5',
      name: 'Pooja & Dev Sharma',
      category: 'General',
      rsvpStatus: 'Declined',
      plusOnes: 0,
      dietary: 'Standard Banquet',
      tableNumber: 'Unassigned',
    },
    {
      id: 'g-6',
      name: 'Media & Production Lead (Sufi Crew)',
      category: 'Crew',
      rsvpStatus: 'Confirmed',
      plusOnes: 3,
      dietary: 'Standard Banquet / Boxed Meal',
      tableNumber: 'Crew Lounge',
    },
  ];
};

/**
 * Attendee RSVP & Dietary Operations Matrix component.
 */
export const GuestTrackerSection: React.FC<GuestTrackerSectionProps> = ({
  initialGuests,
  targetGuestCount,
}) => {
  const [guests, setGuests] = useState<GuestItem[]>(() =>
    initialGuests && initialGuests.length > 0 ? initialGuests : generateDefaultGuests()
  );
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // New guest form fields
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'VIP' | 'Family' | 'General' | 'Crew'>('General');
  const [newPlusOnes, setNewPlusOnes] = useState(0);
  const [newDietary, setNewDietary] = useState('Standard Banquet');

  // Metrics computation
  const confirmedCount = guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

  const pendingCount = guests
    .filter((g) => g.rsvpStatus === 'Pending')
    .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

  const declinedCount = guests
    .filter((g) => g.rsvpStatus === 'Declined')
    .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

  const toggleRsvp = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const nextStatus: Record<GuestItem['rsvpStatus'], GuestItem['rsvpStatus']> = {
          Confirmed: 'Pending',
          Pending: 'Declined',
          Declined: 'Confirmed',
        };
        return { ...g, rsvpStatus: nextStatus[g.rsvpStatus] };
      })
    );
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: GuestItem = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      rsvpStatus: 'Pending',
      plusOnes: Math.max(0, newPlusOnes),
      dietary: newDietary.trim() || 'Standard Banquet',
      tableNumber: newCategory === 'VIP' ? 'Table Royal' : 'General Seating',
    };

    setGuests((prev) => [newGuest, ...prev]);
    setNewName('');
    setNewPlusOnes(0);
    setNewDietary('Standard Banquet');
    setShowAddForm(false);
  };

  const filteredGuests = guests.filter((g) => {
    const matchesCategory = filterCategory === 'All' || g.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || g.rsvpStatus === filterStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', color: '#1c1917' }}>Guest &amp; RSVP Operations Matrix</h2>
            <span className="badge badge-emerald">
              <Users size={13} /> Logistics Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#57534e' }}>
            Real-time attendee check-in, plus-one tracking, and catering dietary triage for {targetGuestCount} planned attendees
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={14} /> {showAddForm ? 'Close Form' : 'Add Attendee'}
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e7e5e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontSize: '0.78rem', fontWeight: 600 }}>
            <UserCheck size={16} /> Confirmed RSVPs
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>
            {confirmedCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716c' }}>
            {Math.round((confirmedCount / Math.max(1, targetGuestCount)) * 100)}% of target capacity
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e7e5e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b48c48', fontSize: '0.78rem', fontWeight: 600 }}>
            <Clock size={16} /> Awaiting Response
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716c' }}>
            Follow-up reminders queued
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e7e5e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontSize: '0.78rem', fontWeight: 600 }}>
            <UserX size={16} /> Declined RSVPs
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>
            {declinedCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716c' }}>
            Seats released for waitlist
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e7e5e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontSize: '0.78rem', fontWeight: 600 }}>
            <Utensils size={16} /> Dietary Alerts
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1917', marginTop: '0.25rem' }}>
            {guests.filter((g) => g.dietary && !g.dietary.includes('Standard')).length}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716c' }}>
            Specialized kitchen tickets
          </span>
        </div>
      </div>

      {/* Quick Add Form Modal/Inline */}
      {showAddForm && (
        <form
          onSubmit={handleAddGuest}
          className="glass-card"
          style={{
            padding: '1.25rem',
            background: '#fdfbf7',
            border: '1px solid #e7e5e0',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label className="form-label" htmlFor="guestNameInput">Attendee Name / Party</label>
            <input
              id="guestNameInput"
              type="text"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Vikram Singhania"
              required
            />
          </div>

          <div>
            <label className="form-label" htmlFor="guestCategorySelect">Category Tier</label>
            <select
              id="guestCategorySelect"
              className="form-select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as 'VIP' | 'Family' | 'General' | 'Crew')}
            >
              <option value="VIP">VIP</option>
              <option value="Family">Family</option>
              <option value="General">General</option>
              <option value="Crew">Crew</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="guestPlusOnes">Accompanying (+Ones)</label>
            <input
              id="guestPlusOnes"
              type="number"
              min="0"
              max="10"
              className="form-input"
              value={newPlusOnes}
              onChange={(e) => setNewPlusOnes(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="guestDietaryInput">Dietary Specification</label>
            <input
              id="guestDietaryInput"
              type="text"
              className="form-input"
              value={newDietary}
              onChange={(e) => setNewDietary(e.target.value)}
              placeholder="e.g. Pure Vegetarian"
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Attendee
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.825rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#78716c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={13} /> Tier:
          </span>
          {['All', 'VIP', 'Family', 'General', 'Crew'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#78716c' }}>RSVP:</span>
          {['All', 'Confirmed', 'Pending', 'Declined'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Attendee Roster Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e7e5e0', textAlign: 'left', color: '#78716c' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Attendee</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Tier</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Party Size</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Dietary Triage</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Seating Zone</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>RSVP Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => {
              const statusBadgeClass =
                guest.rsvpStatus === 'Confirmed'
                  ? 'badge-emerald'
                  : guest.rsvpStatus === 'Pending'
                  ? 'badge-amber'
                  : 'badge-purple';

              return (
                <tr
                  key={guest.id}
                  style={{
                    borderBottom: '1px solid #f5f5f4',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#1c1917' }}>
                    {guest.name}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                      {guest.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#57534e' }}>
                    1 {guest.plusOnes > 0 && `(+${guest.plusOnes})`}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#292524' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Utensils size={12} color="#b48c48" /> {guest.dietary}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#78716c', fontSize: '0.8rem' }}>
                    {guest.tableNumber || 'Assigned on Arrival'}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => toggleRsvp(guest.id)}
                      className={`badge ${statusBadgeClass}`}
                      style={{ cursor: 'pointer', border: 'none', padding: '0.3rem 0.65rem' }}
                      title="Click to cycle status: Confirmed → Pending → Declined"
                      aria-label={`Toggle RSVP for ${guest.name}. Current: ${guest.rsvpStatus}`}
                    >
                      {guest.rsvpStatus} (click to toggle)
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
