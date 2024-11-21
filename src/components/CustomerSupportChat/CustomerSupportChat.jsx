import React, { useState, useEffect } from "react";
import "./CustomerSupportChat.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import config from "../../config";
import { useAuth } from "../../contexts/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faUser } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chats, setChats] = useState({});
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const baseUrl = config.baseUrl;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data.data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
        // toast.error("Error fetching tickets");
      }
    };
    fetchTickets();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/tickets`,
        {
          title: newTicket.title,
          description: newTicket.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // toast.success("Ticket has been created successfully");
        const ticketId = response.data.id;
        const ticket = {
          id: ticketId,
          title: newTicket.title,
          description: newTicket.description,
        };
        setTickets((prev) => [...prev, ticket]);
        setChats((prev) => ({
          ...prev,
          [ticketId]: [],
        }));

        setNewTicket({ title: "", description: "" });
        setShowNewTicket(false);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      // toast.error("Some issue in creating a ticket. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleMoreDiscussion = async (ticket) => {
    try {
      const response = await axios.get(`${baseUrl}/api/tickets/${ticket.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set the selected ticket and its chat history
      setSelectedTicket(ticket);
      setChats((prev) => ({
        ...prev,
        [ticket.id]: response.data.data
          ? response.data.data.map((msg) => ({
              sender: msg.is_admin ? "Admin" : "User",
              message: msg.description,
            }))
          : [],
      }));
    } catch (error) {
      console.error("Error fetching chat messages:", error.message);
      // toast.error("Some issue in loading messages. Please try again.");
    }
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim(); // Message input field se value lete hain
    if (!message) return; // Agar message empty hai to return kar dein

    try {
      // 1. Send the message using POST API
      const sendResponse = await axios.post(
        `${baseUrl}/api/tickets/message`,
        {
          ticket_id: selectedTicket.id,
          description: message, // User ka message "description" mein bhejte hain
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (sendResponse.status === 200) {
        // toast.success("Message sent successfully");

        const chatResponse = await axios.get(
          `${baseUrl}/api/tickets/${selectedTicket.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 3. Update the chat messages state
        if (
          chatResponse.status === 200 &&
          Array.isArray(chatResponse.data.data)
        ) {
          setChats((prev) => ({
            ...prev,
            [selectedTicket.id]: chatResponse.data.data.map((msg) => ({
              sender: msg.is_admin ? "Admin" : "User",
              message: msg.description,
            })),
          }));
        } else {
          // toast.error("Failed to fetch updated messages.");
        }

        // Clear the message input field
        e.target.message.value = "";
      } else {
        // toast.error("Failed to send the message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // toast.error("Error sending message. Please try again.");
    }
  };

  return (
    <div className="customer-support">
      <h2>Customer Support</h2>
      {!showNewTicket && !selectedTicket && (
        <span
          onClick={() => setShowNewTicket(true)}
          className="generate-ticket-button">
          Generate Ticket
        </span>
      )}
      {showNewTicket && !selectedTicket && (
        <form onSubmit={handleSubmitTicket} className="new-ticket-form">
          <input
            type="text"
            name="title"
            placeholder="Enter Ticket Title"
            value={newTicket.title}
            onChange={handleChange}
            required
          />
          <ReactQuill
            theme="snow"
            value={newTicket.description}
            onChange={(value) =>
              setNewTicket((prev) => ({ ...prev, description: value }))
            }
            placeholder="Enter Ticket Description"
            className="quill-editor"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          <button
            type="button"
            onClick={() => setShowNewTicket(false)}
            className="cancel-button">
            Cancel
          </button>
        </form>
      )}
      {selectedTicket ? (
        <div className="ticket-details">
          <span className="ticket-title">{selectedTicket.title}</span>
          <div className="chat-box">
            <div className="chat-messages">
              {(chats[selectedTicket.id] || []).map((chat, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    chat.sender === "User" ? "user-message" : "admin-message"
                  }`}>
                  {chat.sender === "Admin" && (
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className="chat-icon"
                      style={{ color: "#842029" }}
                    />
                  )}
                  <div
                    className="chat-text"
                    dangerouslySetInnerHTML={{ __html: chat.message }}></div>
                  {chat.sender === "User" && (
                    <FontAwesomeIcon
                      icon={faUser}
                      className="chat-icon"
                      style={{ color: "#0f5132" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>
          <button onClick={handleBackToList} className="back-button">
            Back
          </button>
        </div>
      ) : (
        !showNewTicket && (
          <div className="ticket-table">
            <table>
              <thead>
                <tr>
                  <th>Ticket Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {tickets.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "20px" }}>
                    No tickets found...
                  </td>
                </tr>
              )}
              <tbody>
                {Array.isArray(tickets) &&
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.title}</td>
                      <td>{ticket.status}</td>
                      <td>
                        {ticket.status !== "Pending" && (
                          <button
                            onClick={() => handleMoreDiscussion(ticket)}
                            className="more-button">
                            More Discussion
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )
      )}
      <ToastContainer />
    </div>
  );
};
export default CustomerSupport;
