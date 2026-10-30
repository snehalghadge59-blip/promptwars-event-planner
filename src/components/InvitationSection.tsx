/**
 * @fileoverview InvitationSection — AI Theme & Invitation Studio panel.
 *
 * Renders dual-channel AI-generated invitation copy: a formal digital invite
 * and a punchy WhatsApp/social broadcast message. Each card supports
 * one-click clipboard copy with a celebratory confetti burst as micro-feedback.
 */

import React, { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitationStudio } from '../types/event';

/**
 * Props for the {@link InvitationSection} component.
 */
interface InvitationSectionProps {
  /** AI-generated invitation copy in formal and casual formats. */
  studio: InvitationStudio;
  /** Display title of the event, used in the section description. */
  eventTitle: string;
}

/**
 * Renders the AI Theme & Invitation Studio section.
 *
 * Displays two invitation cards — formal and WhatsApp/social — each with
 * a one-click clipboard copy button and confetti micro-animation feedback.
 *
 * @param studio     - AI-generated invitation copy object.
 * @param eventTitle - Event title shown in the section subheading.
 */
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
            <h2 style={{ fontSize: '1.45rem', color: '#1c1917' }}>AI Theme & Invitation Studio</h2>
            <span className="badge badge-purple">
              <PartyPopper size={13} /> Architect Agent
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#57534e' }}>
            Dual-channel copy generation for {eventTitle}: formal digital invitations & instant WhatsApp RSVP broadcasting
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Formal Invitation Card */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#ffffff', border: '1px solid #e7e5e0', borderLeft: '4px solid #b48c48' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b48c48', fontSize: '0.875rem', fontWeight: 600 }}>
              <Mail size={16} /> Formal Digital Invitation
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy(studio.formalInvitation, 'formal')}
              title="Copy Formal Invitation"
            >
              {copiedType === 'formal' ? <Check size={14} color="#047857" /> : <Copy size={14} />}
              <span>{copiedType === 'formal' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e0', padding: '1.15rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: '#292524', lineHeight: 1.7, fontStyle: 'italic', minHeight: '120px', fontFamily: 'var(--font-serif)' }}>
            "{studio.formalInvitation}"
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#78716c' }}>
            <strong>RSVP Guideline:</strong> {studio.rsvpCallToAction}
          </div>
        </div>

        {/* WhatsApp Broadcast Card */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#ffffff', border: '1px solid #e7e5e0', borderLeft: '4px solid #047857' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontSize: '0.875rem', fontWeight: 600 }}>
              <MessageCircle size={16} /> WhatsApp / Social RSVP Broadcast
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy(studio.casualWhatsAppCopy, 'whatsapp')}
              title="Copy WhatsApp Message"
            >
              {copiedType === 'whatsapp' ? <Check size={14} color="#047857" /> : <Copy size={14} />}
              <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e0', padding: '1.15rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: '#292524', lineHeight: 1.7, minHeight: '120px' }}>
            {studio.casualWhatsAppCopy}
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#78716c' }}>
            <strong>Format:</strong> Pre-optimized with emojis and mobile tap links
          </div>
        </div>

      </div>
    </section>
  );
};
