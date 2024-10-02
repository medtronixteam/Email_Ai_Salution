import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./LinkEmailAccounts.css";
import { Link } from "react-router-dom";

const LinkEmailAccounts = () => {
  return (
    <div className="email-link-section">
      <Link to="/dashboard/AuthOptions">
        <div className="email-link-box">
          <FontAwesomeIcon icon={faGoogle} className="email-icon" />
          <span>Link with Gmail</span>
        </div>
      </Link>
      {/* <div className="email-link-box">
        <FontAwesomeIcon icon={faMicrosoft} className="email-icon" />
        <span>Link with Outlook</span>
      </div> */}
      <Link to="/dashboard/BusinessEmailForm">
        <div className="email-link-box">
          <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
          <span>Link with Business Email</span>
        </div>
      </Link>
    </div>
  );
};

export default LinkEmailAccounts;
