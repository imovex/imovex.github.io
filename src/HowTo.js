import React, { useState } from "react";
import HeaderNavbar from './components/HeaderNavbar';
import { Col, Row, Image } from 'react-bootstrap';
import './HowTo.css';

export default function HowTo() {

    const [isGamified, setIsGamified] = useState(localStorage.getItem('gamification') === 'true');

    return(
        <div>        
            <HeaderNavbar/>              
            <h5>How to iMOVEx?</h5>
            <Col className="howtoCol">
                { isGamified ? (
                    <Row className="firstRow">
                        <Image className="navbarPic" src={`${process.env.PUBLIC_URL}/howto/gamifiedNavbar.png`}/>
                        <h6>
                            Navigate between the different pages through the bar on top. The <strong>iMOVEx logo</strong> will 
                            always bring you <strong>back to your schedule</strong>. If a <strong>new working day</strong> has 
                            begun you have to <strong>refresh</strong> the page once to run your schedule again. If you haven't 
                            refreshed your schedule yet 
                            you will still receive the notifications for your tasks. You can also find more information
                            and my contact on the about page if you are interested in further details about the thesis.
                        </h6>
                        <h6> 
                            The bar above your schedule tracks your progress throughout the day. It can only 
                            be filled completely if you did all your tasks. On the top right behind the <strong>trophy</strong> you can 
                            find the <strong>leaderboard</strong>. It displays the <strong>current top ten</strong> performers 
                            of all the gamified users. You have to <strong>set a username to participate</strong> in the competition. 
                            If you <strong>accidentally closed the pop up</strong> just <strong>refresh</strong> the page and enter your username. 
                            Once there are enough users and collected data the leaderboard will fill and the competition can begin.
                        </h6>
                        <Col className="pictureCol">
                            <Image className="leaderboardPic" src={`${process.env.PUBLIC_URL}/howto/leaderboardUsername.png`}/>
                            <Image className="leaderboardPic" src={`${process.env.PUBLIC_URL}/howto/leaderboardGeneral.png`}/>
                        </Col>
                    </Row> ) : (
                    <Col className="firstRow">
                        <Image className="navbarPic" src={`${process.env.PUBLIC_URL}/howto/normalNavbar.png`}/>
                        <h6>
                            Navigate between the different pages through the bar on top. The <strong>iMOVEx logo</strong> will 
                            always bring you <strong>back to your schedule</strong>. If a <strong>new working day</strong> has 
                            begun you have to <strong>refresh</strong> the page once to run your schedule again. If you haven't 
                            refreshed your schedule yet you will still receive the notifications for your tasks. You can also find more information
                            and my contact on the about page if you are interested in further details about the thesis.
                        </h6>
                    </Col>
                    )
                }
                <Col className="horizontalCol">
                    <Image className="schedulePic" src={`${process.env.PUBLIC_URL}/howto/expiredSchedule.png`}/>
                    <h6>
                        If your schedule looks like this in the beginning it means that you <strong>registered</strong> at the end 
                        of your working day <strong>outside of your working hours</strong>. Your schedule will <strong>start again tomorrow</strong>.
                        The first day will not be counted for the research in order to avoid a bias in the collected data.
                    </h6>
                </Col>
                <Col className="horizontalCol">
                    <Image className="schedulePic" src={`${process.env.PUBLIC_URL}/howto/Settings.png`}/>
                    <h6>
                        You can <strong>change your working times</strong> and therefore your schedule in the settings. <strong>Be careful</strong> when and 
                        how you adjust your times. The <strong>changes apply immediately</strong> so it is best to change your schedule outside
                        of your working hours. If you change it during the running schedule your remaining tasks will be 
                        rescheduled. If you set your working hours to an earlier day, please note that <strong>events can expire</strong> before 
                        you get the chance to complete them. You will have <strong>7 tasks no matter how long your day is</strong> that will me 
                        spread evenly between your entered hours.
                    </h6>
                </Col>
                <Col className="horizontalCol">
                    <Image className="schedulePic" src={`${process.env.PUBLIC_URL}/howto/openTask.png`}/>
                    <h6>
                        If an <strong>event</strong> in your schedule <strong>is due</strong> you will <strong>receive a push notification</strong> that you can click. It will lead to your schedule even 
                        if the application was closed. Now you can decide if you want to <strong>complete the task or to skip it</strong>. Once marked the <strong>status</strong> of the task 
                        <strong> can not be changed again</strong>. The stretch task suggests three exercises to mobilize your muscles. If you don't like the suggestions you can 
                        simply think of three short exercises yourself that break the sedentary position. You have to check all the boxes to mark the 'Stretch' task as done. 
                        It <strong>doesn't matter that you do exactly what is shown</strong>. What does matter is that you <strong>break the static position</strong>. 
                        If a 'Stand Up' or a 'Move' task is due you have two buttons to confirm or reject the task. The messages inside those are also just a suggestion how 
                        you could break your routine so don't worry if you don't have a stand up desk. A walk to the coffee machine or to move around a little is also sufficient. 
                    </h6>
                </Col>
            </Col>
        </div>
    );
}
