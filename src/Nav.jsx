import React from "react";

const Nav = () => {
    return (
        <div id="home">
            <nav className="nav container">
                <h1>Nakulan</h1>
                <div class="nav menu">
                    <li>
                        <a class="nav link" href="#home">Home</a>
                    </li>
                    <li>
                        <a class="nav link" href="#home">about</a>
                    </li>
                    <li>
                        <a class="nav link" href="#home">skill</a>
                    </li>
                </div>
            </nav>
        </div>
    );
};

export default Nav;