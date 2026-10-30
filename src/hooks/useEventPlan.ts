/**
 * @fileoverview Core state management hook for AuraPlan AI.
 *
 * {@link useEventPlan} is the single source of truth for all event state and
 * user-initiated operations. It encapsulates:
 * - Preset blueprint selection and custom AI synthesis.
 * - Export operations (PDF, ICS, Markdown).
 * - Gemini API key lifecycle (sessionStorage-backed).
 * - Structured error state with programmatic dismiss.
 *
 * Separating business logic from the presentation layer improves testability,
 * makes refactoring safe, and enforces the Single Responsibility Principle.
 */

import { useState, useEffect, useCallback } from 'react';
import { MOCK_BLUEPRINTS } from '../data/mockBlueprints';
import { EventPlan, EventInput } from '../types/event';
import { generateEventPlan } from '../services/aiService';
import { generateICS, generateMarkdownSummary, downloadFile } from '../utils/exportUtils';
import {
  SESSION_KEY_GEMINI_API,
  DEFAULT_PRESET,
  PRESET_CUSTOM,
} from '../constants';

/**
 * Public interface returned by {@link useEventPlan}.
 *
 * All state values and callbacks required by the App component and its
 * child modals are surfaced here; no internal state is leaked.
 */
export interface UseEventPlanReturn {
  currentPreset: string;
  currentPlan: EventPlan;
  apiKey: string;
  isLoading: boolean;
  errorMessage: string | null;
  handleSelectPreset: (key: string) => void;
  handleCustomSubmit: (input: EventInput) => Promise<void>;
  handleExportPDF: () => void;
  handleExportICS: () => void;
  handleExportMarkdown: () => void;
  handleSaveApiKey: (key: string) => void;
  dismissError: () => void;
}

/**
 * Custom React hook that encapsulates all AuraPlan AI event state and
 * user-initiated operations.
 *
 * Follows the Single Responsibility Principle — the hook owns state
 * and business logic; components own rendering and user interaction.
 *
 * @returns {@link UseEventPlanReturn} — stable references to all state
 *   values and callback functions needed by the App component tree.
 */
export function useEventPlan(): UseEventPlanReturn {
  const [currentPreset, setCurrentPreset] = useState<string>(DEFAULT_PRESET);
  const [currentPlan, setCurrentPlan] = useState<EventPlan>(MOCK_BLUEPRINTS[DEFAULT_PRESET]);
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem(SESSION_KEY_GEMINI_API) || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync API key to / from sessionStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      sessionStorage.setItem(SESSION_KEY_GEMINI_API, apiKey);
    } else {
      sessionStorage.removeItem(SESSION_KEY_GEMINI_API);
    }
  }, [apiKey]);

  const handleSelectPreset = useCallback((key: string) => {
    setCurrentPreset(key);
    if (MOCK_BLUEPRINTS[key]) {
      setCurrentPlan(MOCK_BLUEPRINTS[key]);
    }
  }, []);

  const handleCustomSubmit = useCallback(async (input: EventInput): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const newPlan = await generateEventPlan(input, apiKey);
      setCurrentPlan(newPlan);
      setCurrentPreset(PRESET_CUSTOM);
    } catch (err) {
      // Set in-app error state (replaces blocking alert)
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
      // Re-throw so callers (e.g., modal) can distinguish success from failure
      throw err;
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

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const dismissError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
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
  };
}
