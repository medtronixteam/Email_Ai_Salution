import React from "react";
import heroImage from "../../image/Frame.jpg";
import "./HeroSection.css";
const HeroSection = () => {
  return (
    <section className="hero pt-5 text-white">
      <div className="header-section hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 mt-lg-0 mt-3 order-lg-1 order-2 mb-lg-0 mb-3">
              <div className="header-content text-sm-start text-center">
                <h1>
                  Scaled outreach with{" "}
                  <span style={{ color: "#a64eff" }}>unlimited</span> email
                  accounts
                </h1>
                <p>
                  Mails.ai helps you run smart, automated, AI-driven email
                  campaigns to grow your business.
                </p>
                <button className="btn btn-custom rounded-pill px-4 fw-bold">
                  Start For Free
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-7 order-lg-2 order-1">
              <img
                src={heroImage}
                alt="Mockup Image"
                className="header-image img-fluid"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
