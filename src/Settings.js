import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Gear } from 'react-bootstrap-icons';
import './Settings.css';
import { WorkingTimePicker } from "./components/WorkingTimePicker.js";
import { useWorkingTimes } from "./components/WorkingTimesContext";
import HeaderNavbar from './components/HeaderNavbar';
import HeaderNavbarGamified from './components/HeaderNavbarGamified';
import { updateUser } from './api';
import { getUserData } from './api';

export default function Settings() {
    const [workingTimes, setWorkingTimes] = useState({
        startTime: "",
        breakStartTime: "",
        breakEndTime: "",
        endTime: ""
    });
    const [showNotification, setShowNotification] = useState(false);
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [username, setUsername] = useState('');    
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getUserData();

                const dataBaseWorkingTimes = {
                    startTime: response.startTime,
                    breakStartTime: response.startBreakTime,
                    breakEndTime: response.endBreakTime,
                    endTime: response.endTime
                };
                setWorkingTimes(dataBaseWorkingTimes);
                setAge(response.age);
                setSex(response.sex);
                setUsername(response.userName);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        if (localStorage.getItem('userId') !== null) {
            fetchUserData();
        }
    }, []);

    const handleSave = async () => {
        const userData = {
            gamification: (localStorage.getItem('gamification').toLowerCase() === "true"),
            startTime: workingTimes.startTime,
            endTime: workingTimes.endTime,
            startBreakTime: workingTimes.breakStartTime,
            endBreakTime: workingTimes.breakEndTime,
            age: age,
            sex: sex,
            userName: username
        };

        try {
            const response = await updateUser(userData);
            if (response) {
                console.log('successfully saved new workingTimes');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };
    const handleValidationChange = (isValid) => {
        setIsValid(isValid);
    };

    return(
        <div>        
            {(localStorage.getItem('gamification') === "true") ? <HeaderNavbarGamified /> : <HeaderNavbar />}
            <Col className="settingsCol">
                <Col className="titleCol">
                    <Form.Label>Settings</Form.Label>
                    <Gear className="settingsGear"/>                    
                </Col>                 
                <Form.Label className="settingsSubtitle">Adjust your working times:</Form.Label>
                <Col className="inputCol">
                    <WorkingTimePicker onValidationChange={handleValidationChange}/>
                    {isValid ? (
                    <Link to="/thankyou">                        
                        <Button onClick={handleSave} style={{ borderColor: "#7DF481"}}>Save</Button>
                    </Link>
                    ) : (
                        <Button disabled>Save</Button>
                    )}
                </Col>                
            </Col>
            <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                <Modal.Body>Your new working times have been saved. They will be applied on your schedule by tomorrow. Click on the iMOVEx Logo to get back to your schedule.</Modal.Body>
            </Modal>
        </div>
    );
}
