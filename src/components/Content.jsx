import React from "react";
import './Content.css'
import sampleImage from '../images/edited.jpg';

const Content = () => {
    window.addEventListener('resize', function() {
        console.log("Current viewport width: " + window.innerWidth);
    });
    
    return (
        <div>
            <div className="about" id="about">
                <div className="links">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.3/src/app/ci.min.css" />
                <a href="https://www.linkedin.com/in/nakulant/">
                    <i class="ci ci-linkedin ci-2x"></i>
                </a>
                <a href="https://leetcode.com/nakulant">
                    <i class="ci ci-leetcode ci-2x"></i>
                </a>
                <a href="https://github.com/NakulanT">
                    <i class="ci ci-github ci-2x"></i>
                </a>

                </div>
                <div className="intro">
                    <h1>
                        Hi , I'm Nakulan  
                    </h1>
                    <h2>
                        Artificial Intellegence and Data Science
                    </h2>
                    <h3>
                    As a Machine Learning Engineer Intern at IGrads Labs, I’m an Artificial Intelligence and Data Science graduate. I’ve built advanced AI systems with strong accuracy for real-time applications. I’m focused on driving innovative solutions in machine learning and AI.
                    </h3>
                </div>
                <div className="profile">
                    <img src={sampleImage} alt="Sample" />
                </div>
            </div>
        </div>
    );
};

export default Content;
