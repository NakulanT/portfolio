// Skill.jsx

import React from "react";
import a from '../images/sam1.jpeg';
import b from '../images/sam2.png';
import c from '../images/sam3.png';
import './Skill.css';

const Skill = () => {
    const images = [a, b, c];

    return (
        <div>
            <h1>Skill</h1>
            <div className="slideshow">
                <div className="slides">
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`Slide ${index}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skill;
