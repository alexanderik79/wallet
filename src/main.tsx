// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Keep your general index.css if you have one

// Import your Redux Store
import { store } from './app/store.ts'; // Ensure this path is correct

// Import Provider from react-redux
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap your entire application with the Redux Provider */}
    {/* And pass your configured store to it */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);