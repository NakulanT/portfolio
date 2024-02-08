import React from "react";
import c from '../images/c.png';
import java from '../images/java.png';
import python from '../images/python.png';
import js from '../images/js.png'
import './Skill.css';

const Skill = () => {
    const languages = [python,js,java,c];
    const frameworks = [python,js,java,c];
    const tools = [python,js,java,c];
    const backend = [python,js,java,c];
    
    return (
        <div>
            <div className="Skills">
                <div className="grid">
                    <h1>Programming Languages</h1>
                    <div>
                        <div className="icons">
                            {languages.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Icon ${index}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Frameworks</h1>
                    <div>
                        <div className="icons">
                            {frameworks.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Icon ${index}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Tools</h1>
                    <div>
                        <div className="icons">
                            {tools.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Icon ${index}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Backend</h1>
                    <div>
                        <div className="icons">
                            {backend.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Icon ${index}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skill;
