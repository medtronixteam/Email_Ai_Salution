import React from "react";
import "./SignupPage.css";
import emailLogo from "../../image/emailLogo.png";
const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="logo-wrapper">
          <img src={emailLogo} alt="Logo" className="signup-logo" />
        </div>
        <h1 className="signup-heading">Sign Up Your Account</h1>
        <p className="signup-subtitle">
          Join us today and unlock exclusive features. Let's build something
          great together!
        </p>

        {/* Signup Form */}
        <form className="signup-form">
          <input
            type="text"
            placeholder="Full Name"
            className="signup-input"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">
            Sign Up
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
