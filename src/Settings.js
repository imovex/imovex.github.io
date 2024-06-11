import React, { useState, useEffect } from "react";
import { Button, Col, Modal } from 'react-bootstrap';
import './Settings.css';
import { WorkingTimePicker } from "./components/WorkingTimePicker.js";
import HeaderNavbar from './components/HeaderNavbar';
import { updateUser } from './api';
import { getUserData } from './api';

export default function Settings() {
    const [workingTimes, setWorkingTimes ] = useState();
    const [showNotification, setShowNotification] = useState(false);    
    const [showWarning, setShowWarning] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [inovex, setInovex] = useState(true);
    const [username, setUsername] = useState('');
    const [addInfo, setAddInfo] = useState('');

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
                setInovex(response.inovex);
                setUsername(response.userName);
                setAddInfo(response.voluntaryData);
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
            inovex: inovex,
            startTime: workingTimes.startTime,
            endTime: workingTimes.endTime,
            startBreakTime: workingTimes.breakStartTime,
            endBreakTime: workingTimes.breakEndTime,
            age: age,
            sex: sex,
            userName: username,
            voluntaryData: addInfo, 
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
    
    const handleWarningClick = () => {        
        setShowWarning(false);
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
                <h6 className="settingsSubtitle">Adjust your working times:</h6>
                    <WorkingTimePicker onWorkingTimesChange={handleWorkingTimesChange} onValidationChange={handleValidationChange}/>
                <Button disabled={!isFormValid} onClick={handleSave} style={{ borderColor: "#7DF481"}}>Save</Button>           
            </Col>
            <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                <Modal.Body>Your new working times have been saved. Click on the iMOVEx Logo to get back to your schedule.</Modal.Body>
            </Modal>
            <Modal className="warning" show={showWarning} onHide={() => setShowWarning(false)} centered>
                <Modal.Body>                    
                    <Col className="settingsCol">
                        <h4>Warning</h4>                    
                        <h6>Be careful with changing your working times. The changes apply immediately but will only change the time of your remaining tasks. If you reschedule to an earlier working day some tasks may expire before you get the chance to complete them.</h6>
                        <Button onClick={handleWarningClick}>Understood</Button>
                    </Col>
                </Modal.Body>
            </Modal>
        </div>
    );
}
