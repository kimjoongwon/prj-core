import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LoggerUtil } from '@shared/utils';

const logger = LoggerUtil.create('[ElementErrorBoundary]');

interface Props {
  children: ReactNode;
  elementName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ElementErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { elementName } = this.props;
    
    logger.error(`💥 Element rendering error for: ${elementName || 'Unknown'}`, {
      elementName,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      const { elementName, fallback } = this.props;
      const { error } = this.state;
      
      if (fallback) {
        return fallback;
      }

      return (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          <h4 className="font-bold text-red-700 mb-2">🚨 Element Rendering Error</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Component:</strong> {elementName || 'Unknown'}</p>
            <p><strong>Error:</strong> {error?.message || 'Unknown error'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-red-600 hover:text-red-800">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
                {error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
