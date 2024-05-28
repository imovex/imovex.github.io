import React, { useEffect, useState }from "react";
import { Row, Form, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './ThankYou.css';

export default function ThankYou() {
    const [isGamified, setIsGamified] = useState(false);

    useEffect(() => {
        const gamificationFlag = localStorage.getItem('gamification');
        if (gamificationFlag === "true") {
            setIsGamified(true);
        }
    }, [setIsGamified]);

    return (
        <div>
            <Row className="intro-row">
                <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                <Form.Label className="thanks-text">Thank you for participating in my thesis research ☺</Form.Label>
                {isGamified ? (
                    <Link to="/gschedule"><Button className="ok-button">You're welcome!</Button></Link>
                ) : (
                    <Link to="/schedule"><Button className="ok-button">You're welcome!</Button></Link>
                )}
            </Row>
        </div>
    );
}
