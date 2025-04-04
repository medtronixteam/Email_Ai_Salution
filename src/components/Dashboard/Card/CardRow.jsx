import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUser,
  faCalendarAlt,
  faEnvelope,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./CardRow.css";
import { FaFilePdf } from "react-icons/fa";
import config from "../../../config.js";
const CardRow = () => {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState([]);
  // const [showPdfModal, setShowPdfModal] = useState(false); // For PDF modal
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  const [formData, setFormData] = useState({
    campaignName: "",
    selectedGroupId: "",
    selectedGroupName: "",
    campaignDate: "",
    campaignTime: "",
    groupUsers: [{ username: "", email: "" }],
    fileInput: null,
    groupName: "",
    mailType: "",
    gmailOptions: [],
    subject: "",
    selectedFileIds: [],
  });

  const [editorContent, setEditorContent] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [showError, setShowError] = useState(false);
  const [useFileInput, setUseFileInput] = useState(false);
  const [validationError, setValidationError] = useState({});
  const baseUrl = config.baseUrl;
  const [activeTab, setActiveTab] = useState("text");
  const [textMessage, setTextMessage] = useState("");
  const [htmlMessage, setHtmlMessage] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("recent");
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [apiResponseToken, setApiResponseToken] = useState(null);
  const [template, setTemplate] = useState([]);
  const [subject, setSubject] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [selectedTimeGap, setSelectedTimeGap] = useState("");
  const [selectedCampaignGap, setSelectedCampaignGap] = useState("");
  const [emailCount, setEmailCount] = useState("");
  const timeGapToMinutes = (timeGap) => {
    switch (timeGap) {
      case "5 minutes":
        return 5;
      case "10 minutes":
        return 10;
      case "30 minutes":
        return 30;
      case "1 hour":
        return 60;
      case "24 hours":
        return 1440;
      case "2 days":
        return 2880;
      default:
        return 0;
    }
  };

  const handleEmailCountChange = (e) => {
    setEmailCount(e.target.value);
    console.log("Email Count:", emailCount);
    // console.log("Email Count:", emailCount);
  };
  const handleTimeGapChange = (timeGap) => {
    const minutes = timeGapToMinutes(timeGap);
    setSelectedTimeGap(timeGap);

    setFormData((prevData) => ({
      ...prevData,
      timeGapInMinutes: minutes,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // console.log("Current HTML Code:", htmlCode);
  const handleHtmlInput = (e) => {
    const value = e.target.value;
    setHtmlCode(value);
    // console.log("Current HTML Code:", value);
  };

  useEffect(() => {
    const contents = JSON.stringify({
      content1: `${formData.subject}`,
      content2: `${htmlMessage}`,
    });

    fetch(`${baseUrl}/api/templates/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contents,
        template_id: selectedTemplate?.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.template) {
          setTemplate(data.template);
        }

        if (data && data.token) {
          setApiResponseToken(data.token);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [baseUrl, formData.subject, htmlMessage, selectedTemplate]);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/templates/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === "success") {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/groups`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setGroups(data.data);
        } else {
          // toast.info("No groups available.");
        }
      } catch (error) {
        console.error("Error during API call:", error);
        // toast.error("Failed to fetch groups. Please try again.");
      }
    };

    if (token) {
      fetchGroups();
    }
  }, [token]);
  const handleTabClick = (tabName) => {
    if (activeTab === "text") {
      setEditorContent(editorContent.trim());
    } else if (activeTab === "html") {
      setHtmlMessage(htmlMessage.trim());
    } else if (activeTab === "htmlcode") {
      setHtmlCode(htmlCode.trim());
    }

    setActiveTab(tabName);
  };

  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/attachments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.attachments) {
        const formattedFiles = data.attachments.map((attachment) => ({
          id: attachment.id,
          name: attachment.file_name,
          url: `${baseUrl}/storage/attachments/${attachment.file_name}`,
        }));
        setRecentFiles(formattedFiles);
      } else {
        setRecentFiles([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recent files:", error);
      // toast.error("Failed to fetch recent files.");
      setLoading(false);
    }
  };
  const handleSubmitSelectedFiles = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedFileIds: selectedFileIds, // Update selected file IDs in form data
    }));
    setShowPdfModal(false); // Close the modal
    console.log("Selected File IDs Submitted:", selectedFileIds);
  };

  const openModal = () => {
    setShowPdfModal(true);
    fetchRecentFiles();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      fileInput: files,
    }));
  };
  const handleFileSelect = (fileId) => {
    setSelectedFileIds((prevSelectedFileIds) => {
      if (prevSelectedFileIds.includes(fileId)) {
        // If already selected, remove it
        return prevSelectedFileIds.filter((id) => id !== fileId);
      } else {
        // Otherwise, add it
        return [...prevSelectedFileIds, fileId];
      }
    });
  };

  const handleFileUpload = async () => {
    const files = formData.fileInput;

    if (!files || files.length === 0) {
      console.error("No files selected for upload");
      // toast.error("Please select files to upload.");
      return;
    }

    const formDataToSend = new FormData();

    const fileArray = files.map((file) => file.name);

    formDataToSend.append("file_name", JSON.stringify(fileArray));

    files.forEach((file) => {
      formDataToSend.append("file_name", file);
    });

    try {
      const response = await fetch(`${baseUrl}/api/attachments`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Files uploaded successfully:", data);
        // toast.success("Files uploaded successfully!");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        // toast.error(
        //   `File upload failed: ${errorData.message || "Unknown error"}`
        // );
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      // toast.error("An error occurred while uploading the files.");
    }
  };

  const closeModal = () => {
    setShowPdfModal(false);
  };

  const handleNext = async () => {
    if (validateStep()) {
      setShowError(false);
      if (step < 6) {
        setStep(step + 1);
      } else if (step === 6) {
        const isSuccessful = await handleSubmit();
        if (isSuccessful) {
          setStep(7);
          // toast.success("Campaign created successfully!");
        } else {
          // toast.error("Campaign creation failed. Please try again.");
        }
      }
    } else {
      setShowError(true);
    }
  };
  const openGroupModal = () => {
    setShowGroupModal(true);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
  };
  const openPdfModal = () => {
    setShowPdfModal(true);
    fetchRecentFiles();
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateStep = () => {
    if (step === 1 && formData.campaignName.trim() === "") {
      // toast.error("Please enter a campaign name.");
      return false;
    }
    if (
      step === 2 &&
      (formData.selectedGroupId.trim() === "" ||
        formData.selectedGroupName.trim() === "")
    ) {
      // toast.error("Please select a group.");
      return false;
    }
    if (
      step === 3 &&
      (formData.campaignDate.trim() === "" ||
        formData.campaignTime.trim() === "")
    ) {
      // toast.error("Please enter both date and time.");
      return false;
    }
    if (step === 4 && formData.mailType === "") {
      // toast.error("Please select a mail type.");
      return false;
    }
    // if (step === 5 && formData.timeGapInMinutes === "") {
    //   // toast.error("Please fill in all email counts and time gaps.");
    //   return false;
    // }

    if (step === 6 && editorContent.trim() === "") {
      // toast.error("Please enter mail content.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGroupChange = (e) => {
    const selectedGroupId = e.target.value;
    const selectedGroup = groups.find(
      (group) => group?.id === parseInt(selectedGroupId)
    );
    const selectedGroupName = selectedGroup ? selectedGroup.name : "";
    setFormData({
      ...formData,
      selectedGroupId,
      selectedGroupName,
    });
  };

  const handleGroupUserChange = (index, e) => {
    const updatedGroupUsers = [...formData.groupUsers];
    updatedGroupUsers[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      groupUsers: updatedGroupUsers,
    });
  };

  const addGroupUser = () => {
    setFormData({
      ...formData,
      groupUsers: [...formData.groupUsers, { username: "", email: "" }],
    });
  };

  const deleteGroupUser = (index) => {
    const updatedGroupUsers = formData.groupUsers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      groupUsers: updatedGroupUsers,
    });
  };

  const handleMailTypeChange = (e) => {
    setFormData({
      ...formData,
      mailType: e.target.value,
      gmailOptions: e.target.value === "gmail" ? [] : formData.gmailOptions,
    });
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("Token is not available!");
      // toast.error("Authentication error. Please log in again.");
      return false;
    }

    const formDataToSend = new FormData();

    try {
      formDataToSend.append("name", formData.campaignName);
      formDataToSend.append("group_id", formData.selectedGroupId);
      formDataToSend.append("campaign_date", formData.campaignDate);
      formDataToSend.append("campaign_time", formData.campaignTime);
      formDataToSend.append("interval_time", formData.timeGapInMinutes);
      formDataToSend.append("interval_mails", emailCount);

      formDataToSend.append("subject", formData.subject);

      if (
        activeTab === "text" &&
        editorContent &&
        editorContent.trim() !== "" &&
        editorContent.trim() !== "<p><br></p>"
      ) {
        formDataToSend.append("message", editorContent);
      } else if (activeTab === "html" && template) {
        formDataToSend.append("message", template);
      } else if (activeTab === "htmlcode" && htmlCode) {
        formDataToSend.append("message", htmlCode);
      } else {
        console.error("No valid message content provided!");
        alert("Please provide a data atleast in one Tab");
        return;
      }

      //  formDataToSend.append("message", setTemplate);

      if (formData.selectedFileIds && formData.selectedFileIds.length > 0) {
        formDataToSend.append(
          "attachments",
          JSON.stringify(formData.selectedFileIds)
        );
      }

      if (formData.mailType === "gmail_auth") {
        formDataToSend.append("email_host", "gmail_auth");
        formDataToSend.append(
          "gmail_password",
          formData.gmailOptions.includes("App Password") ? "App Password" : ""
        );
      } else if (formData.mailType === "business") {
        formDataToSend.append("email_host", "email");
        formDataToSend.append("business_email", formData.subject);
      } else if (formData.mailType === "gmail_appPassword") {
        formDataToSend.append("email_host", "gmail_password");
        formDataToSend.append("business_email", formData.subject);
      } else {
        // toast.error("Please select a valid mail type.");
        return false;
      }

      if (!formData.campaignName.trim()) {
        return false;
      }
      if (!formData.selectedGroupId.trim()) {
        return false;
      }
      if (!formData.campaignDate.trim()) {
        return false;
      }
      if (!formData.campaignTime.trim()) {
        return false;
      }
      if (!formData.subject.trim()) {
        return false;
      }
      if (!editorContent.trim()) {
        return false;
      }

      const response = await fetch(`${baseUrl}/api/campaign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Campaign created successfully:", data);
        return true;
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error while creating campaign:", error);
      return false;
    }
  };

  useEffect(() => {
    console.log("Selected File IDs:", selectedFileIds);
  }, [selectedFileIds]);

  const handleCreateGroup = async () => {
    const groupData = new FormData();
    groupData.append("name", formData.groupName);

    if (useFileInput) {
      groupData.append("type", "file");
      if (formData.fileInput) {
        groupData.append("file", formData.fileInput);
      }
    } else {
      groupData.append("type", "groupUsers");
      groupData.append("groupUsers", JSON.stringify(formData.groupUsers));
    }
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/groups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: groupData,
      });

      if (response.ok) {
        const newGroupResponse = await response.json();
        const { groups } = newGroupResponse;
        if (groups) {
          setGroups(groups);
          const newGroup = groups[0];
          setFormData({
            ...formData,
            selectedGroupId: newGroup.id.toString(),
            selectedGroupName: newGroup.name,
          });
          setShowGroupModal(false);

          // toast.success("Group created successfully!");
        } else {
          // toast.error(
          //   "Group creation succeeded but response format was unexpected."
          // );
        }
      } else {
        const errorData = await response.json();
        // toast.error("Failed to create group: " + errorData.message);
      }
    } catch (error) {
      // toast.error(
      //   "An error occurred while creating the group. Please try again."
      // );
    }
  };
  const encodedMessage = encodeURIComponent(htmlMessage);
  return (
    <div className="card-container">
      <ToastContainer />
      <TransitionGroup>
        {step === 1 && (
          <CSSTransition key="step1" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <h5 className="card-title">Campaign Name</h5>
                <Form.Control
                  type="text"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleChange}
                  placeholder="Enter Campaign Name"
                  required
                  isInvalid={showError && formData.campaignName.trim() === ""}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a campaign name.
                </Form.Control.Feedback>
                <button onClick={handleNext} className="btn btn-next">
                  Next
                </button>
              </div>
            </div>
          </CSSTransition>
        )}

        {step === 2 && (
          <CSSTransition key="step2" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <h5 className="card-title">Select Group</h5>
                <Form.Control
                  as="select"
                  name="selectedGroupId"
                  value={formData.selectedGroupId}
                  onChange={handleGroupChange}
                  required
                  isInvalid={
                    showError && formData.selectedGroupId.trim() === ""
                  }>
                  <option value="">Select Group</option>
                  {groups && groups.length > 0 ? (
                    groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No Groups Available</option>
                  )}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a group.
                </Form.Control.Feedback>
                <button
                  onClick={openGroupModal}
                  className="btn btn-link mt-3 create-group-link"
                  style={{ color: "black", fontWeight: "bold" }}>
                  Create a new group
                </button>

                <button onClick={handleNext} className="btn btn-next">
                  Next
                </button>
                <button onClick={handleBack} className="btn btn-back">
                  Back
                </button>
              </div>
            </div>
          </CSSTransition>
        )}

        {step === 3 && (
          <CSSTransition key="step3" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <h5 className="card-title">Schedule</h5>
                <Form.Control
                  type="date"
                  name="campaignDate"
                  value={formData.campaignDate}
                  onChange={handleChange}
                  required
                  isInvalid={showError && formData.campaignDate.trim() === ""}
                />
                <Form.Control
                  type="time"
                  name="campaignTime"
                  value={formData.campaignTime}
                  onChange={handleChange}
                  required
                  isInvalid={showError && formData.campaignTime.trim() === ""}
                  className="mt-2"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter both date and time.
                </Form.Control.Feedback>
                <button onClick={handleNext} className="btn btn-next">
                  Next
                </button>
                <button onClick={handleBack} className="btn btn-back">
                  Back
                </button>
              </div>
            </div>
          </CSSTransition>
        )}

        {step === 4 && (
          <CSSTransition key="step4" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <h5 className="card-title">Type of Mail</h5>
                <Form.Check
                  type="radio"
                  label="Business Email"
                  name="mailType"
                  value="business"
                  checked={formData.mailType === "business"}
                  onChange={handleMailTypeChange}
                />
                <Form.Check
                  type="radio"
                  label="Gmail App Password"
                  name="mailType"
                  value="gmail_appPassword"
                  checked={formData.mailType === "gmail_appPassword"}
                  onChange={handleMailTypeChange}
                />
                <button onClick={handleNext} className="btn btn-next mt-3">
                  Next
                </button>
                <button onClick={handleBack} className="btn btn-back">
                  Back
                </button>
              </div>
            </div>
          </CSSTransition>
        )}
        {step === 5 && (
          <CSSTransition key="step5" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="card-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <h5 className="card-title">Dynamic Email Inputs</h5>
                <input
                  type="number"
                  placeholder="Enter how many emails to send..."
                  value={emailCount}
                  onChange={handleEmailCountChange}
                  style={{
                    marginBottom: "10px",
                    width: "100%",
                    padding: "10px",
                  }}
                />
                <select
                  className="dynamic-select-field"
                  value={selectedTimeGap}
                  onChange={(e) => handleTimeGapChange(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    width: "100%",
                    padding: "10px",
                  }}>
                  <option value="">Select Time Gap</option>
                  <option value="5 minutes">5 Minutes</option>
                  <option value="10 minutes">10 Minutes</option>
                  <option value="30 minutes">30 Minutes</option>
                  <option value="1 hour">1 Hour</option>
                  <option value="24 hours">24 Hours</option>
                  <option value="2 days">2 Days</option>
                </select>

                {/* Warning Message */}
                <div
                  style={{
                    backgroundColor: "#ffdddd",
                    border: "1px solid #f5c2c7",
                    color: "#842029",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}>
                  <strong>Warning:</strong> Due to email send limits, you must
                  choose how many emails <br />
                  will be sent at a time and the time delay between each batch.
                </div>

                <button onClick={handleNext} className="btn btn-next mt-3">
                  Next
                </button>
                <button onClick={handleBack} className="btn btn-back">
                  Back
                </button>
              </div>
            </div>
          </CSSTransition>
        )}
        {step === 6 && (
          <CSSTransition key="step5" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <div className="email-template">
                  <ToastContainer />
                  <div className="tabs">
                    <button
                      className={`tab ${activeTab === "text" ? "active" : ""}`}
                      onClick={() => handleTabClick("text")}>
                      Text
                    </button>
                    <button
                      className={`tab ${activeTab === "html" ? "active" : ""}`}
                      onClick={() => handleTabClick("html")}>
                      Template
                    </button>
                    <button
                      className={`tab ${
                        activeTab === "htmlcode" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("htmlcode")}>
                      HTML
                    </button>
                  </div>
                  <div className="content">
                    {activeTab === "text" ? (
                      <div className="text-layout">
                        {/* Bind Subject Input */}
                        <input
                          type="text"
                          placeholder="Subject...."
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className={`form-control ${
                            showError && !formData.subject.trim()
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {showError && !formData.subject.trim() && (
                          <div className="invalid-feedback">
                            Please provide a subject.
                          </div>
                        )}

                        {/* Bind ReactQuill for Message */}
                        <ReactQuill
                          value={editorContent}
                          onChange={setEditorContent}
                          placeholder="Message....."
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              ["bold", "italic", "underline", "strike"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link", "image"],
                              ["clean"],
                              ["code-block"],
                            ],
                          }}
                        />
                        {/* {showError && !editorContent.trim() && (
                          <div className="text-danger mt-2">
                            Please provide a message content.
                          </div>
                        )} */}

                        {/* PDF Upload */}
                        <button className="pdf-icon" onClick={openPdfModal}>
                          {/* <FaFilePdf style={{ color: "black" }} /> */}
                          <span
                            style={{
                              color: "black",
                              fontSize: "15px",
                              borderBottom: "3px solid black",
                              fontWeight: "bolder",
                            }}>
                            Attached Files
                          </span>
                        </button>

                        {/* Modal for PDF */}
                        {showPdfModal && (
                          <div className="modal2 overlay">
                            <div className="modal-content modal-large">
                              <button
                                className="close-modal"
                                onClick={closePdfModal}>
                                &times;
                              </button>
                              <div className="modal-tabs">
                                <button
                                  className={`modal-tab ${
                                    modalTab === "recent" ? "active" : ""
                                  }`}
                                  onClick={() => setModalTab("recent")}
                                  style={{ width: "100%", marginTop: "10px" }}>
                                  Recent Files
                                </button>
                                <button
                                  className={`modal-tab ${
                                    modalTab === "upload" ? "active" : ""
                                  }`}
                                  onClick={() => setModalTab("upload")}
                                  style={{ width: "100%" }}>
                                  Select from Computer
                                </button>
                              </div>
                              <div className="modal-body">
                                {modalTab === "recent" ? (
                                  <div className="recent-pdfs">
                                    {recentFiles.length > 0 ? (
                                      recentFiles.map((file) => (
                                        <div
                                          key={file.id}
                                          className={`recent-pdf-item ${
                                            selectedFileIds.includes(file.id)
                                              ? "selected"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleFileSelect(file.id)
                                          }>
                                          <FaFilePdf className="recent-pdf-item-icon" />
                                          {file.name}
                                        </div>
                                      ))
                                    ) : (
                                      <p>No recent files found.</p>
                                    )}
                                    <button
                                      onClick={handleSubmitSelectedFiles}
                                      className="btn btn-primary  mt-3"
                                      style={{ margin: "0 auto" }}>
                                      Submit Selected Files
                                    </button>
                                  </div>
                                ) : (
                                  <div className="upload-pdf">
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      multiple
                                      onChange={handleFileChange}
                                    />
                                    <button
                                      onClick={handleFileUpload}
                                      className="btn btn-primary">
                                      Upload File
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : activeTab === "html" ? (
                      <div className="html-layout">
                        <div className="editor-preview">
                          <div className="html-editor">
                            <input
                              type="text"
                              placeholder="HTML Subject...."
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                            />
                            <textarea
                              value={htmlMessage}
                              onChange={(e) => setHtmlMessage(e.target.value)}
                              placeholder="HTML Message....."
                              rows="10"
                            />
                          </div>
                          {/* <h3>HTML Preview</h3> */}
                          <div className="html-preview">
                            <iframe
                              src={`https://admin.emailai.world/template/${apiResponseToken}/${
                                selectedTemplate ? selectedTemplate.id : "1"
                              }`}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}></iframe>

                            {/* <div
                              className="preview-content"
                              dangerouslySetInnerHTML={{ __html: htmlMessage }}
                            /> */}
                          </div>
                        </div>
                        {/* <button className="submit-btn">Submit</button> */}
                        <div
                          className="templates-container"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            marginTop: "40px",
                          }}>
                          {/* <h3>Templates</h3> */}
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className="template-card"
                              style={{
                                cursor: "pointer",
                                border: "1px solid black",
                                width: "100px",
                                height: "100px",
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleTemplateClick(template)}>
                              <img
                                src={`https://admin.emailai.world/storage/${template.image}`}
                                alt={template.name}
                                className="template-image"
                                onClick={() => handleTemplateClick(template)}
                                style={{ width: "100px", height: "100px" }}
                              />
                              <div className="template-details">
                                {/* <h3>{template.name}</h3> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="third-tab-layout">
                        <input
                          type="text"
                          placeholder="HTML Subject...."
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          style={{
                            marginBottom: "15px",
                            width: "100%",
                            height: "40px",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                          }}
                        />
                        <textarea
                          placeholder="Enter HTML Code"
                          value={htmlCode}
                          onChange={handleHtmlInput} // Updates state and logs value
                          rows="10"
                          className="form-control"
                          style={{ marginBottom: "15px" }}></textarea>

                        {/* Live Preview */}
                        <div
                          className="html-preview"
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginTop: "15px",
                            minHeight: "200px",
                            background: "#f9f9f9",
                          }}
                          dangerouslySetInnerHTML={{ __html: htmlCode }}></div>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleNext} className="btn btn-next mt-3">
                  Next
                </button>
                <button onClick={handleBack} className="btn btn-back">
                  Back
                </button>
              </div>
            </div>
          </CSSTransition>
        )}

        {step === 7 && (
          <CSSTransition key="step6" timeout={500} classNames="slide">
            <div className="card-custom">
              <div className="card-body">
                <h5 className="card-title">Campaign Created</h5>
                <p>Thank you! Your campaign has been successfully created.</p>
                <p>Please wait while we process your request.</p>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>

      <Modal
        show={showGroupModal}
        onHide={closeGroupModal}
        className="modal-unique"
        style={{ backgroundColor: "white", color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <h6 style={{ color: "black" }}>Group Name</h6>
            </Form.Label>
            <Form.Control
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Enter Group Name"
              required
              isInvalid={!!validationError.groupName}
            />
            {validationError.groupName && (
              <Form.Control.Feedback type="invalid">
                {validationError.groupName}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Check
            type="radio"
            label="Upload File"
            name="inputType"
            id="fileOption"
            checked={useFileInput}
            onChange={() => setUseFileInput(true)}
          />
          <Form.Check
            type="radio"
            label="Add Users Manually"
            name="inputType"
            id="manualOption"
            checked={!useFileInput}
            onChange={() => setUseFileInput(false)}
          />
          <hr />
          {useFileInput ? (
            <Form.Group>
              <Form.Label>Choose file (CSV only)</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
              />
              <Form.Text className="text-muted">
                Please upload a CSV file.
              </Form.Text>
            </Form.Group>
          ) : (
            formData.groupUsers.map((user, index) => (
              <div key={index} className="mb-3 user-input-row">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  value={user.username}
                  onChange={(e) => handleGroupUserChange(index, e)}
                  className="mb-2"
                  isInvalid={!!validationError[`username_${index}`]}
                />
                {validationError[`username_${index}`] && (
                  <Form.Control.Feedback type="invalid">
                    {validationError[`username_${index}`]}
                  </Form.Control.Feedback>
                )}
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={user.email}
                  onChange={(e) => handleGroupUserChange(index, e)}
                  isInvalid={!!validationError[`email_${index}`]}
                />
                {validationError[`email_${index}`] && (
                  <Form.Control.Feedback type="invalid">
                    {validationError[`email_${index}`]}
                  </Form.Control.Feedback>
                )}
                <Button
                  variant="outline-danger"
                  onClick={() => deleteGroupUser(index)}
                  className="delete-user-btn">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            ))
          )}
          {!useFileInput && (
            <Button
              variant="outline-secondary"
              onClick={addGroupUser}
              className="w-100 mt-3">
              <FontAwesomeIcon icon={faPlus} /> Add More
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeGroupModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardRow;
