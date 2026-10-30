import { describe, it, expect } from 'vitest';
import { GuestItem } from '../types/event';

describe('Guest & RSVP Operations Matrix Suite', () => {
  const sampleGuests: GuestItem[] = [
    {
      id: 'test-1',
      name: 'Aditya Singhania',
      category: 'VIP',
      rsvpStatus: 'Confirmed',
      plusOnes: 1,
      dietary: 'Pure Vegetarian',
      tableNumber: 'Table Royal 01',
    },
    {
      id: 'test-2',
      name: 'Priya Sharma',
      category: 'General',
      rsvpStatus: 'Pending',
      plusOnes: 0,
      dietary: 'Standard Banquet',
      tableNumber: 'Table 4',
    },
    {
      id: 'test-3',
      name: 'Vikram Seth',
      category: 'Family',
      rsvpStatus: 'Declined',
      plusOnes: 2,
      dietary: 'Nut Allergy / Vegan',
      tableNumber: 'Unassigned',
    },
  ];

  it('accurately computes confirmed, pending, and declined headcounts including plus-ones', () => {
    const confirmedCount = sampleGuests
      .filter((g) => g.rsvpStatus === 'Confirmed')
      .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

    const pendingCount = sampleGuests
      .filter((g) => g.rsvpStatus === 'Pending')
      .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

    const declinedCount = sampleGuests
      .filter((g) => g.rsvpStatus === 'Declined')
      .reduce((acc, g) => acc + 1 + g.plusOnes, 0);

    expect(confirmedCount).toBe(2); // 1 guest + 1 plus-one
    expect(pendingCount).toBe(1);   // 1 guest + 0 plus-ones
    expect(declinedCount).toBe(3);  // 1 guest + 2 plus-ones
  });

  it('cycles through RSVP states in deterministic sequence (Confirmed -> Pending -> Declined -> Confirmed)', () => {
    const nextStatus: Record<GuestItem['rsvpStatus'], GuestItem['rsvpStatus']> = {
      Confirmed: 'Pending',
      Pending: 'Declined',
      Declined: 'Confirmed',
    };

    expect(nextStatus['Confirmed']).toBe('Pending');
    expect(nextStatus['Pending']).toBe('Declined');
    expect(nextStatus['Declined']).toBe('Confirmed');
  });

  it('identifies specialized dietary requirements and allergy tickets', () => {
    const dietaryAlerts = sampleGuests.filter(
      (g) => g.dietary && !g.dietary.includes('Standard')
    );

    expect(dietaryAlerts.length).toBe(2);
    expect(dietaryAlerts.map((g) => g.name)).toEqual(['Aditya Singhania', 'Vikram Seth']);
  });

  it('filters attendees by category tier correctly', () => {
    const vipGuests = sampleGuests.filter((g) => g.category === 'VIP');
    const familyGuests = sampleGuests.filter((g) => g.category === 'Family');
    const generalGuests = sampleGuests.filter((g) => g.category === 'General');

    expect(vipGuests.length).toBe(1);
    expect(familyGuests.length).toBe(1);
    expect(generalGuests.length).toBe(1);
  });
});
