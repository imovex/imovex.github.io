import React from "react";
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import './InnerCard.css';
import { BellFill } from "react-bootstrap-icons";

export function InnerCardMove({ taskTime, onConfirm, onReject }) 
{
    const isGamified = (localStorage.getItem('gamification') === "true");
    let cardClassName;
    if (isGamified) {
        cardClassName = "innerCardGamified standUpHeight";
    } else {
        cardClassName = "innerCard standUpHeight";
    }

    return (
    <Card className={cardClassName}> {/* Geöffnete Card*/}
        <Row className="rowInnerCard">
            <Col className="headerCol">
                <BellFill className="alertIcon"/>
                <Form.Label className="taskName">Move it!</Form.Label>
                <Form.Label className="taskTime">{taskTime}</Form.Label>
            </Col>
                <Form.Label className="taskDescription">Time for lunch! How about going outside for a walk?</Form.Label>
                <Button onClick={onConfirm} style={{ borderColor: "#7DF481"}}>Done</Button>
            <Col>
                <Button onClick={onReject} style={{ borderColor: "#FF3333"}}>No thanks</Button>
            </Col>
        </Row>
    </Card>
    );
}