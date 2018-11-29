import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import Button from "@material-ui/core/Button";

import { INCLUDE_FIREBASE_OPTION } from '../../utilities/constants';

import './header.scss';


class Header extends Component {

    openSlideMenu = () => { this.refs.sideMenu.style.width = '250px'; }
    closeSlideMenu = () => { this.refs.sideMenu.style.width = '0'; }

    render () {

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
                    <span className="open-slide">
                        <a href="#" onClick={this.openSlideMenu}>
                            <svg width="30" height="30">
                                <path d="M0,5 30,5" stroke="#fff" strokeWidth="4"/>
                                <path d="M0,14 30,14" stroke="#fff" strokeWidth="4"/>
                                <path d="M0,23 30,23" stroke="#fff" strokeWidth="4"/>
                            </svg>
                        </a>
                    </span>

                    <div className="main-nav">
                        <ul className="navbar-nav">
                            <Links closeSlideMenu={this.closeSlideMenu}/>
                        </ul>
                    </div>
                </div>

                <div id="side-menu" className="side-nav" ref="sideMenu">
                    <a href="#" className="btn-close" onClick={this.closeSlideMenu}>&times;</a>
                    <Links closeSlideMenu={this.closeSlideMenu}/>
                </div>

            </nav>
        );
    }
};

export default Header;


const Links = (props) => {
    return (
    <Fragment>
        <li><NavLink to="/home" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Home</NavLink></li>
        <li><NavLink to="/fixtures-latest" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Latest Fixtures</NavLink></li>
        <li><NavLink exact to="/fixtures" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Remaining Fixtures</NavLink></li>
        <li><NavLink to="/fixtures/results" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Results</NavLink></li>
        <li><NavLink exact to="/tables" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Table</NavLink></li>
        <li className="tables-full"><NavLink to="/tables/full" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Table (Full)</NavLink></li>
        <li><NavLink to="/administration" className="nav-link" activeClassName="active-link" onClick={props.closeSlideMenu}>Administration</NavLink></li>
        {/* <div className="nav-child-content">
            <a href=''>Sign in using email</a>
            <a href=''>Sign in using Gmail</a>
            <a href=''>Register</a>
        </div> */}
    </Fragment>
    )
}