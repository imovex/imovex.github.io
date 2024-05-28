import React from "react";
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import './InnerCard.css';
import { BellFill } from "react-bootstrap-icons";

export function InnerCardStandUp({ taskTime, onConfirm, onReject }) 
{
    return (
    <Card className="innerCard standUpHeight"> {/* Geöffnete Card*/}
        <Row className="rowInnerCard">
            <Col className="headerCol">
                <BellFill className="alertIcon"/>
                <Form.Label className="taskName">Stand up!</Form.Label>
                <Form.Label className="taskTime">{taskTime}</Form.Label>
            </Col>
            <Form.Label className="taskDescription">Time to stand up! How about adjusting your desk height?</Form.Label>
            <Button onClick={onConfirm} style={{ borderColor: "#7DF481"}}>Done</Button>
            <Button onClick={onReject} style={{ borderColor: "#FF3333"}}>No thanks</Button>
        </Row>
    </Card>
    );
}