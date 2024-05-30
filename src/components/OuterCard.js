import React from "react";
import { Card, Col, Form } from 'react-bootstrap';
import './OuterCard.css';

export function OuterCard( { taskName, taskTime, buttonStatus} )
{
    const isGamified = (localStorage.getItem('gamification') === "true");
    let cardClassName;

    if (isGamified) {
        cardClassName = buttonStatus === "confirmed"
            ? "outerCardGamified Confirmed"
            : buttonStatus === "rejected"
            ? "outerCardGamified Rejected"
            : buttonStatus === "expired"
            ? "outerCardGamified Expired"
            : "outerCardGamified";        
    } else {
        cardClassName = buttonStatus === "confirmed"
            ? "outerCard Confirmed"
            : buttonStatus === "rejected"
            ? "outerCard Rejected"
            : buttonStatus === "expired"
            ? "outerCard Expired"
            : "outerCard";
    }
    
    return (
        <Card className={cardClassName}>
            <Col>
                <Form.Label className="taskName">{taskName}</Form.Label>
                <Form.Label className="taskTime">{taskTime}</Form.Label>
            </Col>
        </Card>
    );
}