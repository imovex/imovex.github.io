import React, {useState, useEffect, useRef } from "react";
import { Col, Form, ProgressBar } from 'react-bootstrap';
import './ScheduleGamified.css';
import { InnerCardStandUp } from "./components/InnerCardStandUp.js";
import { InnerCardStretch } from "./components/InnerCardStretch.js";
import { InnerCardMove } from "./components/InnerCardMove.js";
import { OuterCard } from "./components/OuterCard.js";
import { useWorkingTimes } from "./components/WorkingTimesContext";
import HeaderNavbarGamified from "./components/HeaderNavbarGamified.js";
import { getUserData } from './api';
import { postLogData } from './api';

export default function ScheduleGamified() {    
    const { workingTimes, setWorkingTimes } = useWorkingTimes();

    // const initialSchedule = [
    //         { name: 'Stand up', time: '17:19', buttonStatus: null },
    //         { name: 'Stretch', time: '17:20', buttonStatus: null },
    //         { name: 'Stand up', time: '17:21', buttonStatus: null },
    //         { name: 'Move', time: '17:22', buttonStatus: null },
    //         { name: 'Stand up', time: '17:47', buttonStatus: null },
    //         { name: 'Stretch', time: '17:48', buttonStatus: null },
    //         { name: 'Stand up', time: '17:49', buttonStatus: null },
    // ];

    useEffect(() => {
        async function fetchWorkingTimes() {
            try {
                const response = await getUserData();
                
                const savedDate = new Date(localStorage.getItem('lastDate'));
                const currentDate = new Date();
                if (savedDate.getDate() === currentDate.getDate() && savedDate.getMonth() === currentDate.getMonth() && savedDate.getFullYear() === currentDate.getFullYear()) {
                    // Arbeitszeiten nur aus DB setzen, wenn neuer Tag, damit Schedule nicht manipulierbar
                    return;
                }

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

        if (localStorage.getItem('userId') !== null) {
            fetchWorkingTimes();
        }
    }, []);
    
    const initialSchedule = [];

    const morningBlockTime = (((timeStringToDate(workingTimes.breakStartTime) - timeStringToDate(workingTimes.startTime))/ 1000) / 60 ) / 4;
    const afternoonBlockTime = (((timeStringToDate(workingTimes.endTime) - timeStringToDate(workingTimes.breakEndTime))/ 1000) / 60 ) / 4;

    const calculateTime = (baseTime, minutesToAdd) => {
        const [baseHour, baseMinute] = baseTime.split(':').map(Number);
        let totalMinutes = baseHour * 60 + baseMinute + minutesToAdd;    
        // Auf die nächste Viertelstunde aufrunden
        totalMinutes = Math.ceil(totalMinutes / 15) * 15;    
        const newHour = Math.floor(totalMinutes / 60) % 24;
        const newMinute = totalMinutes % 60;
        return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    };

    function addActivity(name, startTime, buttonStatus) {
        initialSchedule.push({
            name: name,
            time: startTime,
            buttonStatus: buttonStatus
        });
    }
    addActivity('Stand up', calculateTime(workingTimes.startTime, morningBlockTime), null);
    addActivity('Stretch', calculateTime(workingTimes.startTime, morningBlockTime * 2), null);
    addActivity('Stand up', calculateTime(workingTimes.startTime, morningBlockTime * 3), null);
    addActivity('Move', workingTimes.breakStartTime, null);
    addActivity('Stand up', calculateTime(workingTimes.breakEndTime, afternoonBlockTime), null);
    addActivity('Stretch', calculateTime(workingTimes.breakEndTime, afternoonBlockTime * 2), null);
    addActivity('Stand up', calculateTime(workingTimes.breakEndTime, afternoonBlockTime * 3), null);
    
    function timeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const logTaskData = async (currentTask) => {
        let formattedTask = currentTask.name.toUpperCase();

        if (formattedTask === "STAND UP") {
            formattedTask = "STAND_UP"; 
        }
        const logData = {
            userId: localStorage.getItem('userId'),
            task: formattedTask,
            status: currentTask.time
        };

        try {
            const response = await postLogData(logData);
            console.log('task logged');
        } catch (error) {
            console.error('Error logging task data:', error);
        }
    }

    const schedule = useRef(initialSchedule);    
    const [trigger, setTrigger] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    const [currentEvent, setCurrentEvent] = useState(() => {
        setCurrentTime(new Date());
        const savedDate = localStorage.getItem('lastDate');

        // Reset an neuem Tag
        if (savedDate) {
            const lastDate = new Date(savedDate);
            if (currentTime.getDate() !== lastDate.getDate() || currentTime.getMonth() !== lastDate.getMonth() || currentTime.getFullYear() !== lastDate.getFullYear()) {
                // Neuer Tag, Local Storage zurücksetzen
                localStorage.removeItem('schedule');
            }
        }
        localStorage.setItem('lastDate', currentTime);

        // let temp = new Date();
        // temp.setHours(14,29,0,0);
        const currentIndex = schedule.current.findLastIndex(task => 
            timeStringToDate(task.time).getTime() <= currentTime.getTime() && 
            // timeStringToDate(task.time).getTime() <= temp.getTime() && 
            task.buttonStatus !== 'rejected' && 
            task.buttonStatus !== 'confirmed'
        );
        const savedSchedule = localStorage.getItem('schedule');
        if (savedSchedule) {
            schedule.current = JSON.parse(savedSchedule);
        } else {
            schedule.current = initialSchedule;
        }
        // Wenn Arbeitstag bereits begonnen, verpasste Tasks auf EXPIRED
        const updatedSchedule = schedule.current.map((task, index) => {
            if (index < currentIndex && task.buttonStatus !== 'confirmed' && task.buttonStatus !== 'rejected') {
                return { ...task, time: 'EXPIRED', buttonStatus: 'expired' };
            }
            return task;
        });
        schedule.current = updatedSchedule;
        return currentIndex;
    });

    const [nextEvent, setNextEvent] = useState(currentEvent + 1); 
    let timeoutID = null;
        
    useEffect(() => {
        startTimerNextEvent();
    }, [currentEvent]);

    const handleTimeoutExpired = async () => {
        // if (nextEvent < schedule.current.length){
        //     if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.ready.then(registration => {
        //         registration.showNotification('iMOVEx', {
        //             body: 'Time for an activity!',
        //             icon: 'iMOVExLogo.ico',
        //         });
        //     });
        // }}
        if (currentEvent !== -1) {
            const updatedSchedule = [...schedule.current];
            if (updatedSchedule[currentEvent].buttonStatus !== 'confirmed' && updatedSchedule[currentEvent].buttonStatus !== 'rejected') {
                updatedSchedule[currentEvent] = { ...updatedSchedule[currentEvent], time: 'EXPIRED', buttonStatus: 'expired' };
            }
            localStorage.setItem('schedule', JSON.stringify(schedule.current));
            schedule.current = updatedSchedule;
        }
        if (schedule.current[currentEvent].time !== 'EXPIRED') {
            logTaskData(schedule.current[currentEvent]);
        }
        setCurrentEvent(nextEvent);        
        setNextEvent(nextEvent + 1);
        console.log("Timeout");
    };

    function startTimerNextEvent() {     
        if (timeoutID) {
            clearTimeout(timeoutID);
        }   
        setTrigger(true); // Neu rendern
        if (nextEvent < schedule.current.length) {
            const startTime = new Date().getTime();
            // const startTime = timeStringToDate(schedule.current[currentEvent].time).getTime();
            const endTime = timeStringToDate(schedule.current[nextEvent].time).getTime();
            const delay = endTime - startTime;
            
            if (schedule.current[currentEvent].time !== ('DONE' || 'DECLINED' || 'EXPIRED')) { 
                timeoutID = setTimeout(handleTimeoutExpired, delay);
            }
            console.log('Timer started until', schedule.current[nextEvent].time);
            return () => clearTimeout(timeoutID);

        } else if (nextEvent === schedule.current.length) {
            console.log('Out of range - Kein nächstes Event zum Timer berechnen');
            const currentTime = new Date().getTime();
            const eventTime = timeStringToDate(schedule.current[currentEvent].time).getTime();
            
            let delay;
            if ((eventTime + 3600000) < currentTime ) {
                console.log('Current time is later than event time plus 1 hour');
                delay = 0; // Direkt EXPIRED
            } else {
                delay = 3600000; // Timer auf 1h
            }        
            timeoutID = setTimeout(handleTimeoutExpired, delay);
            console.log('Timer started for last task');
            return () => clearTimeout(timeoutID);  
        }
        else {
            console.log('Letztes Event abgelaufen');
        }
    }

    const handleConfirm = () => {          
        schedule.current[currentEvent] = {...schedule.current[currentEvent], time: 'DONE', buttonStatus: 'confirmed' };
        localStorage.setItem('schedule', JSON.stringify(schedule.current));
        setTrigger(false); // Neu rendern
        console.log('DONE - Task wurde abgeschlossen');
    };
    
    const handleReject = () => {
        schedule.current[currentEvent] = {...schedule.current[currentEvent], time: 'DECLINED', buttonStatus: 'rejected' };
        localStorage.setItem('schedule', JSON.stringify(schedule.current));
        setTrigger(false); // Neu rendern
        console.log('DECLINED - Task wurde abgelehnt');     
    };

    return (
        <div>
            <HeaderNavbarGamified/>
            {/* <Col className="progressCol">
                <ProgressBar/>
            </Col> */}
            <Col className="scheduleCol">
                <Form.Label className="scheduleTitle">Today</Form.Label>
                {schedule.current.map((task, index) => {
                    let InnerCardComponent;
                    switch (task.name) {
                        case 'Stand up':
                            InnerCardComponent = InnerCardStandUp;
                            break;
                        case 'Stretch':
                            InnerCardComponent = InnerCardStretch;
                            break;
                        case 'Move':
                            InnerCardComponent = InnerCardMove;
                            break;
                        default:
                            // Kein passender Task gefunden
                            InnerCardComponent = null;
                            break;
                    }

                    return (
                        <React.Fragment key={index}>
                            {InnerCardComponent ? (
                                index === currentEvent ? (
                                    <React.Fragment>
                                        {schedule.current[currentEvent].buttonStatus === null ? (
                                            <InnerCardComponent 
                                                taskTime={task.time}
                                                onConfirm={() => handleConfirm(task.name)}
                                                onReject={() => handleReject(task.name)}
                                            />
                                        ) : (
                                            <OuterCard taskName={task.name} taskTime={task.time} buttonStatus={task.buttonStatus} />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <OuterCard taskName={task.name} taskTime={task.time} buttonStatus={task.buttonStatus} />
                                )
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </Col>
        </div>
    );
}

