import { Component } from 'react';
import '../styles/components/error-boundary.scss';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-error-boundary">
          <div className="admin-error-boundary__content">
            <h1 className="admin-error-boundary__title">Ошибка</h1>
            <p className="admin-error-boundary__text">
              Произошла ошибка при загрузке или сохранении данных.
            </p>
            {this.state.error && (
              <pre className="admin-error-boundary__detail" aria-hidden="true">
                {this.state.error.message}
              </pre>
            )}
            <div className="admin-error-boundary__actions">
              <button type="button" className="admin-error-boundary__btn" onClick={this.handleRetry}>
                Попробовать снова
              </button>
              <a href={import.meta.env.BASE_URL || '/'} className="admin-error-boundary__btn">
                На обзор
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
