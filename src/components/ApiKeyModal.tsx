import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, apiKey, onSaveApiKey }) => {
  const [inputVal, setInputVal] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputVal.trim());
    onClose();
  };

  const handleClear = () => {
    setInputVal('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="#6366f1" />
            <h2 id="api-modal-title" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Google Gemini API Configuration</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', gap: '0.65rem' }}>
          <ShieldCheck size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>100% Client-Side Privacy:</strong> Your Gemini API key is stored strictly in your browser session. It is never logged, stored in databases, or sent anywhere other than official Google AI endpoints.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="apiKeyInput">Gemini API Key (Google AI Studio)</label>
          <input
            id="apiKeyInput"
            type="password"
            className="form-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="AIzaSy..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.785rem' }}>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
          >
            Get a free key at Google AI Studio <ExternalLink size={12} />
          </a>

          {apiKey && (
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.785rem' }}
              aria-label="Clear saved Gemini API key"
            >
              <Trash2 size={12} /> Clear Key
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
