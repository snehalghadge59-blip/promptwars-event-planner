/**
 * @fileoverview Navbar — Sticky application header for AuraPlan AI.
 *
 * Renders the brand identity, one-click evaluator preset switcher, and the
 * action suite (API key, export buttons, new plan). Implemented as a
 * `<header>` landmark with `position: sticky` for persistent navigation.
 */

import React from 'react';
import { Sparkles, Key, PlusCircle, Download, FileText, Calendar, CheckCircle2 } from 'lucide-react';

/**
 * Props for the {@link Navbar} component.
 */
interface NavbarProps {
  /** Key of the currently active evaluator preset (e.g. `'royal-wedding'`). */
  currentPreset: string;
  /** Callback to switch the active event blueprint preset. */
  onSelectPreset: (key: string) => void;
  /** Opens the custom event synthesis modal. */
  onOpenCustomModal: () => void;
  /** Opens the Gemini API key configuration modal. */
  onOpenApiKeyModal: () => void;
  /** Triggers a browser print dialog for PDF export. */
  onExportPDF: () => void;
  /** Downloads an RFC 5545 iCalendar file of the active event timeline. */
  onExportICS: () => void;
  /** Downloads a Markdown executive dossier of the active event plan. */
  onExportMarkdown: () => void;
  /** Whether a valid Gemini API key is currently configured in the session. */
  hasApiKey: boolean;
}

/**
 * Sticky application header providing brand identity, evaluator preset
 * switching, and export/action controls for AuraPlan AI.
 *
 * Renders as an HTML `<header>` landmark element with `aria-pressed` state
 * on each preset button for screen reader compatibility.
 */
export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  onSelectPreset,
  onOpenCustomModal,
  onOpenApiKeyModal,
  onExportPDF,
  onExportICS,
  onExportMarkdown,
  hasApiKey,
}) => {
  return (
    <header className="glass-card no-print" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #e7e5e0', background: 'rgba(255, 255, 255, 0.95)', padding: '0.85rem 1.75rem', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(60, 45, 30, 0.04)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Mission */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #b48c48 0%, #96702e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(180, 140, 72, 0.3)' }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: '#1c1917', letterSpacing: '-0.01em' }}>
                AuraPlan AI
              </span>
              <span className="badge badge-amber">Challenge 5</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0, fontWeight: 500 }}>
              Autonomous Celebration & Event Architect
            </p>
          </div>
        </div>

        {/* 1-Click Presets for Evaluators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5f2eb', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2ddd5' }}>
          <span style={{ fontSize: '0.72rem', color: '#78716c', padding: '0 0.5rem', fontWeight: 600 }}>
            EVALUATOR PRESETS:
          </span>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'royal-wedding' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('royal-wedding')}
            title="Load Grand Jaipur Royal Wedding Blueprint"
            aria-label="Load Royal Wedding event blueprint"
            aria-pressed={currentPreset === 'royal-wedding'}
          >
            👑 Royal Wedding
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'ai-hackathon' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('ai-hackathon')}
            title="Load Nexus26 36-Hour Hackathon Blueprint"
            aria-label="Load AI Hackathon event blueprint"
            aria-pressed={currentPreset === 'ai-hackathon'}
          >
            ⚡ AI Hackathon
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'milestone-birthday' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('milestone-birthday')}
            title="Load Elysium Noir Rooftop 30th Birthday Blueprint"
            aria-label="Load Milestone Birthday event blueprint"
            aria-pressed={currentPreset === 'milestone-birthday'}
          >
            🍸 30th Birthday
          </button>
        </div>

        {/* Actions Suite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiKeyModal}
            title={hasApiKey ? 'Gemini API Key Configured' : 'Configure Gemini API Key'}
          >
            {hasApiKey ? <CheckCircle2 size={14} color="#10b981" /> : <Key size={14} />}
            <span>{hasApiKey ? 'Gemini Active' : 'API Key'}</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportICS}
            title="Download Calendar (.ics) file"
            aria-label="Export and download iCalendar .ics file"
          >
            <Calendar size={14} />
            <span>.ICS</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportMarkdown}
            title="Copy / Download Markdown Summary"
            aria-label="Export event plan as Markdown document"
          >
            <FileText size={14} />
            <span>Doc</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportPDF}
            title="Print or Save PDF"
            aria-label="Print or save event plan as PDF"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCustomModal}
            title="Synthesize New Event Blueprint"
          >
            <PlusCircle size={15} />
            <span>New Plan</span>
          </button>
        </div>

      </div>
    </header>
  );
};
