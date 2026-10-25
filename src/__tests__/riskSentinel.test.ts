import { describe, it, expect } from 'vitest';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';

describe('Risk Sentinel & FMEA Matrix Tests', () => {
  it('should verify all presets contain valid risk contingency definitions', () => {
    Object.entries(MOCK_BLUEPRINTS).forEach(([, plan]) => {
      expect(plan.riskContingencyMatrix).toBeDefined();
      expect(plan.riskContingencyMatrix.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should validate risk impact and probability classifications are within accepted bounds', () => {
    const validLevels = ['Critical', 'High', 'Med', 'Medium', 'Low'];
    const plan = MOCK_BLUEPRINTS['royal-wedding'];

    plan.riskContingencyMatrix.forEach((risk) => {
      expect(validLevels).toContain(risk.impact);
      expect(validLevels).toContain(risk.probability);
      expect(risk.risk.length).toBeGreaterThan(5);
      expect(risk.contingencyPlan.length).toBeGreaterThan(10);
      expect(risk.triggerCondition.length).toBeGreaterThan(10);
    });
  });

  it('should enforce that high impact risks always possess contingency trigger protocols', () => {
    const plan = MOCK_BLUEPRINTS['ai-hackathon'];
    const criticalOrHighRisks = plan.riskContingencyMatrix.filter(
      (r) => r.impact === 'Critical' || r.impact === 'High'
    );

    expect(criticalOrHighRisks.length).toBeGreaterThan(0);
    criticalOrHighRisks.forEach((risk) => {
      expect(risk.triggerCondition).toBeDefined();
      expect(risk.contingencyPlan.length).toBeGreaterThan(15);
    });
  });
});
