/**
 * @fileoverview Export utilities for AuraPlan AI.
 *
 * Provides three output channels for a synthesised {@link EventPlan}:
 * - {@link generateICS} — RFC 5545 iCalendar serialisation for calendar apps.
 * - {@link generateMarkdownSummary} — Human-readable executive dossier.
 * - {@link downloadFile} — Browser download trigger with guaranteed Blob cleanup.
 */

import { EventPlan, TimelineItem } from '../types/event';
import { formatCurrency } from './budgetCalculator';
import { ICS_PRODID } from '../constants';

/**
 * Serialises an {@link EventPlan}'s timeline into a valid RFC 5545 iCalendar
 * (`.ics`) string, suitable for import into Google Calendar, Apple Calendar,
 * Outlook, and any compliant calendar client.
 *
 * Each timeline activity becomes a `VEVENT` component with:
 * - A stable `UID` scoped to the plan ID, item index, and event date.
 * - Approximate `DTSTART`/`DTEND` derived from the human-readable time string.
 * - An escaped `DESCRIPTION` containing the activity details and buffer minutes.
 *
 * @param plan - The fully-populated event plan to serialise.
 * @returns A CRLF-delimited iCalendar string beginning with `BEGIN:VCALENDAR`.
 */
export function generateICS(plan: EventPlan): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const eventDateStr = plan.eventDate || new Date().toISOString().split('T')[0];
  const dateCompact = eventDateStr.replace(/-/g, '');

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${ICS_PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(plan.eventSummary.title)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  plan.timelineItinerary.forEach((item: TimelineItem, index: number) => {
    const uid = `auraplan-${plan.id}-${index}-${dateCompact}@auraplan.ai`;
    // Approximate start time from time string (e.g., "10:00 AM" or "18:00")
    const timeMatch = item.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let hour = 10;
    let min = 0;
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      min = parseInt(timeMatch[2], 10);
      const mer = timeMatch[3]?.toUpperCase();
      if (mer === 'PM' && hour < 12) hour += 12;
      if (mer === 'AM' && hour === 12) hour = 0;
    }
    const startStr = `${dateCompact}T${String(hour).padStart(2, '0')}${String(min).padStart(2, '0')}00Z`;
    // End time with duration or buffer
    const endHour = (hour + 1) % 24;
    const endStr = `${dateCompact}T${String(endHour).padStart(2, '0')}${String(min).padStart(2, '0')}00Z`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${escapeICS(`[${item.phase}] ${item.activity}`)}`,
      `DESCRIPTION:${escapeICS(`${item.details} (Buffer: ${item.bufferMinutes}m)`)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

function escapeICS(str: string): string {
  // Strip carriage returns and newlines first to prevent CRLF injection (RFC 5545 §3.3.11)
  const sanitized = str.replace(/[\r\n]+/g, ' ');
  return sanitized
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/**
 * Triggers a browser file download for the supplied content string.
 *
 * Uses `URL.createObjectURL` with a `try/finally` block to guarantee that
 * the temporary Blob URL is always revoked, preventing memory leaks even if
 * an exception occurs during link click simulation.
 *
 * @param content  - UTF-8 string content to write into the downloaded file.
 * @param filename - Desired filename shown in the browser save dialog.
 * @param mimeType - MIME type of the file (defaults to `'text/plain'`).
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  try {
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.setAttribute('aria-hidden', 'true');
    document.body.appendChild(link);
    link.click();
  } finally {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }
}

/**
 * Generates a Markdown executive dossier summarising the complete event plan.
 *
 * The output is formatted for readability in GitHub, Notion, Obsidian, and any
 * Markdown viewer. Sections include: event summary, budget breakdown table,
 * timeline, vendor checklist, and the risk & contingency matrix.
 *
 * @param plan - The fully-populated event plan to summarise.
 * @returns A Markdown string ready for download or clipboard copy.
 */
export function generateMarkdownSummary(plan: EventPlan): string {
  const { eventSummary, budgetAllocation, timelineItinerary, vendorChecklist, riskContingencyMatrix } = plan;

  return `# ${eventSummary.title}
*${eventSummary.tagline}*

> **Theme Concept:** ${eventSummary.themeConcept}  
> **Dress Code:** ${eventSummary.dressCode}  
> **Date:** ${plan.eventDate || 'Flexible / TBD'}  
> **Guests:** ${plan.guestCount} | **Duration:** ${plan.durationHours} Hours | **Setting:** ${plan.locationType}  
> **Special Constraints:** ${plan.specialRequirements || 'None specified'}

---

## 💰 Budget Breakdown
**Total Budget:** ${formatCurrency(budgetAllocation.total, budgetAllocation.currency)}  
**Contingency Reserve:** ${formatCurrency(budgetAllocation.contingencyReserve, budgetAllocation.currency)}

| Category | Allocated | Share | Strategy & Negotiation Tip |
| :--- | :--- | :--- | :--- |
${budgetAllocation.categories.map(c => `| ${c.category} | ${formatCurrency(c.allocated, budgetAllocation.currency)} | ${c.percentage}% | ${c.tips} |`).join('\n')}

---

## ⏱️ Run-of-Show Timeline
${timelineItinerary.map(t => `- **${t.time}** [${t.phase}] **${t.activity}** (Buffer: ${t.bufferMinutes}m)\n  *${t.details}*`).join('\n')}

---

## 📋 Critical Vendor & Procurement Checklist
${vendorChecklist.map(v => `- [ ] **${v.task}** (${v.category}) — Due: ${v.deadlineWeeksBefore}w before | Priority: ${v.priority}\n  *Contract Clause:* ${v.negotiationCheck}`).join('\n')}

---

## 🛡️ Risk & Contingency Matrix
${riskContingencyMatrix.map(r => `### ⚠️ Risk: ${r.risk} (Probability: ${r.probability} | Impact: ${r.impact})
- **Trigger:** ${r.triggerCondition}
- **Plan B Action:** ${r.contingencyPlan}
`).join('\n')}

---
*Generated by AuraPlan AI Core — PromptWars Challenge 5*
`;
}
