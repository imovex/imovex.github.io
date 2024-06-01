import React, {useState, useEffect } from "react";
import {Button, Modal, Form} from 'react-bootstrap';
import './Leaderboard.css';
import { useWorkingTimes } from "./components/WorkingTimesContext";
import HeaderNavbar from "./components/HeaderNavbar.js";
import { getUserData, updateUser } from './api';
import {OuterCard} from "./components/OuterCard";

export default function Leaderboard() { 
    const { workingTimes } = useWorkingTimes();
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');    
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        userName: '',
        userId: '',
        points: 0
    })
    const [leaderboard] = useState(
        [
            {
                userId: "id",
                userName: "finny",
                points: 100
            },
            {
                userId: "c7967a71-6b9b-453a-bce5-fb3373d5ee5a",
                userName: "ninchen",
                points: 99
            },
            {
                userId: "id",
                userName: "quappe",
                points: 98
            },
            {
                userId: "id",
                userName: "prili",
                points: 97
            }
    ])

    useEffect(() => {
        async function getTopTen() {
            try {
                return await getLeaderboard()
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
        }
        // setLeaderboard(getTopTen()) TODO einkommentieren quappe
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

    function getLeaderboard () {
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
            {getLeaderboard()}
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
