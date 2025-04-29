import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='w-full h-screen flex justify-center items-center text-red-500'>
          <div className='w-full h-full md:w-3/4 md:h-1/2 xl:w-1/2 xl:h-1/2 2xl:w-1/3 md:border p-3 rounded-lg'>
            <h2 className='font-bold text-lg mb-3'>{this.props.fallback || "Something went wrong."}</h2>
            <details className='font-semibold break-all'>
              <span>{this.state.error?.toString()}</span>
              <br />
              <span>{this.state.errorInfo?.componentStack}</span>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;