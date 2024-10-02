import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import optimizeImage from "../../image/mails_ai-home-feature-optimization.webp";

const OptimizeSection = () => {
  return (
    <section
      className="optimize-section p-lg-5 p-3"
      style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        <div className="row mt-5 align-items-center">
          <div
            className="col-12 col-lg-5 position-relative"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
            }}>
            <img src={optimizeImage} alt="" className="img-fluid" id="image" />
          </div>
          <div className="col-12 col-lg-6 ml-4 ms-lg-5 mt-lg-0 mt-5">
            <h1 style={{ fontSize: "40px", fontWeight: 750 }}>
              <span>AI Optimized</span> for Increased deliverability and replies
            </h1>
            <p>
              Safely send <span> thousands of emails</span> daily while
              maintaining your sender reputation. Simply connect your sender
              accounts and let our AI automatically optimize email sending
              patterns.
            </p>
            <div className="row mt-4">
              <div className="col-lg-6 d-flex">
                <FontAwesomeIcon icon={faUserCircle} className="fa-2x" />
                <div className="ms-3">
                  <h5 className="fw-bold">Save Time</h5>
                  <p>
                    Save time by automating emailing campaigns. So you can focus
                    on the fun stuff - closing deals.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 d-flex">
                <FontAwesomeIcon icon={faCircleCheck} className="fa-2x" />
                <div className="ms-3">
                  <h5 className="fw-bold">More Revenue</h5>
                  <p>
                    It's simple. Maximize your outreach campaigns to increase
                    replies and close more deals.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button className="btn btn-primary py-3 px-5 rounded-pill fw-bold text-uppercase mt-4">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptimizeSection;
