import React from "react";
import './Nav.css';

const Nav = () => {
    return (
        <nav id="header">
            <label className="logo">
            ○ Nakulan T
            </label>
            <ul>
                <li>
                    <a className="nav_link" href="#">About</a>
                </li>
                <li>
                    <a className="nav_link" href="#">Skills</a>
                </li>
                <li>
                    <a className="nav_link" href="#">Projects</a>
                </li>
                <li>
                    <a className="nav_link" href="#">Contact</a>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
