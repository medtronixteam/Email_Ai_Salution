import React, { useState } from "react";
import "./AuthOptions.css";
import { useAuth } from "../../contexts/AuthProvider";
import config from "../../config";
const AuthOptions = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpClick = () => setShowOtpForm(true);
  const handleBackClick = () => setShowOtpForm(false);

  const { token } = useAuth();
  const [formData, setFormData] = useState({
    main_mailer: "smtp",
    main_host: "smtp.gmail.com",
    main_port: "587",
    main_username: "",
    main_password: "",
    main_encryption: "TLS",
    main_from_address: "",
    main_from_name: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      main_from_address:
        e.target.name === "main_username"
          ? e.target.value
          : formData.main_from_address,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          mail_type: "gmail",
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        setFormData({
          main_mailer: "smtp",
          main_host: "smtp.gmail.com",
          main_port: "587",
          main_username: "",
          main_password: "",
          main_encryption: "TLS",
          main_from_address: "",
          main_from_name: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleAuthClick = async () => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/auth/google`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const googleAuthUrl = data.message;

        const newWindow = window.open(googleAuthUrl);
        if (newWindow) {
          newWindow.focus();
        }
      }
    } catch (error) {
      console.error("Error fetching Google Auth URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {!showOtpForm ? (
        <div className="auth-options-row">
          <div className="auth-option">
            <button className="auth-button" onClick={handleOtpClick}>
              Generate an App Password
            </button>
            <p className="auth-description">
              A One-Time Password (OTP) is a temporary code that is sent to your
              registered mobile number or email. This code can only be used once
              and is used for secure authentication.
            </p>
          </div>
          {/* <div className="auth-option">
            <button
              className="auth-button"
              onClick={handleGoogleAuthClick}
              disabled={loading}>
              {loading ? "Loading..." : "Use Google Auth"}
            </button>
            <p className="auth-description">
              Google Authenticator is a free app that can be installed on your
              mobile phone and is used for two-factor authentication (2FA) by
              generating one-time passcodes. This app makes your accounts more
              secure
            </p>
          </div> */}
        </div>
      ) : (
        <center>
          <div className="container email-form-containers">
            <div className="row">
              <div className="col-md-6 email-form-container">
                <h3>Instructions</h3>
                <ul>
                  <li>Go to your Google Account Security Settings.</li>
                  <li>
                    Under the "Signing in" section, ensure you have 2-Step
                    Verification enabled.
                  </li>
                  <li>Create an App Password if necessary.</li>
                </ul>
              </div>
              <div className="col-md-6 form-container">
                {/* Back Button */}
                <button
                  type="button"
                  className="back-button"
                  onClick={handleBackClick}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}>
                  Back
                </button>

                <form onSubmit={handleSubmit} className="email-form">
                  <div className="form-group">
                    <label htmlFor="main_mailer">Mailer</label>
                    <input
                      type="text"
                      id="main_mailer"
                      name="main_mailer"
                      value={formData.main_mailer}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_host">Host</label>
                    <input
                      type="text"
                      id="main_host"
                      name="main_host"
                      value={formData.main_host}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_port">Port</label>
                    <input
                      type="text"
                      id="main_port"
                      name="main_port"
                      value={formData.main_port}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_username">Username</label>
                    <input
                      type="text"
                      id="main_username"
                      name="main_username"
                      value={formData.main_username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_password">Password</label>
                    <input
                      type="password"
                      id="main_password"
                      name="main_password"
                      value={formData.main_password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_encryption">Encryption</label>
                    <input
                      type="text"
                      id="main_encryption"
                      name="main_encryption"
                      value={formData.main_encryption}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_from_address">From Address</label>
                    <input
                      type="text"
                      id="main_from_address"
                      name="main_from_address"
                      value={formData.main_from_address}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="main_from_name">From Name</label>
                    <input
                      type="text"
                      id="main_from_name"
                      name="main_from_name"
                      value={formData.main_from_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </center>
      )}
    </div>
  );
};

export default AuthOptions;
