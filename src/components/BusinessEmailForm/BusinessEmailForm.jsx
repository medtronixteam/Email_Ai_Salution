import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BusinessEmailForm.css";
import { useAuth } from "../../contexts/AuthProvider";
import config from "../../config";

const BusinessEmailForm = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    main_mailer: "Email",
    main_host: "",
    main_port: "587", // Default port for TLS
    main_username: "",
    main_password: "",
    main_encryption: "TLS", // Default encryption
    main_from_address: "",
    main_from_name: "",
  });

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchEmailSettings = async () => {
      const baseUrl = config.baseUrl;
      try {
        const response = await fetch(`${baseUrl}/api/email/email`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.status === 200 && data.status === "success") {
          // Populate the form data with the response
          setFormData({
            main_mailer: data.data.main_mailer,
            main_host: data.data.main_host,
            main_port: data.data.main_port,
            main_username: data.data.main_username,
            main_password: data.data.main_password,
            main_encryption: data.data.main_encryption,
            main_from_address: data.data.main_from_address,
            main_from_name: data.data.main_from_name,
          });
        } else {
          // toast.error(data.message || "Failed to fetch email settings.");
        }
      } catch (error) {
        console.error("Error:", error);
        // toast.error("An error occurred while fetching email settings.");
      }
    };

    fetchEmailSettings();
  }, [token]); // Depend on token to refetch if it changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,

      main_from_address:
        name === "main_username" ? value : prevState.main_from_address,
    }));
  };

  const handleEncryptionChange = (e) => {
    const encryptionType = e.target.value;
    // Update port based on encryption type (SSL -> 465, TLS -> 587)
    setFormData((prevState) => ({
      ...prevState,
      main_encryption: encryptionType,
      main_port: encryptionType === "SSL" ? "465" : "587",
    }));
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
          main_mailer: "Email",
          main_host: "",
          main_port: "587",
          main_username: "",
          main_password: "",
          main_encryption: "SSL",
          main_from_address: "",
          main_from_name: "",
        });

        // toast.success(data.message || "Email settings saved successfully!");
      } else {
        // toast.error(data.message || "Failed to save email settings. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <center>
      <ToastContainer />
      <div className="container email-form-containers">
        <div className="row">
          <div
            className="col-md-6 email-form-container"
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="main_port">Port</label>
                <input
                  type="text"
                  id="main_port"
                  name="main_port"
                  value={formData.main_port}
                  onChange={handleInputChange}
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
                <select
                  id="main_encryption"
                  name="main_encryption"
                  value={formData.main_encryption}
                  onChange={handleEncryptionChange}>
                  <option value="SSL">SSL</option>
                  <option value="TLS">TLS</option>
                </select>
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
