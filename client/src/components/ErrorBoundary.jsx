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
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1 className="error-boundary__title">Что-то пошло не так</h1>
            <p className="error-boundary__text">
              Произошла ошибка при загрузке данных или отображении страницы.
            </p>
            {this.state.error && (
              <pre className="error-boundary__detail" aria-hidden="true">
                {this.state.error.message}
              </pre>
            )}
            <div className="error-boundary__actions">
              <button type="button" className="arcane-button error-boundary__btn" onClick={this.handleRetry}>
                Попробовать снова
              </button>
              <a href={import.meta.env.BASE_URL || '/'} className="arcane-button error-boundary__btn">
                На главную
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
