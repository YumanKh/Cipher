import { Component, type ReactNode } from 'react'
import ErrorPage from '../pages/ErrorPage'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="Something went wrong"
          message="An unexpected error occurred. Try reloading the page, or head back home."
          onHome={() => { window.location.href = '/' }}
        />
      )
    }
    return this.props.children
  }
}