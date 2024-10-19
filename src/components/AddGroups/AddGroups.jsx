import React, { useState } from "react";
import { Modal, Button, Form, Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddGroups.css";
import config from "../../config";
import { useAuth } from "../../contexts/AuthProvider";
const AddGroups = ({ groups, setGroups }) => {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [useFileInput, setUseFileInput] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([{ username: "", email: "" }]);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [viewedUsers, setViewedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowModal = (group) => {
    setSelectedGroup(group);
    setGroupName(group === "New Group" ? "" : group?.name);
    setShowModal(true);
  };
  // console.log("Token is here.", token);
  const handleCloseModal = () => {
    setShowModal(false);
    setUseFileInput(false);
    setGroupUsers([{ username: "", email: "" }]);
    setFileInput(null);
  };

  const handleGroupUserChange = (index, e) => {
    const updatedGroupUsers = groupUsers.map((user, i) =>
      i === index ? { ...user, [e.target.name]: e.target.value } : user
    );
    setGroupUsers(updatedGroupUsers);
  };

  const addGroupUser = () => {
    setGroupUsers((prevUsers) => [...prevUsers, { username: "", email: "" }]);
  };

  const deleteGroupUser = (index) => {
    setGroupUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };
  // console.log("Token is here.", token);
  const handleSaveGroup = async () => {
    if (!groupName || (useFileInput && !fileInput)) {
      setTimeout(() => {
        toast.error("Please provide a group name and a file if uploading.");
      }, 100);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", groupName);

    if (useFileInput) {
      formData.append("type", "file");
      formData.append("file", fileInput);
    } else {
      formData.append("type", "groupUsers");
      formData.append("groupUsers", JSON.stringify(groupUsers));
    }
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/groups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        if (selectedGroup === "New Group" && groupName) {
          setGroups((prevGroups) => [
            ...prevGroups,
            { name: groupName, users: groupUsers },
          ]);
        } else if (selectedGroup && selectedGroup !== "New Group") {
          const updatedGroups = groups.map((group) =>
            group.name === selectedGroup.name
              ? { ...group, users: groupUsers }
              : group
          );
          setGroups(updatedGroups);
        }
        setTimeout(() => {
          toast.success("Group created/updated successfully!");
        }, 100);
      } else {
        setTimeout(() => {
          toast.error(data.message || "Failed to add users.");
        }, 100);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An error occurred. Please try again.");
      }, 100);
    } finally {
      setLoading(false);
    }

    handleCloseModal();
  };
  const baseUrl = config.baseUrl;
  const handleViewUsers = async (group) => {
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/addusers/${group.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data?.data) {
        setViewedUsers(data.data);
        setViewingGroup(group);
      } else {
        setTimeout(() => {
          toast.error("Failed to fetch users.");
        }, 100);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An error occurred while fetching users.");
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGroups = () => {
    setViewingGroup(null);
    setViewedUsers([]);
  };

  const handleDeleteGroup = async (groupId) => {
    setLoading(true);
    const baseUrl = config.baseUrl;
    try {
      const response = await fetch(`${baseUrl}/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
        setTimeout(() => {
          toast.success("Group deleted successfully.");
        }, 100);
      } else {
        const data = await response.json();
        setTimeout(() => {
          toast.error(data.message || "Failed to delete group.");
        }, 100);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An error occurred. Please try again.");
      }, 100);
    } finally {
      setLoading(false);
    }
  };
  // };
  // console.log("Token is here.", token);
  return (
    <div
      className="add-groups-container"
      style={{
        paddingTop: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: " 0 1px 2px rgba(0, 0, 0, 0.6)",
      }}>
      <ToastContainer />

      <div className="header-container">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
        {!viewingGroup && (
          <span
            className="create-groups-button"
            onClick={() => handleShowModal("New Group")}>
            Create New Group
          </span>
        )}
      </div>

      {!viewingGroup ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Group Name</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups && groups.length > 0 ? (
              groups.map((group, index) => (
                <tr key={index}>
                  <td>{group.name}</td>
                  <td className="text-end">
                    <Button
                      variant="info"
                      className="me-22"
                      onClick={() => handleViewUsers(group)}>
                      View Users
                    </Button>
                    <Button
                      variant="primary"
                      className="add-user-button"
                      onClick={() => handleShowModal(group)}>
                      Add User
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteGroup(group.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No groups found.</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <Card className="user-list-card">
          <Card.Header>
            <h2>Users in {viewingGroup.name}</h2>
          </Card.Header>
          <Card.Body>
            {viewedUsers.length > 0 ? (
              <Table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {viewedUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No users found in this group.</p>
            )}
            <Button
              variant="secondary"
              onClick={handleBackToGroups}
              className="back-button"
              style={{ width: "auto", padding: "10px" }}>
              Back to Groups
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Modal for Adding Users */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-unique">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGroup === "New Group"
              ? "Create New Group"
              : `Add User to ${selectedGroup?.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {selectedGroup === "New Group" && (
              <Form.Group className="mb-3">
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Check
              type="radio"
              label="Upload File"
              name="inputType"
              id="fileOption"
              checked={useFileInput}
              onChange={() => setUseFileInput(true)}
              className="mt-3"
            />
            <Form.Check
              type="radio"
              label="Add Users Manually"
              name="inputType"
              id="manualOption"
              checked={!useFileInput}
              onChange={() => setUseFileInput(false)}
              className="mt-2"
            />
            {useFileInput ? (
              <Form.Group className="mt-3">
                <Form.Label>Upload File (CSV only)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFileInput(e.target.files[0])}
                />
              </Form.Group>
            ) : (
              groupUsers.map((user, index) => (
                <div key={index} className="user-input-row mb-3">
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={user.username}
                      onChange={(e) => handleGroupUserChange(index, e)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={user.email}
                      onChange={(e) => handleGroupUserChange(index, e)}
                    />
                  </Form.Group>
                  <Button
                    variant="danger"
                    className="mt-3 delete-button"
                    onClick={() => deleteGroupUser(index)}>
                    Delete
                  </Button>
                </div>
              ))
            )}
            {!useFileInput && (
              <Button
                variant="info"
                className="mt-3 add-user-input"
                onClick={addGroupUser}>
                Add User
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveGroup}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddGroups;
