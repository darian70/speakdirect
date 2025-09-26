"use client"

import React from 'react'

type ErrorBoundaryState = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Optionally report to an error tracking service
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6 m-4 border rounded-lg bg-red-50 border-red-200 text-red-800">
          <h2 className="font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm mb-4">Please try again. If the problem persists, contact support.</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="btn-secondary"
            aria-label="Retry rendering content"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children as React.ReactNode
  }
}
