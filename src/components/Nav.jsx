import React from "react";
import './Nav.css';

const Nav = () => {
    const scrollToSection = (id, e) => {
        e.preventDefault(); // Prevent default behavior of anchor tag
        const element = document.getElementById(id);
        if (element) {
            const navbarHeight = document.getElementById('header').offsetHeight; // Get navbar height
            const offsetTop = element.offsetTop - navbarHeight; // Subtract navbar height from section's top position
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav id="header">
            <label className="logo">
            ○ Nakulan T
            </label>
            <ul>
                <li>
                    <a className="nav_link" onClick={(e) => scrollToSection('about', e)} href="#about">About</a>
                </li>
                <li>
                    <a className="nav_link" onClick={(e) => scrollToSection('skills', e)} href="#skills">Skills</a>
                </li>
                <li>
                    <a className="nav_link" onClick={(e) => scrollToSection('time', e)} href="#time">Timeline</a>
                </li>
                <li>
                    <a className="nav_link" onClick={(e) => scrollToSection('pro', e)} href="#pro">Projects</a>
                </li>
                <li>
                    <a className="nav_link" onClick={(e) => scrollToSection('contact', e)} href="#contact">Contact</a>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
