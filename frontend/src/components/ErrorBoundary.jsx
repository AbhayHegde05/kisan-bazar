import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{this.state.error?.message}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
