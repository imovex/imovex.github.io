import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import './Settings.css';
import { WorkingTimePicker } from "./components/WorkingTimePicker.js";
import HeaderNavbar from './components/HeaderNavbar';
import { updateUser } from './api';
import { getUserData } from './api';

export default function Settings() {
    const [workingTimes, setWorkingTimes ] = useState();
    const [showNotification, setShowNotification] = useState(false);    
    const [isFormValid, setIsFormValid] = useState(false);
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        setWorkingTimes(workingTimes)
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
        localStorage.setItem('workingTimes',JSON.stringify(workingTimes));

        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    const handleValidationChange = (isValid) => {        
        setIsFormValid(isValid);
    };

    const handleWorkingTimesChange = (validatedWorkingTimes) => {
        setWorkingTimes(validatedWorkingTimes);
    };

    return(
        <div>        
            <HeaderNavbar />
            <Col className="settingsCol">
                <h5>Settings</h5>      
                <Form.Label className="settingsSubtitle">Adjust your working times:</Form.Label>
                <Col className="inputCol">
                    <WorkingTimePicker onWorkingTimesChange={handleWorkingTimesChange} onValidationChange={handleValidationChange}/>
                    <Button disabled={!isFormValid} onClick={handleSave} style={{ borderColor: "#7DF481"}}>Save</Button>
                </Col>                
            </Col>
            <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                <Modal.Body>Your new working times have been saved. Click on the iMOVEx Logo to get back to your schedule.</Modal.Body>
            </Modal>
        </div>
    );
}
