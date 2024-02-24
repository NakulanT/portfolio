import React from "react";
import './Skill.css';

const Skill = () => {
    return (
        <div>
            <div className="Skills">
                    <h1 id="subheadings"> ○ SKILLS</h1>
                <div className="grid">
                    <h1>Programming Languages</h1>
                    <div>
                        <div className="icons">
                            <i class="ci ci-html ci-5x"  alt = "img"></i>
                            <i class="ci ci-css ci-5x" alt = "img"></i>
                            <i class="ci ci-js ci-5x"  alt = "img"></i>
                            <i class="ci ci-python ci-5x"  alt = "img"></i>
                            <i class="ci ci-java ci-5x"  alt = "img"></i>
                            <i class="ci ci-c ci-5x"  alt = "img"></i>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Frameworks</h1>
                    <div>
                        <div className="icons">
                            <img height="70" width="80" src="https://cdn.simpleicons.org/keras"   alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/pytorch"  alt = "img"/>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/Flask"  alt = "img"/>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/React"  alt = "img"/>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/Pandas"  alt = "img"/>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/Numpy"  alt = "img"/>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/streamlit"  alt = "img"/>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Tools</h1>
                    <div>
                        <div className="icons">
                            <img height="70" width="80" src="https://cdn.simpleicons.org/git"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/github"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/pycharm/forestgreen"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/docker"  alt = "img" />
                            <i class="ci ci-vscode ci-5x"  alt = "img" ></i>
                            <img height="70" width="80" src="https://cdn.simpleicons.org/anaconda"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/jupyter"  alt = "img" />
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Backend</h1>
                    <div>
                        <div className="icons">
                            <img height="70" width="80" src="https://cdn.simpleicons.org/mysql"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/sqlite"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/firebase"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/mongodb"  alt = "img" />
                            <img height="70" width="80" src="https://cdn.simpleicons.org/streamlit"  alt = "img" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skill;
