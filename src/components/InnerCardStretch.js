import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Image } from 'react-bootstrap';
import './InnerCard.css';
import { BellFill } from "react-bootstrap-icons";

export function InnerCardStretch({ taskTime, onConfirm, onReject }) 
{
    const [checkboxes, setCheckboxes] = useState([false, false, false]); 
    const [imageIndexes, setImageIndexes] = useState([]);

    useEffect(() => {
        // Funktion, um drei eindeutige Zufallszahlen zu generieren
        const generateUniqueRandomIndexes = () => {
            const indexes = new Set();
            while (indexes.size < 3) {
                const randomIndex = Math.floor(Math.random() * 25) + 1; // 1 bis 25
                indexes.add(randomIndex);
            }
            return Array.from(indexes);
        };

        setImageIndexes(generateUniqueRandomIndexes());
    }, []);

    const handleCheckboxChange = (index) => {
        const newCheckboxes = [...checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setCheckboxes(newCheckboxes);

        // Überprüfe, ob alle Checkboxen gecheckt sind, und rufe onConfirm auf
        if (newCheckboxes.every(checkbox => checkbox)) {
            onConfirm();
        }
    };

    return (
    <Card className="innerCard"> {/* Geöffnete Card*/}
        <Row className="rowInnerCard">
            <Col className="headerCol">
                <BellFill className="alertIcon"/>
                <Form.Label className="taskName">Stretch it!</Form.Label>
                <Form.Label className="taskTime">{taskTime}</Form.Label>
            </Col>                        
            <Form.Label className="taskDescription">Time to mobilize muscles!</Form.Label>
            <Row className="checkboxRow">
                <Col className="stretchCheckboxes">
                    <Form.Check
                        checked={checkboxes[0]}
                        onChange={() => handleCheckboxChange(0)}
                    />
                    <Form.Check
                        checked={checkboxes[1]}
                        onChange={() => handleCheckboxChange(1)}
                    />
                    <Form.Check
                        checked={checkboxes[2]}
                        onChange={() => handleCheckboxChange(2)}
                    />
                </Col>
                <Col className="stretchImages">
                    {imageIndexes.map(index => (
                        <Image key={index} src={`${process.env.PUBLIC_URL}/exercises/exercise${index}.png`} />
                    ))}
                </Col>
            </Row>
            <Button onClick={onReject} style={{ borderColor: "#FF3333"}}>No thanks</Button>
        </Row>
    </Card>
    );
}