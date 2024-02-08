import React from "react";
import './Content.css'
import sampleImage from '../images/sample.png';
import leetcode from '../images/leetcode.png'
import linkdin from '../images/linkedin.png'
import github from '../images/github.png'

const Content = () => {
    return (
        <div>
            <div className="about">
                <div className="pathway">
                    <a href="https://www.linkedin.com/in/nakulant/">
                        <img src={linkdin} alt="linkedin" id="linkedin" />
                    </a>
                    <a href="https://leetcode.com/nakult">
                        <img src={leetcode} alt="leetcode" id="leetcode" />
                    </a>
                    <a href="https://github.com/NakulanT">
                        <img src={github} alt="github" id="github" />
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
                        As an AI and Data Science
                        student, I'm excel in data structures
                        and algorithms. I'm passionate about
                        solving complex problems and have a
                        solid background in Machine
                        Learning and Data Science.
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