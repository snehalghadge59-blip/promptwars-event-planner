import React from 'react';
import { Camera, Eye, MapPin, Sparkles } from 'lucide-react';
import { EventPlan } from '../types/event';

interface AtmosphereGalleryProps {
  plan: EventPlan;
}

export const AtmosphereGallery: React.FC<AtmosphereGalleryProps> = ({ plan }) => {
  const isWedding = plan.eventType.toLowerCase().includes('wedding');
  const isHackathon = plan.eventType.toLowerCase().includes('hackathon');

  const galleryItems = [
    {
      title: 'Architectural Venue',
      subtitle: plan.locationType,
      image: plan.coverImage || '/images/wedding_bg.jpg',
      tag: 'Setting & Aura',
    },
    {
      title: 'Sober Ambient Decor & Lighting',
      subtitle: isWedding ? 'Warm Candelabras & Ivory Florals' : isHackathon ? 'Electric Neon Mezzanine' : 'Intimate Penthouse Lounge',
      image: isWedding ? '/images/sober_decor.jpg' : isHackathon ? '/images/hackathon_bg.jpg' : '/images/birthday_bg.jpg',
      tag: 'Atmosphere Design',
    },
    {
      title: 'Fine Dining & Banquet Experience',
      subtitle: isWedding ? 'Royal Thali & Dessert Pavilion' : isHackathon ? 'High-Protein Graveyard Fuel' : 'Artisanal Smoked Cocktails',
      image: isWedding ? '/images/wedding_bg.jpg' : isHackathon ? '/images/hackathon_bg.jpg' : '/images/birthday_bg.jpg',
      tag: 'Culinary Art',
    },
  ];

  return (
    <section className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={18} color="#b48c48" />
          <h2 style={{ fontSize: '1.35rem', color: '#1c1917', margin: 0 }}>Visual Moodboard & Atmosphere Dossier</h2>
          <span className="badge badge-amber" style={{ fontSize: '0.675rem' }}>Curated Aesthetics</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          High-Fidelity Architectural & Production Photography
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              height: '180px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
            }}
          >
            {/* Subtle Gradient Shade */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(10,14,24,0.85) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.675rem', padding: '0.15rem 0.5rem' }}>
                  {item.tag}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Eye size={14} />
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.15rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
