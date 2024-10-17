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
import config from "../../../config.js";
const CardRow = () => {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState([]);
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
  });
  const [editorContent, setEditorContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [useFileInput, setUseFileInput] = useState(false);
  const [validationError, setValidationError] = useState({});
  const baseUrl = config.baseUrl;
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
          toast.info("No groups available.");
        }
      } catch (error) {
        console.error("Error during API call:", error);
        toast.error("Failed to fetch groups. Please try again.");
      }
    };

    if (token) {
      fetchGroups();
    }
  }, [token]);

  const handleNext = async () => {
    if (validateStep()) {
      setShowError(false);
      if (step < 5) {
        setStep(step + 1);
      } else if (step === 5) {
        const isSuccessful = await handleSubmit();
        if (isSuccessful) {
          setStep(6);
          toast.success("Campaign created successfully!");
        } else {
          toast.error("Campaign creation failed. Please try again.");
        }
      }
    } else {
      setShowError(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateStep = () => {
    if (step === 1 && formData.campaignName.trim() === "") {
      toast.error("Please enter a campaign name.");
      return false;
    }
    if (
      step === 2 &&
      (formData.selectedGroupId.trim() === "" ||
        formData.selectedGroupName.trim() === "")
    ) {
      toast.error("Please select a group.");
      return false;
    }
    if (
      step === 3 &&
      (formData.campaignDate.trim() === "" ||
        formData.campaignTime.trim() === "")
    ) {
      toast.error("Please enter both date and time.");
      return false;
    }
    if (step === 4 && formData.mailType === "") {
      toast.error("Please select a mail type.");
      return false;
    }
    if (step === 5 && editorContent.trim() === "") {
      toast.error("Please enter mail content.");
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      fileInput: e.target.files[0],
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
      toast.error("Authentication error. Please log in again.");
      return false;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.campaignName);
    formDataToSend.append("group_id", formData.selectedGroupId);
    formDataToSend.append("campaign_date", formData.campaignDate);
    formDataToSend.append("campaign_time", formData.campaignTime);
    formDataToSend.append("subject", formData.subject);

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
      toast.error("Please select a valid mail type.");
      return false;
    }

    const plainTextMessage = stripHtmlTags(editorContent);

    formDataToSend.append("message", plainTextMessage);

    if (formData.fileInput) {
      formDataToSend.append("file", formData.fileInput);
    }
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/campaign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.status === 200) {
        const data = await response.json();
        return true;
      } else {
        const errorData = await response.json();
        toast.error("Failed to create campaign: " + errorData.message);
        return false;
      }
    } catch (error) {
      console.error("Error while creating campaign:", error);
      toast.error("An error occurred. Please try again.");
      return false;
    }
  };

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

          setShowModal(false);
          toast.success("Group created successfully!");
        } else {
          toast.error(
            "Group creation succeeded but response format was unexpected."
          );
        }
      } else {
        const errorData = await response.json();
        toast.error("Failed to create group: " + errorData.message);
      }
    } catch (error) {
      toast.error(
        "An error occurred while creating the group. Please try again."
      );
    }
  };

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
                  onClick={() => setShowModal(true)}
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
                <h5 className="card-title">Mail Content</h5>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter Email Subject"
                  className="mb-3"
                />
                <ReactQuill
                  theme="snow"
                  value={editorContent}
                  onChange={setEditorContent}
                  placeholder="Type your content here..."
                  spellCheck={true}
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

        {step === 6 && (
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
        show={showModal}
        onHide={() => setShowModal(false)}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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
