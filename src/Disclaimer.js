import React, { useState } from "react";
import { Col, Row, Form, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
                    Please note that this application will collect
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            <Tooltip id="data-tooltip">
                                imovex.github.io is observed by Google Analytics to get statistics 
                                about the usage of the application. During the working day the activities 
                                of a user will be logged into a PostgreSQL database for the following analysis.
                                The entered user data will be treated confidentially and will only be used for 
                                the research in scope of this master's thesis.
                            </Tooltip>
                        }
                    >
                        <span style={{fontWeight: "bold"}} className="data-word"> data </span>
                    </OverlayTrigger>
                    about your performance and behaviour. Hover over data for more information.
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
