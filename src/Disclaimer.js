import React, { useState } from "react";
import { Col, Row, Form, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Disclaimer.css';
import './Header.css';

function Disclaimer() {
    const [isChecked, setIsChecked] = useState(false);
    const handleButtonClick = () => {
       
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    return (
        <div>
            <Row className="disclaimer-row">
                <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                <p className="info-text">
                    Please note that this application will collect data about your performance and behaviour. 
                    This is solely for research purposes as part of the underlying master's thesis. 
                    You must agree to this in order to use the application.
                </p>
                <Form.Check 
                    type="checkbox"
                    label="I agree"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <Col className="button-col">
                    {isChecked ? (
                        <Link to="/data">
                            <Button className="ok-button" onClick={handleButtonClick}>Get started</Button>
                        </Link>
                    ) : (
                        <Button className="ok-button" disabled>Get started</Button>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default Disclaimer;
