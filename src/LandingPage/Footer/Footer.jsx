import React from "react";
import emailLogo from "../../image/emailLogo.png";
const Footer = () => {
  return (
    <footer
      className="footer p-lg-5 p-2"
      style={{ backgroundColor: "black", color: "white" }}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <a className="footer-logo text-white fw-bold" href="#">
              <img
                src={emailLogo}
                alt="Email Logo"
                style={{ width: "150px" }}
              />
            </a>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mt-lg-0 mt-5">
            <h3>RESOURCES</h3>
            <ul className="list">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Affiliate Program</a>
              </li>
              <li>
                <a href="#">Terms to Services</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Refund Policy</a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mt-lg-0 mt-5">
            <h3>SUPPORT</h3>
            <ul className="list">
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Road Map</a>
              </li>
              <li>
                <a href="#">Feature Request</a>
              </li>
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">Status</a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="text-center mb-0">
          &#169; All rights reserved by <span> Mails.ai</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
