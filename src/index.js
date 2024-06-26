import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import swDev from './swDev';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App/>
    </Router>
  </React.StrictMode>
);
swDev();
