import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { BudgetSection } from './components/BudgetSection';
import { TimelineSection } from './components/TimelineSection';
import { VendorSection } from './components/VendorSection';
import { InvitationSection } from './components/InvitationSection';
import { RiskSentinelSection } from './components/RiskSentinelSection';
import { EventInputModal } from './components/EventInputModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MOCK_BLUEPRINTS } from './data/mockBlueprints';
import { EventPlan, EventInput } from './types/event';
import { generateEventPlan } from './services/aiService';
import { generateICS, generateMarkdownSummary, downloadFile } from './utils/exportUtils';
import { Shield, Cpu } from 'lucide-react';

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

  const handleSelectPreset = (key: string) => {
    setCurrentPreset(key);
    if (MOCK_BLUEPRINTS[key]) {
      setCurrentPlan(MOCK_BLUEPRINTS[key]);
    }
  };

  const handleCustomSubmit = async (input: EventInput) => {
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
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportICS = () => {
    const icsContent = generateICS(currentPlan);
    const filename = `${currentPlan.eventType.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.ics`;
    downloadFile(icsContent, filename, 'text/calendar');
  };

  const handleExportMarkdown = () => {
    const mdContent = generateMarkdownSummary(currentPlan);
    const filename = `${currentPlan.eventType.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.md`;
    downloadFile(mdContent, filename, 'text/markdown');
  };

  return (
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

        {/* Dynamic Budget Optimizer */}
        <BudgetSection budget={currentPlan.budgetAllocation} />

        {/* Two-column layout for Timeline & Vendor Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <TimelineSection
            timeline={currentPlan.timelineItinerary}
            onExportICS={handleExportICS}
          />
          <VendorSection tasks={currentPlan.vendorChecklist} />
        </div>

        {/* AI Theme & Invitation Studio */}
        <InvitationSection
          studio={currentPlan.invitationStudio}
          eventTitle={currentPlan.eventSummary.title}
        />

        {/* Risk & Contingency Sentinel */}
        <RiskSentinelSection risks={currentPlan.riskContingencyMatrix} />

      </main>

      {/* Footer */}
      <footer className="glass-card no-print" style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', padding: '1.5rem 1.25rem', marginTop: '3rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={15} color="#6366f1" />
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
  );
};

export default App;
