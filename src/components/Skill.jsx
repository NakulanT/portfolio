import React from "react";
import './Skill.css';

const Skill = () => {
    return (
        <div>
            <div className="Skills">
                <div className="grid">
                    <h1>Programming Languages</h1>
                    <div>
                        <div className="icons">
                            <i class="ci ci-html ci-5x"></i>
                            <i class="ci ci-css ci-5x"></i>
                            <i class="ci ci-js ci-5x"></i>
                            <i class="ci ci-python ci-5x"></i>
                            <i class="ci ci-java ci-5x"></i>
                            <i class="ci ci-c ci-5x"></i>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Frameworks</h1>
                    <div>
                        <div className="icons">
                        <img height="70" width="80" src="https://cdn.simpleicons.org/keras" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/pytorch" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/Flask" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/React" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/Pandas" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/Numpy" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/streamlit" />
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Tools</h1>
                    <div>
                        <div className="icons">
                        <img height="70" width="80" src="https://cdn.simpleicons.org/git" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/github" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/pycharm/forestgreen" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/docker" />
                        <i class="ci ci-vscode ci-5x"></i>
                        <img height="70" width="80" src="https://cdn.simpleicons.org/anaconda" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/jupyter" />
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Backend</h1>
                    <div>
                        <div className="icons">
                        <img height="70" width="80" src="https://cdn.simpleicons.org/mysql" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/sqlite" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/firebase" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/mongodb" />
                        <img height="70" width="80" src="https://cdn.simpleicons.org/streamlit" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skill;
