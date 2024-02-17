import React, { useState, useEffect } from "react";
import './Project.css';
import s1 from '../images/python.png';
import s2 from '../images/java.png';
import s3 from '../images/c.png';

const Project = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [s1, s2, s3]; // Add your slide images here

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };

    useEffect(() => {
        // Automatically switch to the next slide every 3 seconds
        const interval = setInterval(() => {
            setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
        }, 3000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentSlide, slides.length]);

    return (
        <div className="Projects">
            <div className="Projects-container">
                <div className="ContentBox">
                    <button className="prevButton" onClick={prevSlide}>{'<'}</button>
                    <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
                    <button className="nextButton" onClick={nextSlide}>{'>'}</button>
                </div>
            </div>
        </div>
    );
};

export default Project;
