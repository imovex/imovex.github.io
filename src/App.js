import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import Disclaimer from './Disclaimer';
import Data from './Data';
import Settings from './Settings';
import Schedule from './Schedule';
import ScheduleGamified from './ScheduleGamified';
import ThankYou from './ThankYou';
import Leaderboard from './Leaderboard';
import './App.css';

function App(){
    const navigate = useNavigate();

    const redirectToCorrectPage = () => {
      const path = localStorage.getItem('path');
      if (path) {
        localStorage.removeItem('path');
        navigate('/' + path);
      } else {
        const isFirstVisit = localStorage.getItem('userId') === null;
        const isGamified = localStorage.getItem('gamification') === 'true';
  
        if (isFirstVisit) {
          navigate('/intro');
        } else if (isGamified) {
          navigate('/gschedule');
        } else {
          navigate('/schedule');
        }
      }
    };
  
    useEffect(() => {
      redirectToCorrectPage();
    }, [navigate]);

    return (
      <div className="App">
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/data" element={<Data />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/gschedule" element={<ScheduleGamified />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/thankyou" element={<ThankYou />} />
          {/* <Route path="/*" element={<Navigate to="/" />} /> */}
        </Routes>
      </div>
    );
}

export default App;
