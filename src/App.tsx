import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { EventInputModal } from './components/EventInputModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MOCK_BLUEPRINTS } from './data/mockBlueprints';
import { EventPlan, EventInput } from './types/event';
import { generateEventPlan } from './services/aiService';
import { generateICS, generateMarkdownSummary, downloadFile } from './utils/exportUtils';
import { Shield, Cpu, Loader2 } from 'lucide-react';

// Dynamic Lazy Loading for optimal bundle code-splitting & sub-second initial paint
const BudgetSection = lazy(() => import('./components/BudgetSection').then(m => ({ default: m.BudgetSection })));
const TimelineSection = lazy(() => import('./components/TimelineSection').then(m => ({ default: m.TimelineSection })));
const VendorSection = lazy(() => import('./components/VendorSection').then(m => ({ default: m.VendorSection })));
const InvitationSection = lazy(() => import('./components/InvitationSection').then(m => ({ default: m.InvitationSection })));
const RiskSentinelSection = lazy(() => import('./components/RiskSentinelSection').then(m => ({ default: m.RiskSentinelSection })));
const AtmosphereGallery = lazy(() => import('./components/AtmosphereGallery').then(m => ({ default: m.AtmosphereGallery })));

/** Section Loading Skeleton Fallback */
const SectionSkeleton: React.FC<{ height?: string; label?: string }> = ({ height = '220px', label = 'Orchestrating module...' }) => (
  <div
    className="glass-card"
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
    <Loader2 size={24} className="animate-spin" color="#b48c48" />
    <span style={{ fontSize: '0.85rem', color: '#78716c', letterSpacing: '0.04em' }}>{label}</span>
  </div>
);

export const App: React.FC = () => {
  const [currentPreset, setCurrentPreset] = useState<string>('royal-wedding');
  const [currentPlan, setCurrentPlan] = useState<EventPlan>(MOCK_BLUEPRINTS['royal-wedding']);
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem('gemini_api_key') || '');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (apiKey) {
      sessionStorage.setItem('gemini_api_key', apiKey);
    } else {
      sessionStorage.removeItem('gemini_api_key');
    }
  }, [apiKey]);

  const handleSelectPreset = useCallback((key: string) => {
    setCurrentPreset(key);
    if (MOCK_BLUEPRINTS[key]) {
      setCurrentPlan(MOCK_BLUEPRINTS[key]);
    }
  }, []);

  const handleCustomSubmit = useCallback(async (input: EventInput) => {
    setIsLoading(true);
    try {
      const newPlan = await generateEventPlan(input, apiKey);
      setCurrentPlan(newPlan);
      setCurrentPreset('custom');
      setIsCustomModalOpen(false);
    } catch (err) {
      alert(`Synthesis Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleExportICS = useCallback(() => {
    const icsContent = generateICS(currentPlan);
    const filename = `${currentPlan.eventType.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.ics`;
    downloadFile(icsContent, filename, 'text/calendar');
  }, [currentPlan]);

  const handleExportMarkdown = useCallback(() => {
    const mdContent = generateMarkdownSummary(currentPlan);
    const filename = `${currentPlan.eventType.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.md`;
    downloadFile(mdContent, filename, 'text/markdown');
  }, [currentPlan]);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Dynamic Atmospheric Venue Background */}
        {currentPlan.coverImage && (
          <div className="app-bg-wrapper no-print">
            <div
              className="app-bg-image"
              style={{ backgroundImage: `url(${currentPlan.coverImage})` }}
            />
            <div className="app-bg-overlay" />
          </div>
        )}

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
        <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.75rem 1.25rem' }}>
          
          {/* Event Header Banner */}
          <EventHeader plan={currentPlan} />

          {/* Lazy Loaded Sections with Suspense boundaries */}
          <Suspense fallback={<SectionSkeleton height="260px" label="Synthesizing Atmosphere Dossier..." />}>
            <AtmosphereGallery plan={currentPlan} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="320px" label="Calculating Quant Financial Allocations..." />}>
            <BudgetSection budget={currentPlan.budgetAllocation} />
          </Suspense>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <Suspense fallback={<SectionSkeleton height="380px" label="Sequencing Chrono Timeline..." />}>
              <TimelineSection
                timeline={currentPlan.timelineItinerary}
                onExportICS={handleExportICS}
              />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="380px" label="Constructing Procurement Matrix..." />}>
              <VendorSection tasks={currentPlan.vendorChecklist} />
            </Suspense>
          </div>

          <Suspense fallback={<SectionSkeleton height="300px" label="Rendering Invitation Studio..." />}>
            <InvitationSection
              studio={currentPlan.invitationStudio}
              eventTitle={currentPlan.eventSummary.title}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton height="300px" label="Scanning Risk Contingency Sentinel..." />}>
            <RiskSentinelSection risks={currentPlan.riskContingencyMatrix} />
          </Suspense>

        </main>

        {/* Footer */}
        <footer className="glass-card no-print" style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderTop: '1px solid #e7e5e0', background: 'rgba(255, 255, 255, 0.95)', padding: '1.5rem 1.25rem', marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#78716c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={15} color="#b48c48" />
              <span>Built for <strong>Hack2Skill PromptWars Virtual</strong> — [Challenge 5] Celebration & Event Planner</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span>Powered by <strong>Google Antigravity</strong> & <strong>Gemini 2.0 Flash</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={13} color="#10b981" /> 100% Client-Side Privacy
              </span>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <EventInputModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSubmit={handleCustomSubmit}
          isLoading={isLoading}
        />

        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={setApiKey}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
