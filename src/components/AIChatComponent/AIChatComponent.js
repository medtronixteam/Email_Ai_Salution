import React, { useState } from "react";
import { FaRobot } from "react-icons/fa"; // AI icon
import { FaUser } from "react-icons/fa"; // User icon
import "./AIChatComponent.css"; // Unique styling file for this component

const AIChatComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    // Add the user's message to the chat
    const newMessage = {
      sender: "user",
      text: userInput,
    };
    const aiResponse = {
      sender: "ai",
      text: `AI says: ${userInput}`,
      image: "https://placekitten.com/200/300", // Placeholder image
    };

    setMessages([...messages, newMessage, aiResponse]);
    setUserInput("");
  };

  return (
    <>
      <h2 className="ai-title">Write With AI</h2>
      <div className="ai-chat-container">
        <div className="ai-chat-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`ai-message ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}>
              {message.sender === "user" ? (
                <FaUser className="user-icon" />
              ) : (
                <FaRobot className="ai-icon" />
              )}
              <div className="message-bubble">
                <p>{message.text}</p>
                {/* {message.image && (
                <img
                  src={message.image}
                  alt="AI response"
                  className="ai-image"
                />
              )} */}
              </div>
            </div>
          ))}
        </div>
        <div className="ai-input-container">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type your message..."
            className="ai-input"
          />
          <button onClick={handleSubmit} className="ai-submit-btn">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatComponent;
