import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Intro from './Intro';
import Disclaimer from './Disclaimer';
import Data from './Data';
import Settings from './Settings';
import Schedule from './Schedule';
import ScheduleGamified from './ScheduleGamified';
import ThankYou from './ThankYou';
import Leaderboard from './Leaderboard';
import './App.css';

function App() {
  const history = createBrowserHistory();

  useEffect(() => {
    const isFirstVisit = (localStorage.getItem('userId') === null);
    const isGamified = (localStorage.getItem('gamification') === 'true');

    if (isFirstVisit) {
      history.push('/intro');
    } else if (isGamified) {
      history.push('/gschedule');
    } else {
      history.push('/schedule');
    }

    const path = localStorage.getItem('path');
    if (path) {
      localStorage.removeItem('path');
      history.push(path);
    }
  }, [history]);

  return (
    <div className="App">
       <Router history={history}>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/data" element={<Data />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/gschedule" element={<ScheduleGamified />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/thankyou" element={<ThankYou />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
