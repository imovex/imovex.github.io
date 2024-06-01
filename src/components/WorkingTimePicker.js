import React, { useState, useEffect } from "react";
import { Form, Col } from 'react-bootstrap';
import { getUserData } from '../api';
import './WorkingTimePicker.css';
import './../Formular.css';

export function WorkingTimePicker({ onValidationChange, onWorkingTimesChange }) {
    const [workingTimes, setWorkingTimes] = useState({
        startTime: "",
        breakStartTime: "",
        breakEndTime: "",
        endTime: ""
    });
    
    const [error, setError] = useState({
        startTime: false,
        breakStartTime: false,
        breakEndTime: false,
        endTime: false
    });

    const [errorMessage, setErrorMessage] = useState({
        startTime: '',
        breakStartTime: '',
        breakEndTime: '',
        endTime: ''
    });
    
    useEffect(() => {
        async function fetchWorkingTimes() {
            try {
                const response = await getUserData();
                const dataBaseWorkingTimes = {
                    startTime: response.startTime,
                    breakStartTime: response.startBreakTime,
                    breakEndTime: response.endBreakTime,
                    endTime: response.endTime
                };
                setWorkingTimes(dataBaseWorkingTimes);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        // Nur aus DB holen, wenn überhaupt User vorhanden
        if (localStorage.getItem('userId') !== null) {
            fetchWorkingTimes();
        }
    }, []);
    
    const generateOptions = () => {
        let options = [];
        for (let hour = 4; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
                options.push(`${hourStr}:${minuteStr}`);
            }
        }
        return options;
    };

    function timeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const handleTimeChange = (event) => {
        const { name, value } = event.target;
        setWorkingTimes({ ...workingTimes, [name]: value });
    };

    useEffect(() => {
        const { startTime, breakStartTime, breakEndTime, endTime } = workingTimes;
        // Validierungslogik
        // Alle Zeiten gesetzt?
        if (startTime && breakStartTime && breakEndTime && endTime) {
            const start = timeStringToDate(startTime).getTime();
            const breakStart = timeStringToDate(breakStartTime).getTime();
            const breakEnd = timeStringToDate(breakEndTime).getTime();
            const end = timeStringToDate(endTime).getTime();

            if (!(start < breakStart && breakStart < breakEnd && breakEnd < end)) {          
                setErrorMessage({
                    startTime: 'Your working times are in the wrong order, they need to be chronologically increasing',
                    breakStartTime: '',
                    breakEndTime: '',
                    endTime: ''
                });
                setError({
                    startTime: true,
                    breakStartTime: true,
                    breakEndTime: true,
                    endTime: true
                });
            } else if (!((breakStart - start) >= 3600000)) {
                setErrorMessage({
                    startTime: 'There needs to be at least one hour between start time and break start time',
                    breakStartTime: 'There needs to be at least one hour between start time and break start time',
                    breakEndTime: '',
                    endTime: ''
                });
                setError({
                    startTime: true,
                    breakStartTime: true,
                    breakEndTime: false,
                    endTime: false
                });
            } else if (!((end - breakEnd) >= 3600000)) {
                setErrorMessage({
                    startTime: '',
                    breakStartTime: '',
                    breakEndTime: 'There needs to be at least one hour between end time and break end time',
                    endTime: 'There needs to be at least one hour between end time and break end time'
                });
                setError({
                    startTime: false,
                    breakStartTime: false,
                    breakEndTime: true,
                    endTime: true
                });
            } else {
                setErrorMessage({
                    startTime: '',
                    breakStartTime: '',
                    breakEndTime: '',
                    endTime: ''
                });
                setError({
                    startTime: false,
                    breakStartTime: false,
                    breakEndTime: false,
                    endTime: false
                });
            }
        }
    }, [workingTimes]);

    useEffect(() => {
        const isInvalid = Object.values(error).some(value => value);
        onValidationChange(!isInvalid);
        onWorkingTimesChange(workingTimes);
    }, [error]);

    return (
        <Col className="workingTimeCol">
            <Form.Label>I start working at</Form.Label>
            <Form.Control name="startTime" as="select" value={workingTimes.startTime} onChange={handleTimeChange} isInvalid={error.startTime}>
                <option disabled value="">Select your start time</option>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}
            </Form.Control>
            {error.startTime && <Form.Control.Feedback type="invalid">{errorMessage.startTime}</Form.Control.Feedback>}
            <Form.Label>I take a break from</Form.Label>
            <Form.Control name="breakStartTime" as="select" value={workingTimes.breakStartTime} onChange={handleTimeChange} isInvalid={error.breakStartTime}>
                <option disabled value="">Select your break start time</option>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}                
            </Form.Control>
            {error.breakStartTime && <Form.Control.Feedback type="invalid">{errorMessage.breakStartTime}</Form.Control.Feedback>}
            <Form.Label>to</Form.Label>
            <Form.Control name="breakEndTime" as="select" value={workingTimes.breakEndTime} onChange={handleTimeChange} isInvalid={error.breakEndTime}>
                <option disabled value="">Select your break end time</option>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}                
            </Form.Control>
            {error.breakEndTime && <Form.Control.Feedback type="invalid">{errorMessage.breakEndTime}</Form.Control.Feedback>}
            <Form.Label>I go home at</Form.Label>
            <Form.Control name="endTime" as="select" value={workingTimes.endTime} onChange={handleTimeChange} isInvalid={error.endTime}>
                <option disabled value="">Select your end time</option>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}
            </Form.Control>
            {error.endTime && <Form.Control.Feedback type="invalid">{errorMessage.endTime}</Form.Control.Feedback>}
        </Col>
    );
}
