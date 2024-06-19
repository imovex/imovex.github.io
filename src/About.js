import React from "react";
import HeaderNavbar from './components/HeaderNavbar';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {

    return(
        <div>        
            <HeaderNavbar/>
            <Col className="generalCol">
                <Col className="leftCol">
                    <Image className="mePic" src={`${process.env.PUBLIC_URL}/img/me.png`}/>
                    <Col className="impressum">
                        <Image className="inovex" src={`${process.env.PUBLIC_URL}/img/inovex.png`}/>
                        <h6>
                            inovex GmbH<br></br>                        
                            Ludwig-Erhard-Allee 6<br></br>                   
                            76131 Karlsruhe<br></br>            
                            Tel.: +49 721 619 021-0<br></br>
                            Fax: +49 721 619 021-11<br></br>
                            info@inovex.de
                        </h6>
                    </Col>
                </Col>
                <Col className="rightCol">
                    <h6>Hello there together!</h6>
                    <h6>My name is Sarah and I am currently writing my master's thesis in 
                        information technology at the University of Applied Science in Mannheim.

                        iMOVEx is an application that I developed in the past few months to 
                        help me collect the user data for my research.
                    </h6>
                    <h6>
                        In this research I want to find out whether it is worth it to integrate 
                        gamification into an application in relation to the effort of implementation. 
                        The performance of two user groups (one gamified, the other normal) will be 
                        analyzed for different variables and how they are affected by gamification. 
                    </h6>
                    <h6>
                        For the context of this research I chose the lack of physical activity
                        in occupations with a high sedentary time. Maybe this application will help 
                        you to develop a healthier habit in terms of physical activity even after the 
                        testing period and therefore decrease your risk of health problems with age.
                    </h6>
                    <h6>
                        This thesis is supported by inovex. The results of the research will be 
                        published afterwards in an <Link to="https://www.inovex.de/de/blog">inovex Blogpost</Link>.
                    </h6>                    
                    <h6>
                        If you are interested in further details about the research or results, don't hesitate to 
                        contact me via <a href="mailto:sarah.schulz@inovex.de">E-Mail</a>.
                    </h6>
                    <h6>
                        Thank you for participating in my research!
                    </h6> 
                </Col>
            </Col>
        </div>
    );
}
