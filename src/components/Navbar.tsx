import React from 'react';
import { Sparkles, Key, PlusCircle, Download, FileText, Calendar, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentPreset: string;
  onSelectPreset: (key: string) => void;
  onOpenCustomModal: () => void;
  onOpenApiKeyModal: () => void;
  onExportPDF: () => void;
  onExportICS: () => void;
  onExportMarkdown: () => void;
  hasApiKey: boolean;
}

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
    <header className="glass-card no-print" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0.85rem 1.75rem', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Mission */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AuraPlan AI
              </span>
              <span className="badge badge-indigo">Challenge 5</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
              Autonomous Celebration & Event Architect
            </p>
          </div>
        </div>

        {/* 1-Click Presets for Evaluators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0, 0, 0, 0.35)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '0 0.5rem', fontWeight: 600 }}>
            EVALUATOR PRESETS:
          </span>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'royal-wedding' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('royal-wedding')}
            title="Load Grand Jaipur Royal Wedding Blueprint"
          >
            👑 Royal Wedding
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'ai-hackathon' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('ai-hackathon')}
            title="Load Nexus26 36-Hour Hackathon Blueprint"
          >
            ⚡ AI Hackathon
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentPreset === 'milestone-birthday' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onSelectPreset('milestone-birthday')}
            title="Load Elysium Noir Rooftop 30th Birthday Blueprint"
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
          >
            <Calendar size={14} />
            <span>.ICS</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportMarkdown}
            title="Copy / Download Markdown Summary"
          >
            <FileText size={14} />
            <span>Doc</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportPDF}
            title="Print or Save PDF"
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
