import React, { useState } from "react";
import emailjs from "@emailjs/browser"; // Import EmailJS
import "./Contact.css";

const Contact = () => {
  const [firstname, setFirst] = useState("");
  const [lastname, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      first_name: firstname,
      last_name: lastname,
      user_email: email,
      user_message: message,
    };

    emailjs
      .send(
        "service_key79qg", // Your EmailJS Service ID
        "template_xwuo1ra", // Your EmailJS Template ID
        templateParams,
        "LKnG16fqlHdhbUNfk" // Your Public Key
      )
      .then(
        (response) => {
          alert("✅ Email sent successfully!");
          setFirst("");
          setLast("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          alert("❌ Failed to send email. Please try again later.");
          console.error("EmailJS error:", error);
        }
      );
  };

  return (
    <section id="contact">
      <div className="Contact">
        <h1 id="subheadings">○ Contact</h1>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="firstname">
              <label htmlFor="firstname">First name</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirst(e.target.value)}
                required
              />
            </div>

            <div className="lastname">
              <label htmlFor="lastname">Last name</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLast(e.target.value)}
                required
              />
            </div>

            <div className="email">
              <label htmlFor="email">Email</label>
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
              <button id="form-submit" type="submit">
                Send Email
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
