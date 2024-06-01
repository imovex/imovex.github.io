import React from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { Trophy } from 'react-bootstrap-icons';
import './HeaderNavbar.css'

export default function HeaderNavbar() {
    const isGamified = localStorage.getItem('gamification') === 'true';

    return (
        <Navbar>
          <Nav className="home">
            <Nav.Link>
              <Link to="/schedule">
                <Image className="app-logo" src={`${process.env.PUBLIC_URL}/AppLogo.png`}/>
              </Link>
            </Nav.Link>
          </Nav>
               {isGamified ?
                   <Nav className="leaderboard-nav">
                       <Nav.Link>
                            <Link to="/leaderboard">
                                <Trophy className="leaderboard-icon"/>
                            </Link>
                       </Nav.Link>
                   </Nav>
                   : undefined
               }
        </Navbar>
    );
}
