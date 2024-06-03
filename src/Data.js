import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Col, Row, Form, Button, Image } from 'react-bootstrap';
import './Data.css';
import './Formular.css';
import './Header.css';
import { WorkingTimePicker } from "./components/WorkingTimePicker";
import { postUserData } from './api';
import { getPublicKey } from './api';

export default function Data() {    
    const [workingTimes, setWorkingTimes] = useState({
        startTime: "",
        breakStartTime: "",
        breakEndTime: "",
        endTime: ""
    });
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

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
            setErrorMessage('');
        } else if (inputAge > 80) {
            setAge(event.target.value);
            setErrorMessage('Have you ever thought about retirement yet?');
        } else if ((inputAge < 15) && (inputAge > 0)) {
            setAge(event.target.value);
            setErrorMessage("Don't you want to enjoy your childhood a little longer?");
        } else {
            setAge(event.target.value);
            setErrorMessage('Please enter a positive number as your age');
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
            startTime: workingTimes.startTime,
            endTime: workingTimes.endTime,
            startBreakTime: workingTimes.breakStartTime,
            endBreakTime: workingTimes.breakEndTime,
            age: Number(age),
            sex: formattedSex,
        };
        try {
            localStorage.setItem('workingTimes',JSON.stringify(workingTimes));

            const response = await postUserData(userData);

            // Speichern im Local Storage
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('gamification', response.gamification);

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

    return (
        <div>
            <Col className="input-col">
                <Image className="welcome" src={`${process.env.PUBLIC_URL}/Welcome_iMOVEx.png`}/>
                <Row className="info-row">
                    <Col className="input-col">
                        <Form.Label className="info-label">Let's start by setting up your average working day. Please note that you can only set your working times once to keep the collected data consistent.</Form.Label>
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                            as="input" 
                            type="number"
                            min={0}
                            placeholder="Enter your age" 
                            className="select-data"
                            value={age}
                            onChange={handleAgeChange}
                        />
                        <Form.Text className="error">{errorMessage}</Form.Text>
                        <Form.Label>Sex</Form.Label>
                        <Form.Control 
                            as="select" 
                            className="select-data"
                            value={sex}
                            onChange={handleSexChange}
                        >
                            <option disabled value="">Select your sex</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Diverse</option>
                            <option>No answer</option>
                        </Form.Control> 
                    </Col>
                    <WorkingTimePicker onWorkingTimesChange={handleWorkingTimesChange} onValidationChange={handleValidationChange}/>
                </Row>
                {(isValid && isFormValid) ? (
                    <Link to="/schedule">
                        <Button onClick={handlePostUserData}>Let's go!</Button>
                    </Link>
                    ) : (
                        <Button disabled>Let's go!</Button>
                    )}
            </Col>
        </div>
    );
}

