import React, { useEffect, useState } from "react";
import './Contact.css'

const Contact = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        console.log(name , email ,message);
    } 
    return (
        <div className="Contact">
            <h1 id="subheadings">○ Contact</h1>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <div className="form-name">
                        <label htmlFor="name">Name </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-email">
                        <label htmlFor="email" >Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-message">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button id="form-summit" type="submit">Send Email</button>
                </div>
            </form>
        </div>
    );
};

export default Contact;