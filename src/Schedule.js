import React, { useState, useEffect, useRef } from "react";
import {Col, ProgressBar} from 'react-bootstrap';
import './Schedule.css';
import { InnerCardStandUp } from "./components/InnerCardStandUp.js";
import { InnerCardStretch } from "./components/InnerCardStretch.js";
import { InnerCardMove } from "./components/InnerCardMove.js";
import { OuterCard } from "./components/OuterCard.js";
import HeaderNavbar from "./components/HeaderNavbar.js";
import { postLogData } from './api';

export default function Schedule() {
    const [trigger, setTrigger] = useState(0);
    const savedWorkingTimes = JSON.parse(localStorage.getItem('workingTimes'));
    const [workingTimes, setWorkingTimes] = useState(savedWorkingTimes);

    const isGamified = localStorage.getItem('gamification') === 'true';

    // const initialSchedule = [
    //         { name: 'Stand up', time: '17:19', buttonStatus: null },
    //         { name: 'Stretch', time: '17:20', buttonStatus: null },
    //         { name: 'Stand up', time: '17:21', buttonStatus: null },
    //         { name: 'Move', time: '17:22', buttonStatus: null },
    //         { name: 'Stand up', time: '17:47', buttonStatus: null },
    //         { name: 'Stretch', time: '17:48', buttonStatus: null },
    //         { name: 'Stand up', time: '17:49', buttonStatus: null },
    // ];

    function generateSchedule(workingTimes){
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

        return initialSchedule;
    }

    function timeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const logTaskData = async (currentTask) => {
        let formattedTask = currentTask?.name.toUpperCase();

        if (formattedTask === "STAND UP") {
            formattedTask = "STAND_UP"; 
        }
        const logData = {
            userId: localStorage.getItem('userId'),
            task: formattedTask,
            status: currentTask?.time
        };

        try {
            const response = await postLogData(logData);
            console.log('task logged');
        } catch (error) {
            console.error('Error logging task data:', error);
        }
    }

    const schedule = useRef(generateSchedule(workingTimes));
    useEffect(() => {
        localStorage.setItem('initialSchedule', JSON.stringify(generateSchedule(workingTimes)));       
    }, []);
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentEvent, setCurrentEvent] = useState(() => {
        setCurrentTime(new Date());
        const savedDate = localStorage.getItem('lastDate');
        let currentIndex = schedule.current.findLastIndex(task => 
            timeStringToDate(task.time).getTime() <= currentTime.getTime() && 
            task.buttonStatus !== 'rejected' && 
            task.buttonStatus !== 'confirmed' &&
            task.buttonStatus !== 'expired'
        );

        // Reset an neuem Tag
        if (savedDate) {
            const lastDate = new Date(savedDate);
            if (currentTime.getDate() !== lastDate.getDate() || currentTime.getMonth() !== lastDate.getMonth() || currentTime.getFullYear() !== lastDate.getFullYear()) {
                // Neuer Tag, Local Storage zurücksetzen
                localStorage.removeItem('schedule');
            }
        }
        localStorage.setItem('lastDate', currentTime);

        const savedSchedule = localStorage.getItem('schedule');        
        const newInitialSchedule = generateSchedule(workingTimes);
        if (savedSchedule) {
            if (newInitialSchedule !== localStorage.getItem('initialSchedule')) {
                // Settings wurden verändert
                const oldSchedule = JSON.parse(localStorage.getItem('schedule'))
                // Ersetze noch nicht bearbeitete Events durch die mit den neuen Zeiten
                const updatedSchedule = oldSchedule.map((task, index) => {
                    if (task.buttonStatus === null) {
                        return newInitialSchedule[index];
                    }
                    return task;
                });
                localStorage.setItem('schedule', JSON.stringify(updatedSchedule));
                localStorage.setItem('initialSchedule', JSON.stringify(newInitialSchedule));

                schedule.current = updatedSchedule;
            } else {
                // Settings unverändert         
                schedule.current = JSON.parse(savedSchedule);
            }
        } else {
            schedule.current = generateSchedule(workingTimes);
        }
        
        // Wenn Arbeitstag bereits begonnen, verpasste Tasks auf EXPIRED
        const updatedSchedule = schedule.current.map((task, index) => {
            if (index < currentIndex && task.buttonStatus !== 'confirmed' && task.buttonStatus !== 'rejected') {
                return { ...task, time: 'EXPIRED', buttonStatus: 'expired' };
            }            
            localStorage.setItem('schedule', JSON.stringify(updatedSchedule));
            return task;
        });
        schedule.current = updatedSchedule;
        
        // Schedule durch Settings angepasst: currentIndex evtl in bereits bearbeitetem Bereich --> vorschieben bis nextIndex wieder bei offenem Event
        let index = currentIndex + 1;
        while (schedule.current[index] && schedule.current[index].buttonStatus !== null) {
          index++;
        }
        currentIndex = index - 1; // currentIndex auf zuletzt abgeschlossenes Event
        return currentIndex;
    });

    const [nextEvent, setNextEvent] = useState(currentEvent + 1);
    let timeoutID = null;
        
    useEffect(() => {
        startTimerNextEvent();       
    }, [currentEvent]);

    const handleTimeoutExpired = async () => {
        if (currentEvent !== -1) {
            const updatedSchedule = [...schedule.current];
            if (updatedSchedule[currentEvent].buttonStatus !== 'confirmed' && updatedSchedule[currentEvent].buttonStatus !== 'rejected') {
                updatedSchedule[currentEvent] = { ...updatedSchedule[currentEvent], time: 'EXPIRED', buttonStatus: 'expired' };
            }
            localStorage.setItem('schedule', JSON.stringify(schedule.current));
            schedule.current = updatedSchedule;
        }
        
        setCurrentEvent(nextEvent);        
        setNextEvent(nextEvent + 1);
        setTrigger(trigger + 1); // Neu rendern
        console.log("Timeout");
    };

    function startTimerNextEvent() {       
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        if (nextEvent < schedule.current.length) {
            const startTime = new Date().getTime();
            const endTime = timeStringToDate(schedule.current[nextEvent].time).getTime();
            const delay = endTime - startTime;
            
            timeoutID = setTimeout(handleTimeoutExpired, delay);                
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
        logTaskData(schedule.current[currentEvent]);
        console.log('DONE geloggt');
        localStorage.setItem('schedule', JSON.stringify(schedule.current));
        setTrigger(trigger + 1); // Neu rendern
        console.log('DONE - Task wurde abgeschlossen');
    };
    
    const handleReject = () => {
        schedule.current[currentEvent] = {...schedule.current[currentEvent], time: 'DECLINED', buttonStatus: 'rejected' };
        logTaskData(schedule.current[currentEvent]);
        console.log('DECLINED geloggt');
        localStorage.setItem('schedule', JSON.stringify(schedule.current));
        setTrigger(trigger + 1); // Neu rendern
        console.log('DECLINED - Task wurde abgelehnt');     
    };

    useEffect(() => {
        function calculateProgress() {
            const totalTasks = schedule.current.length;
            const completedTasks = schedule.current.filter(task => task.buttonStatus === 'confirmed').length;
            const progressPercentage = (completedTasks / totalTasks) * 100;
            return progressPercentage;
        }

        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${calculateProgress()}%`;
        }
    }, [schedule, trigger]);

    return (
        <div>
            <HeaderNavbar/>
            <Col className="scheduleCol">
                {
                    isGamified ?
                        (
                            <div className="progressContainer">
                                <ProgressBar striped />
                                <div>
                                    {schedule.current.filter(task => task.buttonStatus === 'confirmed').length} / {schedule.current.length}
                                    {" "} Tasks done
                                </div>
                            </div>
                            )
                        : undefined
                }
                <h4>Today</h4>
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
                                            <OuterCard left={task.name} right={task.time} buttonStatus={task.buttonStatus} />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <OuterCard left={task.name} right={task.time} buttonStatus={task.buttonStatus} />
                                )
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </Col>
        </div>
    );
}

