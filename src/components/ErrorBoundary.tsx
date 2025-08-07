
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.sectionName || 'Component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-red-800 font-medium">
              Erro na seção {this.props.sectionName}
            </h3>
          </div>
          <p className="text-red-700 text-sm mb-4">
            Ocorreu um erro ao carregar esta seção. Tente recarregar.
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
            size="sm"
          >
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
