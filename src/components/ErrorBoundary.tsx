/**
 * @fileoverview ErrorBoundary — Enterprise React Error Boundary for AuraPlan AI.
 *
 * Catches unhandled runtime rendering exceptions from any child component and
 * replaces the broken subtree with a recoverable failover UI, preventing a
 * total application crash. Provides one-click "Re-initialize Orchestrator"
 * recovery via a full page reload.
 *
 * Implemented as a React class component because the `componentDidCatch`
 * lifecycle method is not yet available as a hook in React 19.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise React Error Boundary
 * Catches runtime rendering exceptions and provides resilient failover UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Uncaught error in AuraPlan component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#faf8f5',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              border: '1px solid #fed7aa',
              background: '#ffffff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <AlertTriangle size={32} color="#ea580c" />
            </div>

            <h1
              style={{
                fontSize: '1.5rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#1c1917',
                marginBottom: '0.75rem',
              }}
            >
              AuraPlan AI Session Recovered
            </h1>

            <p style={{ color: '#57534e', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              A rendering anomaly occurred within the orchestrator state tree. Your active configuration remains safeguarded. Click below to safely re-initialize the session.
            </p>

            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
              }}
            >
              <RefreshCw size={16} />
              Re-initialize Orchestrator
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
