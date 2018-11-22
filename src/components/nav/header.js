import React from 'react';
import { NavLink } from 'react-router-dom';

import Button from "@material-ui/core/Button";

import { INCLUDE_FIREBASE_OPTION } from '../../utilities/constants';

import './header.css';


const Header = () => {
    return (
        <nav>
            <div className="main-heading">
                <div className="title-nav">My Sports {process.env.REACT_APP_APP_TITLE_SUFFIX}</div>

                {INCLUDE_FIREBASE_OPTION && 
                    <div className="login-section">
                        <div className="login-buttons">
                            <Button variant="contained" color="primary" id="login" onClick={this.logIn}>Log in</Button>
                            <Button variant="contained" color="primary" id="register" onClick={this.register}>Register</Button>
                            <Button variant="contained" color="secondary" id="logout" onClick={this.logOut}>Logout</Button>
                        </div>
                        <div className="loggedInAs">Logged in as ...</div>
                    </div>
                }
            </div>

            <div className="sport">
                <div className="main-nav">
                    <ul>
                        {/* <li className="active-sport-link">Premier League Football<a href="" alt=""></a></li> */}
                        {/* <li className="link-disabled">Cricket<a href="" alt=""></a></li> */}
                        {/* <li className="link-disabled">Golf<a href="" alt=""></a></li> */}
                        <li className="active-sport-link">Premier League Football</li>
                        <li className="link-disabled">Cricket</li>
                        <li className="link-disabled">Golf</li>
                    </ul>
                </div>
            </div>

            <div className="individual-sport" id="football">
                <div className="main-nav">
                    <ul>
                        <li><NavLink to="/home" className="nav-link" activeClassName="active-link">Home</NavLink></li>
                        <li><NavLink to="/fixtures-latest" className="nav-link" activeClassName="active-link">Latest Fixtures</NavLink></li>
                        <li><NavLink exact to="/fixtures" className="nav-link" activeClassName="active-link">Remaining Fixtures</NavLink></li>
                        <li><NavLink to="/fixtures/results" className="nav-link" activeClassName="active-link">Results</NavLink></li>
                        <li><NavLink exact to="/tables" className="nav-link" activeClassName="active-link">Table</NavLink></li>
                        <li><NavLink to="/tables/full" className="nav-link" activeClassName="active-link">Table (Full)</NavLink></li>
                        <li><NavLink to="/administration" className="nav-link" activeClassName="active-link">Administration</NavLink></li>
                            <div className="nav-child-content">
                                <a href=''>Sign in using email</a>
                                <a href=''>Sign in using Gmail</a>
                                <a href=''>Register</a>
                            </div>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;