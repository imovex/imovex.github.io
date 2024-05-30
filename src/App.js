import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, Redirect, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import Disclaimer from './Disclaimer';
import Data from './Data';
import Settings from './Settings';
import Schedule from './Schedule';
import ScheduleGamified from './ScheduleGamified';
import ThankYou from './ThankYou';
import Leaderboard from './Leaderboard';
import NotFoundPage from './NotFoundPage';
import './App.css';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectPath');
    if (redirectPath) {
      localStorage.removeItem('redirectPath');
      navigate(redirectPath);
    }
  }, [navigate]);

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/intro' element={<Intro />} />
          <Route path='/disclaimer' element={<Disclaimer />} />
          <Route path='/data' element={<Data />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/gschedule' element={<ScheduleGamified />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/thankyou' element={<ThankYou />} />
          <Route path='/404' element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
