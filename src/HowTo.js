import React from "react";
import HeaderNavbar from './components/HeaderNavbar';
import { Col } from 'react-bootstrap';

export default function HowTo() {

    return(
        <div>        
            <HeaderNavbar/>
            <Col className="settingsCol">
                <h5>How to iMOVEx</h5>
            </Col>
        </div>
    );
}
