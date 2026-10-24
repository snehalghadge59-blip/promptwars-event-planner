import React, { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitationStudio } from '../types/event';

interface InvitationSectionProps {
  studio: InvitationStudio;
  eventTitle: string;
}

export const InvitationSection: React.FC<InvitationSectionProps> = ({ studio, eventTitle }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    
    // Trigger celebratory confetti burst!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <section className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>AI Theme & Invitation Studio</h2>
            <span className="badge badge-purple">
              <PartyPopper size={13} /> Architect Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Dual-channel copy generation for {eventTitle}: formal digital invitations & instant WhatsApp RSVP broadcasting
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Formal Invitation Card */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(15, 21, 35, 0.75)', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.875rem', fontWeight: 600 }}>
              <Mail size={16} /> Formal Digital Invitation
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy(studio.formalInvitation, 'formal')}
              title="Copy Formal Invitation"
            >
              {copiedType === 'formal' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedType === 'formal' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, fontStyle: 'italic', minHeight: '120px' }}>
            "{studio.formalInvitation}"
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <strong>RSVP Guideline:</strong> {studio.rsvpCallToAction}
          </div>
        </div>

        {/* WhatsApp Broadcast Card */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(15, 21, 35, 0.75)', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.875rem', fontWeight: 600 }}>
              <MessageCircle size={16} /> WhatsApp / Social RSVP Broadcast
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy(studio.casualWhatsAppCopy, 'whatsapp')}
              title="Copy WhatsApp Message"
            >
              {copiedType === 'whatsapp' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, minHeight: '120px' }}>
            {studio.casualWhatsAppCopy}
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <strong>Format:</strong> Pre-optimized with emojis and mobile tap links
          </div>
        </div>

      </div>
    </section>
  );
};
