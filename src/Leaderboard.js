import React, {useState, useEffect } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import './Leaderboard.css';
import { useWorkingTimes } from "./components/WorkingTimesContext";
import HeaderNavbar from "./components/HeaderNavbar.js";
import { getUserData } from './api';
import { updateUser } from './api';

export default function Leaderboard() { 
    const { workingTimes, setWorkingTimes } = useWorkingTimes();
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');    
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function checkUsername() {
            try {
                const response = await getUserData();
                setUsername(response.userName);
                setAge(response.age);
                setSex(response.sex);

                if ((response.userName === '') || (response.userName === null)) {
                    setShowModal(true); // Wenn kein Benutzername vorhanden, Modal zeigen
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        if (localStorage.getItem('userId') !== null) {
            checkUsername();
        }
    }, []);
    
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameSubmit = async () => {
        const userData = {
            gamification: (localStorage.getItem('gamification').toLowerCase() === "true"),
            startTime: workingTimes.startTime,
            endTime: workingTimes.endTime,
            startBreakTime: workingTimes.breakStartTime,
            endBreakTime: workingTimes.breakEndTime,
            age: Number(age),
            sex: sex,
            userName: username
        };
        
        try {
            const response = await updateUser(userData);            
            setErrorMessage('');         
            setShowModal(false); // Modal schließen

        } catch (error) {
            setErrorMessage('This username is already taken');
            console.error('Error updating username:', error);
        }
    };
    
    return (
        <div>
            <HeaderNavbar/>
            <Form.Label className="info-label">Leaderboard in progress</Form.Label>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter a unique username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errorMessage && <Form.Text className="error">{errorMessage}</Form.Text>}
                    <Button className='saveButton' onClick={handleUsernameSubmit}>Save</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}
