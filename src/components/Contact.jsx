import React, { useState } from "react";
import './Contact.css'

const Contact = () => {

    const [firstname, setfirst] = useState('');
    const [lastname, setlast] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        console.log(firstname,lastname,email,message);
    } 
    return (
        <section id="contact" >
        <div className="Contact">
            <h1 id="subheadings">○ Contact</h1>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <div className="firstname">
                        <label htmlFor="name">First name</label>
                        <input
                            type="text"
                            id="name"
                            value={firstname}
                            onChange={(e) => setfirst(e.target.value)}
                            required
                        />
                    </div>

                    <div className="lastname">
                        <label htmlFor="name">Last name</label>
                        <input
                            type="text"
                            id="name"
                            value={lastname}
                            onChange={(e) => setlast(e.target.value)}
                            required
                        />
                    </div>
                    <div className="email">
                        <label htmlFor="email" >Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="message">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="formsummit">
                    <button id="form-summit" type="submit">Send Email</button>
                    </div>
                </div>
            </form>
        </div>
        </section>
    );
};

export default Contact;