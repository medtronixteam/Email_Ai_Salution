import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../contexts/AuthProvider";
import "./Campaign.css"; // Import the CSS file
import config from "../../../config";
const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showEditSection, setShowEditSection] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    group_id: "",
    campaign_time: "",
    campaign_date: "",
    message: "",
    subject: "",
    email_host: "",
    campaign_id: "",
  });

  const location = useLocation();
  const { token } = useAuth();

  const fetchCampaigns = async () => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.get(`${baseUrl}/api/campaign`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.status === "success") {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.get(`${baseUrl}/api/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  useEffect(() => {
    if (token) {
      fetchCampaigns();
      fetchGroups();
    }
  }, [token]);

  const startCampaign = async (id) => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.get(`${baseUrl}/api/campaign/${id}/start`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.status === "success") {
        fetchCampaigns();
        toast.success("Campaign started successfully.");
      }
    } catch (error) {
      console.error("Error starting the campaign:", error);
      toast.error("Failed to start the campaign. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const stopCampaign = async (id) => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.get(`${baseUrl}/api/campaign/${id}/stop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.status === "success") {
        fetchCampaigns();
        toast.success("Campaign stopped successfully.");
      }
    } catch (error) {
      console.error("Error stopping the campaign:", error);
      toast.error("Failed to stop the campaign. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const deleteCampaign = async (id) => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.delete(`${baseUrl}/api/campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Campaign successfully deleted.");
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting the campaign:", error);
      toast.error("Failed to delete the campaign. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await axios.post(
        `${baseUrl}/api/campaign/11`,
        {
          name: formData.name,
          group_id: formData.group_id,
          campaign_time: formData.campaign_time,
          campaign_date: formData.campaign_date,
          message: formData.message,
          subject: formData.subject,
          email_host: formData.email_host,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Campaign data successfully submitted.");
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error submitting campaign data:", error);
      toast.error("Failed to submit campaign. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      group_id: campaign.group_id || "",
      campaign_time: campaign.campaign_time || "",
      campaign_date: campaign.campaign_date || "",
      message: campaign.message || "",
      subject: campaign.subject || "",
      email_host: campaign.email_host || "email",
      campaign_id: campaign.id || "",
    });
    setShowEditSection(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMailTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      email_host: e.target.value === "business" ? "email" : "gmail_password",
    }));
  };

  const handleBack = () => {
    setShowEditSection(false);
  };

  const showCampaignsTable = location.pathname === "/dashboard/campaign";

  return (
    <div className="campaign-container">
      <ToastContainer />
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {showCampaignsTable && !showEditSection && (
        <div>
          <Link to="/dashboard/create-campaign" className="create-campaign-btn">
            Create Campaign
          </Link>

          <h2 style={{ textAlign: "center", margin: "20px" }}>
            Campaigns List
          </h2>
          <div className="table-container">
            <center>
              <table className="campaign-table">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Time</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="table-cell">{campaign.name}</td>
                      <td className="table-cell">{campaign.status}</td>
                      <td className="table-cell">{campaign.campaign_time}</td>
                      <td className="table-cell">
                        {campaign.status === "pending" && (
                          <button
                            className="start-button"
                            onClick={() => startCampaign(campaign.id)}>
                            Start
                          </button>
                        )}
                        {campaign.status === "completed" && (
                          <button
                            className="start-button"
                            onClick={() => startCampaign(campaign.id)}>
                            Start again
                          </button>
                        )}

                        {campaign.status === "started" && (
                          <button
                            className="stop-button"
                            onClick={() => stopCampaign(campaign.id)}>
                            Stop
                          </button>
                        )}

                        {campaign.status === "pending" && (
                          <button
                            className="edit-button"
                            onClick={() => handleEditClick(campaign)}>
                            Edit
                          </button>
                        )}
                        {campaign.status !== "completed" && (
                          <button
                            className="delete-button"
                            onClick={() => deleteCampaign(campaign.id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </center>
          </div>
        </div>
      )}

      {showEditSection && (
        <div className="edit-section">
          <h2>Edit Campaign</h2>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label className="form-label">Campaign Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formGroup">
              <Form.Label className="form-label">Group</Form.Label>
              <Form.Control
                as="select"
                name="group_id"
                value={formData.group_id}
                onChange={handleFormChange}
                className="form-control">
                <option value="">Select Group</option>
                {Array.isArray(groups.data) &&
                  groups.data.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label className="form-label">Type of Email</Form.Label>
              <Form.Check
                type="radio"
                label="Business Email"
                name="mailType"
                value="business"
                checked={formData.email_host === "email"}
                onChange={handleMailTypeChange}
              />
              <Form.Check
                type="radio"
                label="Gmail App Password"
                name="mailType"
                value="gmail_password"
                checked={formData.email_host === "gmail_password"}
                onChange={handleMailTypeChange}
              />
            </Form.Group>

            <Form.Group controlId="formScheduleDate">
              <Form.Label className="form-label">Schedule Date</Form.Label>
              <Form.Control
                type="date"
                name="campaign_date"
                value={formData.campaign_date}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formScheduleTime">
              <Form.Label className="form-label">Schedule Time</Form.Label>
              <Form.Control
                type="time"
                name="campaign_time"
                value={formData.campaign_time}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formSubject">
              <Form.Label className="form-label">Email Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formMessage">
              <Form.Label className="form-label">Email Content</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSubmit}
              style={{ marginRight: "10px" }}>
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleBack}
              style={{ marginRight: "10px" }}>
              Back
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Campaign;
