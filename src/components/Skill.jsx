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
                        <i class="ci ci-pytorch ci-5x"></i>
                            <i class="ci ci-react ci-5x"></i>
                            <i class="ci ci-tensorflow ci-5x"></i>
                            <i class="ci ci-numpy ci-5x"></i>
                            <i class="ci ci-pandas ci-5x"></i>
                            <i class="ci ci-keras ci-5x"></i>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Tools</h1>
                    <div>
                        <div className="icons">
                        <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/Python.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v11/icons/python.svg" />
                        <i class="ci ci-git ci-5x"></i>
                        <i class="ci ci-github ci-5x"></i>
                            <i class="ci ci-vscode ci-5x"></i>
                            <i class="ci ci-jupyternotebook ci-5x"></i>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <h1>Backend</h1>
                    <div>
                        <div className="icons">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skill;
