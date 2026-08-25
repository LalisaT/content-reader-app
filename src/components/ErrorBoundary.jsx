import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold mb-1">Something unexpected happened</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {this.state.error?.message || 'A render error occurred.'}
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload TipPulse</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
