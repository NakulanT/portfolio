import React, { useState, useEffect } from "react";
import './Project.css';
import s1 from '../images/tic-tac-toe.png';
import s2 from '../images/chatbot.png';
import s3 from '../images/ecommerse.png';
import s4 from '../images/chennai.png';
const Project = () => {

    const slides = [
        { image: s1,name : "Tic Tac Toe" , link : "https://github.com/NakulanT/Tic-Tac-Toe",description: "Tic Tac Toe game using Flask, HTML, CSS and Python, featuring an AI powered by the Min-Max algorithm. X as AI and O as the user" },
        { image: s2,name : "Chatbot", link : "https://github.com/NakulanT/hackathon",description: "Chatbot for IT support during a Hackathon, incorporating features such as text-to-text and image-to-text.Utilized the Streamlit framework and integrated the Gemini API for enhanced functionality" },
        { image: s3,name : "Ecommerse",link : "https://github.com/NakulanT/Medical-shop",description: "Crafted a responsive e-commerce platform using React and Node.js, delivering real-time product updates, Applied modern web development practices for an optimal online shopping experience.Successfully met client specifications on a freelance basis." },
        { image: s4,name : "Price Prediction" , link : "https://github.com/NakulanT/Chennai-house-price-prediction",description: "Created a machine learning model to find the house pricing in Chennai using RGboost model.Data set is collected form kaggle" }
    ];

    const [currentstate, setstate] = useState(0);
    const [animate , setAnimate] = useState(false);

    const next = () => {
        setstate(currentstate === slides.length - 1 ? 0 : currentstate + 1);
        console.log("next clicked", currentstate);
    };

    const prev = () => {
        setstate(currentstate === 0 ? slides.length - 1 : currentstate - 1);
        console.log("prev clicked", currentstate);
    };

    useEffect(() => {
        const changeImage = setInterval(() => {
            setstate(currentstate === slides.length - 1 ? 0 : currentstate + 1);
        }, 30000);
        return () => clearInterval(changeImage);
    }, [currentstate, slides.length]);

    useEffect(() => {
        setAnimate(true);
        const timeout = setTimeout(() => {
            setAnimate(false);
        },3000);
        return () => clearTimeout(timeout);
    } , [currentstate]);

    useEffect(() => {
    console.log("Animation state changed:", animate);
}, [animate]);


    return (
        <section id="pro">
        <h1 id="subheadings-projects">○ PROJECTS</h1>
        <div className="projects" >
            <div className="projectname">{slides[currentstate].name}</div>
            <div className="slidebox">
                <button onClick={prev} id="left">{"<"}</button>
                <a href={slides[currentstate].link}><img src={slides[currentstate].image} alt="Project"></img></a>
                <button onClick={next} id="right">{">"}</button>
                </div>
            <div className= {`description ${animate ? 'slideIn' : ''}`}>
                <h1>{console.log("",animate)}{slides[currentstate].description}</h1>
            </div>
        </div>
        </section>
    );
};

export default Project;