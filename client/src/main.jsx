import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';

const base = import.meta.env.BASE_URL || '/';

const fontStyle = document.createElement('style');
fontStyle.setAttribute('data-fonts', 'piazzolla');
fontStyle.textContent = `
  @font-face {
    font-family: 'Piazzolla';
    src: url('${base}assets/fonts/Piazzolla/Piazzolla-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Piazzolla';
    src: url('${base}assets/fonts/Piazzolla/Piazzolla-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Piazzolla';
    src: url('${base}assets/fonts/Piazzolla/Piazzolla-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`;
document.head.appendChild(fontStyle);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
