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
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="nav_link" href="#">About</a>
                </li>
                <li>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="nav_link" href="#">Skills</a>
                </li>
                <li>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="nav_link" href="#">Projects</a>
                </li>
                <li>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="nav_link" href="#">Contact</a>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
