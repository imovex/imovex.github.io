import React from "react";
import { Card, Col, Form } from 'react-bootstrap';
import './OuterCard.css';

export function OuterCard( { taskName, taskTime, buttonStatus} )
{
    return (
        <Card className={"outerCard " + buttonStatus}>
            <Col>
                <Form.Label className="taskName">{taskName}</Form.Label>
                <Form.Label className="taskTime">{taskTime}</Form.Label>
            </Col>
        </Card>
    );
}
