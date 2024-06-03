import React, { useState } from "react";
import { Col, Row, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Intro.css';
import './Header.css';

function Intro() {
    const [displayText, setDisplayText] = useState("Thank you for being interested in my research! This application will help you to increase the physical activity in your working day.");
    const [step, setStep] = useState(1);

    const handleButtonClick = () => {
        if (step === 1) {
            setDisplayText("You are a suitable testuser if your day includes mainly sedentary work and if you are available for most of the testing period.");
            setStep(2);
        } 
    };

    return (
        <div>
            {step === 1 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <p className="info-text">{displayText}</p>
                    <Col className="button-col">
                        <Button className="ok-button" onClick={handleButtonClick}>I want to participate</Button>
                    </Col>
                </Row>
            ) : step === 2 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <p className="info-text">{displayText}</p>
                    <Link to="/disclaimer"><Button className="ok-button" onClick={handleButtonClick}>Get Started</Button></Link>
                </Row>
            ) : null}
        </div>
    );
}

export default Intro;
