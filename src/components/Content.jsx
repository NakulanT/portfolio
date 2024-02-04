import React from "react";
import './Content.css'
import sampleImage from '../images/sample.png';

const Content = () => {
    return (
        <div>
            <div className="about">
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

                <img src={sampleImage} alt="Sample" />
            </div>
        </div>
    );
};

export default Content;