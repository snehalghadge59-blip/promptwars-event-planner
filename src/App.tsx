/**
 * @fileoverview Main application shell for AuraPlan AI.
 *
 * Coordinates state across the top navigation bar, hero event banner,
 * modular lazy-loaded planning sections (Atmosphere, Budget, Timeline,
 * Vendors, Invitations, Guest Operations, and Risk Sentinel), and interactive
 * configuration dialogs.
 */

import React, { useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { EventInputModal } from './components/EventInputModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useEventPlan } from './hooks/useEventPlan';
import { Shield, Cpu, Loader2, AlertTriangle, X } from 'lucide-react';

// Dynamic Lazy Loading for optimal bundle code-splitting & sub-second initial paint
const BudgetSection = lazy(() => import('./components/BudgetSection').then(m => ({ default: m.BudgetSection })));
const TimelineSection = lazy(() => import('./components/TimelineSection').then(m => ({ default: m.TimelineSection })));
const VendorSection = lazy(() => import('./components/VendorSection').then(m => ({ default: m.VendorSection })));
const InvitationSection = lazy(() => import('./components/InvitationSection').then(m => ({ default: m.InvitationSection })));
const GuestTrackerSection = lazy(() => import('./components/GuestTrackerSection').then(m => ({ default: m.GuestTrackerSection })));
const RiskSentinelSection = lazy(() => import('./components/RiskSentinelSection').then(m => ({ default: m.RiskSentinelSection })));
const AtmosphereGallery = lazy(() => import('./components/AtmosphereGallery').then(m => ({ default: m.AtmosphereGallery })));

/**
 * Skeleton loading fallback rendered while lazy-loaded section bundles resolve.
 *
 * @param props.height - Minimum height of the skeleton placeholder box.
 * @param props.label  - Status description announced to screen readers.
 */
const SectionSkeleton: React.FC<{ height?: string; label?: string }> = ({
  height = '220px',
  label = 'Orchestrating module…',
}) => (
  <div
    className="glass-card"
    role="status"
    aria-label={label}
    style={{
      height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
      background: 'rgba(255, 255, 255, 0.7)',
    }}
  >
    <Loader2 size={24} className="animate-spin" color="#b48c48" aria-hidden="true" />
    <span style={{ fontSize: '0.85rem', color: '#78716c', letterSpacing: '0.04em' }}>{label}</span>
  </div>
);

/** In-app error toast — replaces blocking alert() for better UX and code quality */
const ErrorToast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
  <div
    role="alert"
    aria-live="assertive"
    style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ffffff',
      border: '1px solid #fecdd3',
      borderLeft: '4px solid #be123c',
      borderRadius: '10px',
      padding: '0.85rem 1.25rem',
      boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 2000,
      maxWidth: '520px',
      width: 'calc(100% - 2rem)',
    }}
  >
    <AlertTriangle size={18} color="#be123c" aria-hidden="true" style={{ flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <strong style={{ fontSize: '0.85rem', color: '#1c1917', display: 'block' }}>Synthesis Error</strong>
      <span style={{ fontSize: '0.8rem', color: '#57534e' }}>{message}</span>
    </div>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss error"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', padding: 0, flexShrink: 0 }}
    >
      <X size={16} />
    </button>
  </div>
);

export const App: React.FC = () => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const {
    currentPreset,
    currentPlan,
    apiKey,
    isLoading,
    errorMessage,
    handleSelectPreset,
    handleCustomSubmit,
    handleExportPDF,
    handleExportICS,
    handleExportMarkdown,
    handleSaveApiKey,
    dismissError,
  } = useEventPlan();

  const handleCustomSubmitAndClose = async (input: Parameters<typeof handleCustomSubmit>[0]) => {
    try {
      await handleCustomSubmit(input);
      // On success (no throw), close the modal
      setIsCustomModalOpen(false);
    } catch {
      // Error is displayed via ErrorToast — modal stays open so user can retry
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Dynamic Atmospheric Venue Background */}
        {currentPlan.coverImage && (
          <div className="app-bg-wrapper no-print" aria-hidden="true">
            <div
              className="app-bg-image"
              style={{ backgroundImage: `url(${currentPlan.coverImage})` }}
            />
            <div className="app-bg-overlay" />
          </div>
        )}

        {/* Skip-to-main link for keyboard / screen reader users */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: '-100%',
            left: '1rem',
            zIndex: 9999,
            padding: '0.5rem 1rem',
            background: '#b48c48',
            color: '#ffffff',
            borderRadius: '0 0 8px 8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
          onFocus={(e) => { e.currentTarget.style.top = '0'; }}
          onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <Navbar
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onExportPDF={handleExportPDF}
          onExportICS={handleExportICS}
          onExportMarkdown={handleExportMarkdown}
          hasApiKey={Boolean(apiKey && apiKey.length > 10)}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          aria-label="AuraPlan AI Master Event Orchestration Dashboard"
          style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.75rem 1.25rem' }}
        >

          {/* Event Header Banner */}
          <EventHeader plan={currentPlan} />

          {/* Lazy Loaded Sections with Suspense boundaries */}
          <Suspense fallback={<SectionSkeleton height="260px" label="Synthesizing Atmosphere Dossier…" />}>
            <AtmosphereGallery plan={currentPlan} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="320px" label="Calculating Quant Financial Allocations…" />}>
            <BudgetSection budget={currentPlan.budgetAllocation} />
          </Suspense>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <Suspense fallback={<SectionSkeleton height="380px" label="Sequencing Chrono Timeline…" />}>
              <TimelineSection
                timeline={currentPlan.timelineItinerary}
                onExportICS={handleExportICS}
              />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="380px" label="Constructing Procurement Matrix…" />}>
              <VendorSection tasks={currentPlan.vendorChecklist} />
            </Suspense>
          </div>

          <Suspense fallback={<SectionSkeleton height="300px" label="Rendering Invitation Studio…" />}>
            <InvitationSection
              studio={currentPlan.invitationStudio}
              eventTitle={currentPlan.eventSummary.title}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="320px" label="Orchestrating Guest & RSVP Matrix…" />}>
            <GuestTrackerSection
              initialGuests={currentPlan.guestList}
              targetGuestCount={currentPlan.guestCount}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="300px" label="Scanning Risk Contingency Sentinel…" />}>
            <RiskSentinelSection risks={currentPlan.riskContingencyMatrix} />
          </Suspense>

        </main>

        {/* Footer */}
        <footer
          className="glass-card no-print"
          role="contentinfo"
          style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderTop: '1px solid #e7e5e0', background: 'rgba(255, 255, 255, 0.95)', padding: '1.5rem 1.25rem', marginTop: '3rem', textAlign: 'center' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#78716c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={15} color="#b48c48" aria-hidden="true" />
              <span>Built for <strong>Hack2Skill PromptWars Virtual</strong> — [Challenge 5] Celebration &amp; Event Planner</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span>Powered by <strong>Google Antigravity</strong> &amp; <strong>Gemini 2.0 Flash</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={13} color="#10b981" aria-hidden="true" /> 100% Client-Side Privacy
              </span>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <EventInputModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSubmit={handleCustomSubmitAndClose}
          isLoading={isLoading}
        />

        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />

        {/* In-app Error Toast — replaces blocking alert() */}
        {errorMessage && (
          <ErrorToast message={errorMessage} onDismiss={dismissError} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
