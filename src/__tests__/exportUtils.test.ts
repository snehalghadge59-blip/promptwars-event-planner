import { describe, it, expect } from 'vitest';
import { generateICS, generateMarkdownSummary } from '../utils/exportUtils';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';

describe('Export Suite Operations', () => {
  const samplePlan = MOCK_BLUEPRINTS['royal-wedding'];

  it('generates valid RFC 5545 iCalendar (.ics) formatted content', () => {
    const ics = generateICS(samplePlan);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:[Arrival]');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('generates rich markdown summary with all essential sections', () => {
    const md = generateMarkdownSummary(samplePlan);
    expect(md).toContain('# The Grand Jaipur Heritage Royal Wedding');
    expect(md).toContain('## 💰 Budget Breakdown');
    expect(md).toContain('## ⏱️ Run-of-Show Timeline');
    expect(md).toContain('## 📋 Critical Vendor & Procurement Checklist');
    expect(md).toContain('## 🛡️ Risk & Contingency Matrix');
  });
});
