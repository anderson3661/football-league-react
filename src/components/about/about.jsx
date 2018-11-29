import React from "react";

import { MAIN_BACKGROUND_IMAGE, HOSTING_SITE } from '../../utilities/constants';

import "./about.scss";

const About = () => {

    return (

        <div className="container-main-content-about">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
            <header className="container-card header">
                <h1>About this application</h1>
            </header>

            <div className="container">
                <div className="container-card">
                    <h2>Technologies Used</h2>
                    <ul>
                        <li>React</li>
                        <li>React Router</li>
                        <li>Redux</li>
                        <li>ApexCharts.js</li>
                        <li>SCSS (CSS preprocessor)</li>
                        <li>HTML5</li>
                        <li>CSS3 Flexbox and Grid</li>
                        <li>Browser local storage for persisting data</li>
                    </ul>
                </div>

                <div className="container-inner">
                    <div className="container-card">
                        <h2>Hosting</h2>
                        <p>It is hosted on Google's Firebase:</p>
                        <ul>
                            <li>
                                <a
                                    href={HOSTING_SITE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Hosting Site
                                </a>
                            </li>
                        </ul>
                    </div>

                {/* <div className="container-card">
                    <h2>Authentication</h2>
                    <p>
                        Users need to authenticate in order to use features within the
                        system:
                    </p>
                    <ul>
                        <li>
                        The action buttons on the Administration and Latest Fixtures
                        pages
                        </li>
                    </ul>
                    </div>

                    <div className="container-card">
                    <h2>Administrator Access</h2>
                    <p>Users with the administration role (set in Firebase) can:</p>
                    <ul>
                        <li>
                        Use Firebase to persist the application data (i.e. instead of
                        using the browser's local storage)
                        </li>
                    </ul>
                    </div> */}
                
                </div>
            </div>
        </div>
    );
};

export default About;