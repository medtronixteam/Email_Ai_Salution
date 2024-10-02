import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import emailLogo from "../../../image/emailLogo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header" style={{ backgroundColor: "black" }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container-fluid">
            <Link className="navbar-brand text-white fw-bold" to="/">
              <img src={emailLogo} alt="Email-Ai" />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link text-white" href="/dashboard">
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/dashboard/campaign">
                    Campaigns
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/dashboard/groups">
                    Groups
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/dashboard/setting">
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn btn-custom dropdown-toggle"
                    style={{ backgroundColor: "black", color: "white" }}
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="dropdownMenuButton">
                    {/* <li>  
                       <Link className="dropdown-item" to="/dashboard/setting">
                        <FontAwesomeIcon icon={faCog} className="me-2" />{" "}
                        Settings
                      </Link> 
                    </li> */}
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
 