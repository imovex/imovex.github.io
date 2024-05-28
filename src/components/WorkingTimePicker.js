import React, { useState } from "react";
import { Form, Col } from 'react-bootstrap';
import { useWorkingTimes } from "./WorkingTimesContext";
import './WorkingTimePicker.css';

export function WorkingTimePicker() {      
    const { workingTimes, setWorkingTimes } = useWorkingTimes();
    
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

    const [errorMessage, setErrorMessage] = useState({
        startTime: "",
        breakStartTime: "",
        breakEndTime: "",
        endTime: ""
    });

    function timeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        if ((timeStringToDate(workingTimes.breakStartTime) - timeStringToDate(newStartTime)) < 3600000) {
            setErrorMessage({ ...errorMessage, startTime: "There should be at least one hour between your start time and the start time of your break." });
        } else if (newStartTime < workingTimes.breakStartTime && workingTimes.breakStartTime < workingTimes.breakEndTime && workingTimes.breakEndTime < workingTimes.endTime) {
            const newWorkingTimes = { ...workingTimes, startTime: newStartTime };
            setWorkingTimes(newWorkingTimes);
            setErrorMessage({ ...errorMessage, startTime: "" });
        }else {
            setErrorMessage({ ...errorMessage, startTime: "Your start time needs to be earlier than the start time of your break." });
        }        
    };

    const handleBreakStartTimeChange = (e) => {
        const newBreakStartTime = e.target.value;
        if ((timeStringToDate(newBreakStartTime) - timeStringToDate(workingTimes.startTime)) < 3600000) {
            setErrorMessage({ ...errorMessage, breakStartTime: "There should be at least one hour between your start time and the start time of your break." });
        } else if (workingTimes.startTime < newBreakStartTime && newBreakStartTime < workingTimes.breakEndTime && workingTimes.breakEndTime < workingTimes.endTime) {
            const newWorkingTimes = { ...workingTimes, breakStartTime: newBreakStartTime };
            setWorkingTimes(newWorkingTimes);
            setErrorMessage({ ...errorMessage, breakStartTime: "" });
        } else {
            setErrorMessage({ ...errorMessage, breakStartTime: "The start time of your break needs to be earlier than the end time of your break." });
        }
    };
    
    const handleBreakEndTimeChange = (e) => {
        const newBreakEndTime = e.target.value;
        if ((timeStringToDate(workingTimes.endTime) - timeStringToDate(newBreakEndTime)) < 3600000) {
            setErrorMessage({ ...errorMessage, breakEndTime: "There should be at least one hour between the end time of your break and your end time." });
        } else if (workingTimes.startTime < workingTimes.breakStartTime && workingTimes.breakStartTime < newBreakEndTime && newBreakEndTime < workingTimes.endTime) {
            const newWorkingTimes = { ...workingTimes, breakEndTime: newBreakEndTime };
            setWorkingTimes(newWorkingTimes);
            setErrorMessage({ ...errorMessage, breakEndTime: "" });
        } else {
            setErrorMessage({ ...errorMessage, breakEndTime: "The end time of your break needs to be earlier than the end time." });
        }
    };
    
    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        if ((timeStringToDate(newEndTime) - timeStringToDate(workingTimes.breakEndTime)) < 3600000) {
            setErrorMessage({ ...errorMessage, endTime: "There should be at least one hour between the end time of your break and your end time." });
        } else if (workingTimes.startTime < workingTimes.breakStartTime && workingTimes.breakStartTime < workingTimes.breakEndTime && workingTimes.breakEndTime < newEndTime) {
            const newWorkingTimes = { ...workingTimes, endTime: newEndTime };
            setWorkingTimes(newWorkingTimes);
            setErrorMessage({ ...errorMessage, endTime: "" });
        } else {
            setErrorMessage({ ...errorMessage, endTime: "Your end time needs to be later than the end time of your break." });
        }
    };

    return (
        <Col className="workingTimeCol">
            <Form.Label>I start working at</Form.Label>
            <Form.Control as="select" value={workingTimes.startTime} onChange={handleStartTimeChange}>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}
            </Form.Control>
            {errorMessage.startTime && <Form.Text className="error">{errorMessage.startTime}</Form.Text>}
            <Form.Label>I take a break from</Form.Label>
            <Form.Control as="select" value={workingTimes.breakStartTime} onChange={handleBreakStartTimeChange}>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}                
            </Form.Control>
            {errorMessage.breakStartTime && <Form.Text className="error">{errorMessage.breakStartTime}</Form.Text>}
            <Form.Label>to</Form.Label>
            <Form.Control as="select" value={workingTimes.breakEndTime} onChange={handleBreakEndTimeChange}>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}                
            </Form.Control>
            {errorMessage.breakEndTime && <Form.Text className="error">{errorMessage.breakEndTime}</Form.Text>}
            <Form.Label>I go home at</Form.Label>
            <Form.Control as="select" value={workingTimes.endTime} onChange={handleEndTimeChange}>
                {generateOptions().map((time, index) => (
                    <option key={index}>{time}</option>
                ))}
            </Form.Control>
            {errorMessage.endTime && <Form.Text className="error">{errorMessage.endTime}</Form.Text>}
        </Col>
    );
}