import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import './Leaderboard.css';
import HeaderNavbar from "./components/HeaderNavbar.js";
import { getUserData, updateUser, getLeaderboard } from './api';
import { OuterCard } from "./components/OuterCard";

export default function Leaderboard() { 
    const savedWorkingTimes = localStorage.getItem('workingTimes');
    const [workingTimes, setWorkingTimes] = useState(
        savedWorkingTimes
            ? JSON.parse(savedWorkingTimes)
            : {
                startTime: '',
                breakStartTime: '',
                breakEndTime: '',
                endTime: ''
    });
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');    
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        userName: '',
        userId: '',
        points: 0
    })
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        async function getTopTen() {
            try {
                const response = await getLeaderboard();
                setLeaderboard(response);
                return response;
            } catch (error) {
                console.log(error)
            }
        }

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
            getTopTen();
        }
}, []);
    
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return
        }

        const userFound = leaderboard.find((user) => user.userId === userId)
        if (userFound && !userIsEmpty(userFound)) {
            setCurrentUser(userFound)
        }
    }, [username]);

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

    function userIsEmpty(user) {
        return user.userId === '' && user.userName === ''
    }

    function getLeaderboardUI () {
        const userId = localStorage.getItem('userId');

        return <div className="leaderboard">
            <h4>Leaderboard</h4>
            <p>Current Top Ten Performer</p>
            {
                leaderboard.map((user, index) =>
                    <OuterCard
                        left={index + 1 + ". " + user.userName}
                        right={user.points}
                        highlight={userId && userId === user.userId}
                    />
                )
            }
            {
                (currentUser && !userIsEmpty(currentUser)) ? <p>
                    You ({currentUser.userName})
                    have {currentUser.points} points.
                </p> : undefined
            }
        </div>
    }

    return (
        <div>
            <HeaderNavbar/>
            {getLeaderboardUI()}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>
                    <h4>Username</h4>                    
                    <Form.Text>Please note that your can only set your username once. Choose wisely.</Form.Text>
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
