import React, { useState } from "react";
import { Col, Row, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Intro.css';
import './Header.css';

function Intro() {
    const [displayText, setDisplayText] = useState("Thank you for being interested in my research! This application will help you to increase the physical activity in your working day.<br/><br/>You are a suitable testuser if your day includes mainly sedentary work and if you are available for most of the testing period.<br/><br/>The testing period starts on <strong>17.06.2024</strong> and will last about <strong>4 weeks</strong>.");
    const [step, setStep] = useState(1);

    const handleButtonClick = () => {
        if (step === 1) {
            setDisplayText("This thesis is supported and supervised by inovex GmbH.");
            setStep(2);
        } 
    };

    return (
        <div>
            {step === 1 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <p className="info-text" dangerouslySetInnerHTML={{ __html: displayText }}></p>
                    <Col className="button-col">
                        <Button className="ok-button" onClick={handleButtonClick}>I want to participate</Button>
                    </Col>
                </Row>
            ) : step === 2 ? (
                <Row className="intro-row">
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                    <p className="info-text">{displayText}</p>
                    <Image className="welcome" src={`${process.env.PUBLIC_URL}/img/inovex.png`}/>
                    <Link to="/disclaimer"><Button className="ok-button" onClick={handleButtonClick}>Get Started</Button></Link>
                </Row>
            ) : null}
        </div>
    );
}

export default Intro;
