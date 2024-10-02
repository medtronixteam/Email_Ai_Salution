import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./SignUp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestBody = {
      email,
      name,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! Please log in.");
        setErrorMessage("");
        setEmail("");
        setName("");
        setPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {errorMessage && (
          <div className="alert alert-warning alert-custom" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success alert-custom" role="alert">
            {successMessage}
          </div>
        )}
        <div className="avatar">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Enter Work Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
