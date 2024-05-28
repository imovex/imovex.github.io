import React, { useState } from "react";
import { Col, Row, Form, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Intro.css';

function Intro() {
    const [displayText, setDisplayText] = useState("Help yourself to integrate more physical activity into your working day to keep your health in mind");
    const [step, setStep] = useState(1);

    const handleButtonClick = () => {
        if (step === 1) {
            setDisplayText("Let's get started by checking your working day routine and set up a schedule to increase your activity!");
            setStep(2);
        } 
    };

    return (
        <div>
            {step === 1 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <Form.Label className="info-text">{displayText}</Form.Label>
                    <Col className="button-col">
                        <Button className="ok-button" onClick={handleButtonClick}>Understood</Button>
                    </Col>
                </Row>
            ) : step === 2 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <Form.Label className="info-text">{displayText}</Form.Label>
                    <Link to="/disclaimer"><Button className="ok-button" onClick={handleButtonClick}>Get Started</Button></Link>
                </Row>
            ) : null}
        </div>
    );
}

export default Intro;
