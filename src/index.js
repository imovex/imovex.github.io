import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import swDev from './swDev';
import { WorkingTimesProvider } from './components/WorkingTimesContext';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>    
    <WorkingTimesProvider>
      <App/>
    </WorkingTimesProvider>
  </React.StrictMode>
);
swDev();
