import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './FirebaseAuthContext/AuthProvider';
import './index.css';

import axios from 'axios';
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
