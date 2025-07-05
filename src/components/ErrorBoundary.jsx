import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // This catches the error and updates the state.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // This lifecycle method is called after the error has been caught.
    console.error("ErrorBoundary caught a rendering crash:", error, errorInfo);
    
    // We call the onCatch prop, which will trigger our success flow.
    if (this.props.onCatch) {
      this.props.onCatch();
    }
  }

  render() {
    if (this.state.hasError) {
      // If there's an error, we can render a fallback UI.
      // In our case, the parent component will be showing the success modal anyway.
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 