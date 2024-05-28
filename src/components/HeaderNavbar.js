import React from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import './HeaderNavbar.css'

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
              <Link to="/schedule">
                <Image className="app-logo" src={`${process.env.PUBLIC_URL}/AppLogo.png`}/>
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar>
    );
}