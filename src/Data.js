import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { Col, Row, Form, Button, Image } from 'react-bootstrap';
import './Data.css';
import './Formular.css';
import './Header.css';
import { WorkingTimePicker } from "./components/WorkingTimePicker";
import { postUserData } from './api';
import { getPublicKey } from './api';

export default function Data() {
    const navigate = useNavigate();
    const [workingTimes, setWorkingTimes] = useState({
        startTime: "",
        breakStartTime: "",
        breakEndTime: "",
        endTime: ""
    });
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');    
    const [ageError, setAgeError] = useState(true);
    const [ageErrorMessage, setAgeErrorMessage] = useState('Required');
    const [isValid, setIsValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [inovex, setInovex] = useState(true);
    const [addInfo, setAddInfo] = useState('');

    useEffect(() => {
        
        if (((age <= 80) && (age >= 15)) && sex) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [age, sex]);

    useEffect(() => {
        setWorkingTimes(workingTimes);
    }, [workingTimes]);

    const handleAgeChange = (event) => {
        const inputAge = event.target.value;
        if ((inputAge >= 15) && (inputAge <= 80)) {
            setAge(inputAge);
            setAgeError(false);          
            setAgeErrorMessage('');
        } else if (inputAge > 80) {
            setAge(event.target.value);
            setAgeError(true);     
            setAgeErrorMessage('Have you ever thought about retirement yet?');
        } else if ((inputAge < 15) && (inputAge > 0)) {
            setAge(event.target.value);
            setAgeError(true);     
            setAgeErrorMessage("Don't you want to enjoy your childhood a little longer?");
        } else {
            setAge(event.target.value);
            setAgeError(true);
            setAgeErrorMessage("Required");
        }
    };

    const handleSexChange = (event) => {
        setSex(event.target.value);
    };

    const handlePostUserData = async () => {
        let formattedSex = sex.toUpperCase();

        if (formattedSex === "NO ANSWER") {
            formattedSex = "NO_ANSWER"; 
        }
        const userData = {
            inovex: inovex,
            startTime: workingTimes.startTime,
            endTime: workingTimes.endTime,
            startBreakTime: workingTimes.breakStartTime,
            endBreakTime: workingTimes.breakEndTime,
            age: Number(age),
            sex: formattedSex,
            voluntaryData: addInfo,
        };
        try {
            localStorage.setItem('workingTimes',JSON.stringify(workingTimes));

            const response = await postUserData(userData);

            // Speichern im Local Storage
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('gamification', response.gamification);

            navigate('/schedule')

            // Push-Benachrichtigungen zugelassen?
            if (Notification.permission !== 'granted') {
                // Push-Benachrichtigungen zulassen?
                Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Push-Benachrichtigungen zugelassen');
                }
                });
            }
            const API_BASE_URL = 'https://sschulz.fra.ics.inovex.io';      

            const publicVapidKey = await getPublicKey();
            const urlBase64ToUint8Array = (base64String) => {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);

                for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            };                
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
            });
            const obj = new Object();
            obj.userId = localStorage.getItem('userId');
            obj.endpoint = subscription.endpoint;
            obj.publicKey = subscription.toJSON().keys.p256dh;
            obj.auth = subscription.toJSON().keys.auth;

            const responseSubscribe = await fetch(`${API_BASE_URL}/api/subscribe`, {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'content-type': 'application/json',
                },
            });

        } catch (error) {
            console.error('Error posting user data:', error);
        }
    };

    const handleValidationChange = (isValid) => {        
        setIsFormValid(isValid);
    };

    const handleWorkingTimesChange = (validatedWorkingTimes) => {
        setWorkingTimes(validatedWorkingTimes);
    };

    const handleCheckboxChange = (e) => {
        setInovex(e.target.checked);
    };

    const handleAddInfo = (e) => {
        setAddInfo(e.target.value);
    };

    return (
        <div>
            <Col className="input-col">
                <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                <Form.Label className="info-label">Let's get started by checking your working day routine. The application will generate an individual schedule based on your working times. They can still be edited. </Form.Label>
                <Row className="info-row">
                    <Col className="input-col">
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                            as="input" 
                            type="number"
                            min={0}
                            placeholder="Enter your age" 
                            className="select-data"
                            value={age}
                            onChange={handleAgeChange}
                            isInvalid={ageError}
                        />                        
                        {ageErrorMessage && <Form.Control.Feedback type="invalid">{ageErrorMessage}</Form.Control.Feedback>}
                        <Form.Label>Sex</Form.Label>
                        <Form.Control 
                            as="select" 
                            className="select-data"
                            value={sex}
                            onChange={handleSexChange}
                            isInvalid={!sex}
                        >
                            <option disabled value="">Select your sex</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Diverse</option>
                            <option>No answer</option>
                        </Form.Control>
                        {!sex && <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>}
                        <Col className="inovex-col">
                            <Form.Label>I work at inovex</Form.Label>
                            <Form.Check 
                                type="checkbox"
                                checked={inovex}
                                onChange={handleCheckboxChange}
                            />
                        </Col>
                        <Form.Label>Additional voluntary information</Form.Label>
                        <Form.Control 
                            className="additional-info"
                            as="textarea"
                            value={addInfo}
                            placeholder="You can enter anything additional about yourself for example the company you work at or your job title"
                            onChange={handleAddInfo} 
                            maxLength={500}
                            />
                            <div>{500 - addInfo.length} characters remaining</div>
                    </Col>
                    <WorkingTimePicker onWorkingTimesChange={handleWorkingTimesChange} onValidationChange={handleValidationChange}/>
                </Row>
                {(isValid && isFormValid) ? (
                    <Button onClick={handlePostUserData}>Let's go!</Button>
                    ) : (
                        <Button disabled>Let's go!</Button>
                    )}
            </Col>
        </div>
    );
}

