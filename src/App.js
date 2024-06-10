import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import Disclaimer from './Disclaimer';
import Data from './Data';
import Schedule from './Schedule';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import HowTo from './HowTo';
import About from './About';
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

        if (isFirstVisit) {
          localStorage.removeItem('schedule');
          navigate('/intro');
        } else {
          navigate('/schedule');
        }
      }
    };
  
    useEffect(() => {
      redirectToCorrectPage();
    }, []);

    return (
      <div className="App">
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/data" element={<Data />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/howto" element={<HowTo />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* <Route path="/*" element={<Navigate to="/" />} /> */}
        </Routes>
      </div>
    );
}

export default App;
