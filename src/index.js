import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import swDev from './swDev';
import { createBrowserHistory } from 'history';
import { WorkingTimesProvider } from './components/WorkingTimesContext';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const history = createBrowserHistory();

const isFirstVisit = (localStorage.getItem("userId") === null);
const isGamified = (localStorage.getItem("gamification") === 'true');

if (isFirstVisit) {
  history.push('/intro');
} else if (isGamified) {
  history.push('/gschedule');
} else {
  history.push('/schedule');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>    
    <WorkingTimesProvider>
      <App history={history} />
    </WorkingTimesProvider>
  </React.StrictMode>
);
swDev();
