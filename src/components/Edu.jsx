import React, { useState } from "react";
import './Edu.css';

const Edu = () => {
    const [Education, showEducation] = useState(true);
    return (
        <>

            <div className="Timeline">
                <h1 id="heading">○ TIMELINE</h1>
                <div className="select">
                    <button id="Education" className={!Education ? 'active' : ''} onClick={() => showEducation(true)}>Education</button>
                    <button id="Experience" className={Education ? 'active' : ''} onClick={() => showEducation(false)}>Experience</button>
                </div>
                {Education ? (
                    <div className="Education">
                        <div className="container left-container">
                            <div className="ball">
                            </div>
                            <div className="box">
                                <h1>Nandha Engineering College</h1>
                                <h2>Bachelor's in  Artificial Intellegence and Data Science</h2>
                                <h3>Aug 2021 - Jun 2025</h3>
                                <h4>CGPA : 8.0</h4>
                            </div>
                        </div>

                        <div className="container right-container">
                            <div className="ball">
                            </div>
                            <div className="box">
                                <h1>SSV. Matric. Higher. Secondary. School</h1>
                                <h2>HSC in Tamil Nadu State Board , India</h2>
                                <h3>July 2019 - July 2021 </h3>
                                <h4>Percentage: 85.8% </h4>
                            </div>
                        </div>

                        <div className="container left-container">
                            <div className="ball">
                            </div>
                            <div className="box">
                                <h1>Navarasam. Matric. Higher. Secondary. School</h1>
                                <h2>SSLC in Tamil Nadu State Board , India</h2>
                                <h3>May 2019 </h3>
                                <h4>Percentage: 81.5% </h4>
                            </div>
                        </div>
                    </div>)
                    : (
                        <div className="Experience">
                            <div className="container left-container">
                                <div className="ball">
                                </div>
                                <div className="box">
                                    <h1>ML Engineer Intern</h1>
                                    <h5>Igrad labs - Remote</h5>
                                    <h3>Sep 2023 - Current</h3>
                                </div>
                            </div>

                        </div>)}

            </div>

        </>
    );
};

export default Edu;