import React, { useState, useEffect } from "react";
import './Project.css';
import s1 from '../images/python.png';
import s2 from '../images/java.png';
import s3 from '../images/c.png';

const Project = () => {

    const slides = [
        { image: s1, description: "Python Programming Language" },
        { image: s2, description: "Java Programming Language" },
        { image: s3, description: "C Programming Language" }
    ];

    const [currentstate, setstate] = useState(0);

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
        }, 3000);
        return () => clearInterval(changeImage);
    }, [currentstate, slides.length]);

    return (
        <>
        <h1 id = "projects">○ PROJECTS</h1>
        <div className="projects">
            <div className="slidebox">
                <button onClick={prev} id="left">{"<"}</button>
                <img src={slides[currentstate].image}></img>
                <button onClick={next} id="right">{">"}</button>
                </div>
            <div className="description" >
                <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse aperiam, repellat animi temporibus, cupiditate facilis impedit a quae atque beatae iusto placeat repudiandae sapiente fugiat reiciendis fuga ab voluptatem tempore!</h1>
            </div>
        </div>
        </>
    );
};

export default Project;
