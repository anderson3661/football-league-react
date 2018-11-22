import React from 'react';
import { NavLink } from 'react-router-dom';

import './footer.css';


const Footer = () => {
    return (
        <footer>
            <div className="links">
                <div><NavLink to="/help" className="nav-link" activeClassName="active-link">Help</NavLink></div>
                <div><NavLink to="/contact" className="nav-link" activeClassName="active-link">Contact</NavLink></div>
                <div><NavLink to="/about" className="nav-link" activeClassName="active-link">About this application</NavLink></div>
            </div>
            &copy; Martin Anderson 2018

        </footer>
    );
};

export default Footer;