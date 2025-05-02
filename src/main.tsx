import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store'; // ✅ คงไว้แค่บรรทัดเดียว
import { listenToAuthChanges } from './store/slices/authSlice';

store.dispatch(listenToAuthChanges());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
