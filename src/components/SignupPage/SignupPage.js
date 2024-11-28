import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import emailLogo from "../../image/emailLogo.png";
import config from "../../config";
import { useAuth } from "../../contexts/AuthProvider";
import side from "../../image/side.png";
const SignupPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, companyName, email, password, confirmPassword } =
      formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const baseUrl = config.baseUrl;

    try {
      // Register API call
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          company_name: companyName,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });
      localStorage.setItem("email", email);
      const data = await response.json();

      if (response.status === 200 && data.status === "success") {
        // If registration is successful, make verification API call
        const verificationResponse = await fetch(
          `${baseUrl}/api/verification/code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email, // Send the email for verification
            }),
          }
        );

        const verificationData = await verificationResponse.json();

        if (
          verificationResponse.status === 200 &&
          verificationData.status === "success"
        ) {
          navigate("/verify");
        } else {
          setIsLoading(false);
          setError(
            verificationData.message || "Verification failed. Please try again."
          );
        }
      } else {
        setIsLoading(false);
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-page">
      <div className="side-image">
        <img src={side} alt="Logo" className="signup-logo" />
      </div>
      <div className="signup-card">
        <div className="logo-wrapper">
          <img src={emailLogo} alt="Logo" className="signup-logo" />
        </div>
        <h1 className="signup-heading">Sign Up</h1>
        {/* <p className="signup-subtitle">
          Join us today and unlock exclusive features. Let's build something
          great together!
        </p> */}

        {/* Show error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="signup-input"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="signup-input"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="signup-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <a href="/login" className="signin-link">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
