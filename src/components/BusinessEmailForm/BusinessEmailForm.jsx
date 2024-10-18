import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BusinessEmailForm.css";
import { useAuth } from "../../contexts/AuthProvider";
import config from "../../config";
const BusinessEmailForm = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    main_mailer: "Mail",
    main_host: "smtp@gmail.com",
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
          mail_type: "email",
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setFormData({
          main_mailer: "Mail",
          main_host: "smtp@gmail.com",
          main_port: "587",
          main_username: "",
          main_password: "",
          main_encryption: "TLS",
          main_from_address: "",
          main_from_name: "",
        });

        // Show success toast with message from the API response
        toast.success(data.message || "Email settings saved successfully!");
      } else {
        // Show error toast with message from the API response
        toast.error(
          data.message || "Failed to save email settings. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // Show a generic error toast
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <center>
      <ToastContainer />
      <div className="container email-form-containers">
        <div className="row">
          <div
            className="col-md-6 email-form-container "
            style={{ color: "white" }}>
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
              <button type="submit" style={{ width: "100%" }}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </center>
  );
};

export default BusinessEmailForm;
