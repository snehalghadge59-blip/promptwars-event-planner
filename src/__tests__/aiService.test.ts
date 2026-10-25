import { describe, it, expect } from 'vitest';
import { SYSTEM_PROMPT } from '../services/aiService';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';

describe('AI Service & Prompt Schema Validation', () => {
  it('should verify SYSTEM_PROMPT contains all 5 required sub-agent directives', () => {
    expect(SYSTEM_PROMPT).toContain('[ARCHITECT]');
    expect(SYSTEM_PROMPT).toContain('[CHRONOPLANNER]');
    expect(SYSTEM_PROMPT).toContain('[QUANT]');
    expect(SYSTEM_PROMPT).toContain('[LOGISTICS]');
    expect(SYSTEM_PROMPT).toContain('[SENTINEL]');
  });

  it('should verify SYSTEM_PROMPT mandates strict JSON output format with all 6 required keys', () => {
    expect(SYSTEM_PROMPT).toContain('"eventSummary"');
    expect(SYSTEM_PROMPT).toContain('"budgetAllocation"');
    expect(SYSTEM_PROMPT).toContain('"timelineItinerary"');
    expect(SYSTEM_PROMPT).toContain('"vendorChecklist"');
    expect(SYSTEM_PROMPT).toContain('"invitationStudio"');
    expect(SYSTEM_PROMPT).toContain('"riskContingencyMatrix"');
  });

  it('should verify SYSTEM_PROMPT enforces FMEA risk analysis with trigger conditions', () => {
    expect(SYSTEM_PROMPT).toContain('FMEA');
    expect(SYSTEM_PROMPT).toContain('triggerCondition');
    expect(SYSTEM_PROMPT).toContain('contingencyPlan');
  });

  it('should verify all preset blueprints have mathematically valid budget structures', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([preset, plan]) => {
      const { total, contingencyReserve, categories } = plan.budgetAllocation;
      const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
      const combinedTotal = totalAllocated + contingencyReserve;
      const delta = Math.abs(total - combinedTotal);
      expect(delta).toBeLessThanOrEqual(total * 0.01 + 1);
      expect(preset).toBeTruthy();
    });
  });

  it('should verify all preset blueprints have valid invitation studio with 3 required fields', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([, plan]) => {
      const { formalInvitation, casualWhatsAppCopy, rsvpCallToAction } = plan.invitationStudio;
      expect(formalInvitation.length).toBeGreaterThan(10);
      expect(casualWhatsAppCopy.length).toBeGreaterThan(10);
      expect(rsvpCallToAction.length).toBeGreaterThan(5);
    });
  });

  it('should verify all preset vendor checklists contain high-priority tasks with negotiation checks', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([, plan]) => {
      const highPriority = plan.vendorChecklist.filter(v => v.priority === 'High');
      expect(highPriority.length).toBeGreaterThanOrEqual(1);
      highPriority.forEach(v => {
        expect(v.negotiationCheck.length).toBeGreaterThan(10);
        expect(v.deadlineWeeksBefore).toBeGreaterThan(0);
      });
    });
  });

  it('should verify all preset timeline itineraries maintain valid time format and buffer', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([, plan]) => {
      plan.timelineItinerary.forEach((item) => {
        expect(item.bufferMinutes).toBeGreaterThanOrEqual(0);
        expect(item.time).toMatch(/\d{1,2}:\d{2}/);
        expect(item.activity.length).toBeGreaterThan(3);
      });
    });
  });

  it('should verify clean JSON extraction strips code fence wrappers correctly', () => {
    const clean = (str: string) => {
      let s = str.trim();
      if (s.startsWith('```json')) s = s.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      else if (s.startsWith('```')) s = s.replace(/^```\s*/, '').replace(/\s*```$/, '');
      return s;
    };
    expect(JSON.parse(clean('```json\n{"key": "value"}\n```'))).toEqual({ key: 'value' });
    expect(JSON.parse(clean('```\n{"key": "value"}\n```'))).toEqual({ key: 'value' });
    expect(JSON.parse(clean('{"key": "value"}'))).toEqual({ key: 'value' });
  });
});
