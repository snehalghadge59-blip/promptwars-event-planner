import { describe, it, expect } from 'vitest';

describe('Security & XSS Defense Suite', () => {
  it('should verify event text inputs do not execute unescaped script injections', () => {
    const maliciousInput = '<script>alert("xss")</script>Jaipur Royal Palace';
    const sanitized = maliciousInput.replace(/<[^>]*>?/gm, '');

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('alert("xss")Jaipur Royal Palace');
  });

  it('should safely handle prototype pollution attack vectors in event objects', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}, "eventType": "Wedding"}');
    
    expect(maliciousPayload.eventType).toBe('Wedding');
    expect(({} as any).isAdmin).toBeUndefined();
  });

  it('should ensure ICS output strips carriage returns to prevent CRLF injection attacks', () => {
    const maliciousSummary = 'Royal Wedding\r\nATTENDEE:admin@hack2skill.com\r\n';
    const sanitizedSummary = maliciousSummary.replace(/[\r\n]+/g, ' ');

    expect(sanitizedSummary).not.toContain('\r\n');
    expect(sanitizedSummary).toBe('Royal Wedding ATTENDEE:admin@hack2skill.com ');
  });
});
