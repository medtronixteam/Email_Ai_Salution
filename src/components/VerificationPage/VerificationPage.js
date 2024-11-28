import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VerificationPage.css";
import config from "../../config";
import { useAuth } from "../../contexts/AuthProvider";

const VerificationPage = () => {
  const { token } = useAuth;
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    setIsLoading(true);
    const baseUrl = config.baseUrl;

    try {
      const response = await fetch(`${baseUrl}/api/verify/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: verificationCode,
          email: localStorage.getItem("email"),
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.status === "success") {
        setIsLoading(false);
        navigate("/login");
      } else {
        setIsLoading(false);
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  const handleResend = async () => {
    if (isResendDisabled) return;

    setIsLoading(true);
    const baseUrl = config.baseUrl;

    try {
      const response = await fetch(`${baseUrl}/api/verification/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.status === "success") {
        setError("");
        setIsLoading(false);
        setTimer(60);
        startTimer();
      } else {
        setIsLoading(false);
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  const startTimer = () => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    setIsResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
  }, [timer]);

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h1 className="verification-heading">Verify Your Email</h1>
        <p className="verification-subtitle">
          We have sent a verification code to your email. Please enter it below
          to verify your account.
        </p>

        {/* Show error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Verification Form */}
        <form className="verification-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="verificationCode"
            placeholder="Verification Code"
            className="verification-input"
            value={verificationCode}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className="verification-button"
            disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Resend OTP Button */}
        {timer === 0 ? (
          <button
            className="resend-button"
            onClick={handleResend}
            disabled={isResendDisabled || isLoading}>
            {isLoading ? "Resending..." : "Resend OTP"}
          </button>
        ) : (
          <p className="timer-text">Resend OTP in {timer} seconds</p>
        )}

        <div className="verification-footer">
          <p>Didn't get the code? Please check your spam folder.</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
