import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import emailLogo from "../../image/emailLogo.png";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header" style={{ backgroundColor: "black" }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container-fluid">
            <a className="navbar-brand text-white fw-bold" href="#">
              <img src={emailLogo} alt="EmailAI" />
            </a>
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
              <div className="ms-lg-auto d-flex flex-column flex-lg-row align-items-center">
                {/* <a href="#">
                  <FontAwesomeIcon icon={faUserCircle} /> Log in
                </a> */}
                <Link
                  to="/login"
                  className="btn btn-custom rounded-pill px-4 fw-bold
                  mt-2">
                  {" "}
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
