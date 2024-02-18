import React, { useState, useEffect } from "react";
import './Project.css';
import s1 from '../images/python.png';
import s2 from '../images/java.png';
import s3 from '../images/c.png';

const Project = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { image: s1, description: "Python Programming Language" },
        { image: s2, description: "Java Programming Language" },
        { image: s3, description: "C Programming Language" }
    ]; // Add your slide images and descriptions here

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
            <div className="Fullbox">
                <div className="ContentBox">
                    <button className="prevButton" onClick={prevSlide}>{'<'}</button>
                    <div className="slideContainer">
                        <img src={slides[currentSlide].image} alt={`Slide ${currentSlide + 1}`} />
                        <div className="description">{slides[currentSlide].description} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores quam quibusdam quaerat temporibus. Aliquam ipsum culpa ducimus, commodi dolor deleniti? Ratione corporis, nemo nihil porro facere quod quo totam magnam!</div>
                    </div>
                    <button className="nextButton" onClick={nextSlide}>{'>'}</button>
                </div>
            </div>
        </div>
    );
};

export default Project;
