import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/intro' Component={Intro}></Route>          
          <Route path='/disclaimer' Component={Disclaimer}></Route>
          <Route path='/data' Component={Data}></Route>
          <Route path='/schedule' Component={Schedule}></Route>          
          <Route path='/gschedule' Component={ScheduleGamified}></Route>          
          <Route path='/leaderboard' Component={Leaderboard}></Route>
          <Route path='/settings' Component={Settings}></Route>
          <Route path='/thankyou' Component={ThankYou}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
