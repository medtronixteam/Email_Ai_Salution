import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EmailTemplates.css";
import { FaFilePdf } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthProvider";
import config from "../../config";

const EmailTemplates = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [textMessage, setTextMessage] = useState("");
  const [htmlMessage, setHtmlMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("recent");
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const baseUrl = config.baseUrl;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
      toast.error("Failed to fetch recent files.");
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    fetchRecentFiles();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file_name", file.name); // Include the file name
    formData.append("file", file); // Include the file itself

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/attachments`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setShowModal(false);
        fetchRecentFiles();
      } else {
        toast.error("File upload failed. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
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
          HTML
        </button>
      </div>
      <div className="content">
        {activeTab === "text" ? (
          <div className="text-layout">
            <input type="text" placeholder="Subject...." />
            <ReactQuill
              value={textMessage}
              onChange={setTextMessage}
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
            <button className="pdf-icon" onClick={openModal}>
              Click Button
            </button>

            {showModal && (
              <div className="modal overlay">
                <div className="modal-content modal-large">
                  <button className="close-modal" onClick={closeModal}>
                    &times;
                  </button>
                  <div className="modal-tabs">
                    <button
                      className={`modal-tab ${
                        modalTab === "recent" ? "active" : ""
                      }`}
                      onClick={() => setModalTab("recent")}>
                      Recent PDFs
                    </button>
                    <button
                      className={`modal-tab ${
                        modalTab === "upload" ? "active" : ""
                      }`}
                      onClick={() => setModalTab("upload")}>
                      Select from Computer
                    </button>
                  </div>
                  <div className="modal-body">
                    {modalTab === "recent" ? (
                      <div className="recent-pdfs">
                        <h4>Recent PDFs</h4>
                        {loading ? (
                          <p>Loading...</p>
                        ) : recentFiles.length > 0 ? (
                          <ul>
                            {recentFiles.map((file) => (
                              <li key={file.id}>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer">
                                  {file.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No recent files found.</p>
                        )}
                      </div>
                    ) : (
                      <div className="upload-pdf">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="html-layout">
            <div className="editor-preview">
              <div className="html-editor">
                <input type="text" placeholder="HTML Subject...." />
                <textarea
                  value={htmlMessage}
                  onChange={(e) => setHtmlMessage(e.target.value)}
                  placeholder="HTML Message....."
                  rows="10"
                />
              </div>

              <div className="html-preview">
                <h3>HTML Preview</h3>
                <div
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: htmlMessage }}
                />
              </div>
            </div>
            <button className="submit-btn">Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplates;
