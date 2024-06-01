import React from "react";
import { Card, Col, Form } from 'react-bootstrap';
import './OuterCard.css';

export function OuterCard( { left, right, buttonStatus = "", highlight = false } )
{
    return (
        <Card className={"outerCard " + buttonStatus + (highlight ? ' highlight' : '')}>
            <Col>
                <Form.Label className="taskName">{left}</Form.Label>
                <Form.Label className="taskTime">{right}</Form.Label>
            </Col>
        </Card>
    );
}
