import React, { useState } from "react";
import './Contact.css'
import axios from "axios";

const Contact = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/send-email', {
                name, email, message
            });
            console.log('email sented sucessfully!', response.data);
        }
        catch (error) {
            console.log("Error in sending email : ", error);
        }
    }
    return (
        <div className="Contact">
            <h1 id="subheadings">○ Contact</h1>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <div className="form-name">
                        <label htmlFor="name" className="form-name">Name </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-email">
                        <label htmlFor="email" className="form-email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-message">
                        <label htmlFor="message">Message:</label>
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