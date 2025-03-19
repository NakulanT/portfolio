import React, { useState, useEffect } from "react";
import './Project.css';
import s1 from '../images/tic-tac-toe.png';
import s3 from '../images/ecommerse.png';
import s4 from '../images/chennai.png';
import s5 from '../images/cricket.jpg';
import s6 from '../images/Cattle.png';
import s7 from '../images/whatsapp.png';
import s8 from '../images/Chatroom.png';
import s2 from '../images/Ecart.png';
const Project = () => {

    const slides = [
        { image: s6,name : "Cattle Behaviour Analysis" , link : "https://github.com/NakulanT/Cattle-behaviour-analysis",tools : "ReactJS, Python, Flask, OpenCV, Pytorch, Numpy, Pandas",description: "The Anonymous Chat Room is a web-based app for real-time, anonymous group chatting, built with React JS and Firebase Firestore, allowing users to create or join chat rooms with unique IDs and passwords for secure, identifier-based communication without personal authentication." },
        { image: s5,name : "LBW Decision System" , link : "https://github.com/NakulanT/2D-DRS",tools : "React Native, Python, FastAPI, OpenCV, AWS",description: "The LBW Decision System is a native Python application that automates cricket LBW decisions using computer vision, a single 2D camera, YOLOv8 for ball and stump detection, and custom trajectory analysis with OpenCV, PyTorch, and Ultralytics YOLO for real-time video processing." },
        { image: s2,name : "Ecommerse Site" , link : "https://github.com/NakulanT/E-Commerse",tools : "ReactJS, Python, Flask, MongoDB, Neo4j",description: "This advanced cattle behavior monitoring system uses deep learning with YOLOv8 models to detect real-time behaviors like standing, lying down, and eating, while uniquely shaped and colored stickers enable precise individual cattle tracking." },
        { image: s7,name : "Whatsapp Clone" , link : "https://github.com/NakulanT/whatsapp-clone",tools : "ReactJS, Firebase, OAuth",description: "The Real-Time Chat Application is a web-based platform built with React JS, Firebase for real-time chat storage, and OAuth for secure authentication, enabling users to sign up, search for others by username, and initiate seamless, secure text chats." },
        { image: s8,name : "Anonymous Chat Rooom" , link : "https://github.com/NakulanT/Chat-room",tools : "ReactJS, Firebase",description: "The Anonymous Chat Room is a web-based app built with React JS and Firebase Firestore, enabling real-time, anonymous group chatting where users can create or join rooms with unique IDs and passwords, communicating via auto-generated identifiers without personal authentication for a simple, secure experience." },
        { image: s1,name : "Tic Tac Toe" , link : "https://github.com/NakulanT/Tic-Tac-Toe",tools : "Python, Flask, Min-Max Algorithm",description: "Tic Tac Toe game using Flask, HTML, CSS and Python, featuring an AI powered by the Min-Max algorithm. X as AI and O as the user" },
        { image: s3,name : "Med-Ecommerse Site",link : "https://github.com/NakulanT/Medical-shop",tools : "Yarn , ReactJs , MongoDB Atlas",description: "Crafted a responsive e-commerce platform using React and Node.js, delivering real-time product updates, Applied modern web development practices for an optimal online shopping experience.Successfully met client specifications on a freelance basis." },
        { image: s4,name : "House Price Prediction" , link : "https://github.com/NakulanT/Chennai-house-price-prediction",tools : "Python, Flask, Scikit Learn, Pandas, Numpy",description: "Created a machine learning model to find the house pricing in Chennai using RGboost model.Data set is collected form kaggle" }
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
            <div className="tools">
                <h2>
                    Tools :
                </h2>
                <h3>{slides[currentstate].tools}</h3>
            </div>
        </div>
        </section>
    );
};

export default Project;