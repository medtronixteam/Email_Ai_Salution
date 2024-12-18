import React from "react";
import { Link } from "react-router-dom";
import "./Setting.css";
import { FaLock, FaClock, FaGoogle, FaEnvelope } from "react-icons/fa";

const Setting = () => {
  return (
    <div className="settings-container">
      <div className="setting-card">
        <Link to="/dashboard/change-password" className="setting-link">
          <FaLock className="card-icon" />
          <h3>Change Password</h3>
        </Link>
      </div>
      <div className="setting-card">
        <Link to="/dashboard/change-timezone" className="setting-link">
          <FaClock className="card-icon" />
          <h3>Change Time Zone</h3>
        </Link>
      </div>
      <div className="setting-card">
        <Link to="/dashboard/AuthOptions" className="setting-link">
          <FaGoogle className="card-icon" />
          <h3>Link with Gmail</h3>
        </Link>
      </div>
      <div className="setting-card">
        <Link to="/dashboard/BusinessEmailForm" className="setting-link">
          <FaEnvelope className="card-icon" />
          <h3>Link with Email</h3>
        </Link>
      </div>
    </div>
  );
};

export default Setting;
