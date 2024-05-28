import React from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { Gear, Trophy } from 'react-bootstrap-icons';
import './HeaderNavbarGamified.css'

export default function HeaderNavbar() {
    return (
        <Navbar>
          <Nav>           
            <Nav.Link>
              <Link to="/settings">
                <Gear className="settings-icon"/>
              </Link>
            </Nav.Link>
          </Nav>
          <Nav className="home">
            <Nav.Link>
              <Link to="/gschedule">
                <Image className="app-logo-gamified" src={`${process.env.PUBLIC_URL}/AppLogo.png`}/>
              </Link>
            </Nav.Link>
          </Nav>
          <Nav>           
            <Nav.Link>
              <Link to="/leaderboard">
                <Trophy className="leaderboard-icon"/>
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar>
    );
}