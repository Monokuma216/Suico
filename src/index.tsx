import bridge from '@vkontakte/vk-bridge';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css';
import App from './App';

void bridge.send('VKWebAppInit');

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
