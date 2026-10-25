import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    console.error('Uncaught error in AuraPlan component tree:', error, errorInfo);
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
              A rendering anomaly occurred within the orchestrator state tree. Your active configuration remains safeguarded.
            </p>

            {this.state.error && (
              <pre
                style={{
                  background: '#f5f5f4',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                  color: '#b91c1c',
                  marginBottom: '1.5rem',
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}

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
