import React from "react";
import card1 from "../../image/card-1.webp";
import card2 from "../../image/card-2.webp";
import card3 from "../../image/card-3.webp";

const AutomateEmails = () => {
  return (
    <section
      className="automate-emails p-lg-5 p-2"
      style={{ backgroundColor: "#f5f5f5" }}>
      <div className="container text-center">
        <h1 className="mt-4" style={{ fontWeight: 750 }}>
          Automate Emails <br />
          and Follow-Ups
        </h1>
        <div className="row mt-5">
          <div className="col-12 col-lg-4">
            <img src={card1} alt="" className="img-fluid" />
            <h4 className="mt-2 fw-bold">AI Email Writer</h4>
            <p style={{ lineHeight: "25px", fontWeight: 400 }}>
              Our AI email writer will automatically write and setup your email
              campaigns for you. Just provide a few details and our AI will do
              the rest.
            </p>
          </div>
          <div className="col-12 col-lg-4 mt-lg-0 mt-3">
            <img src={card2} alt="" className="img-fluid" />
            <h4 className="mt-2 fw-bold">Unlimited Email Accounts</h4>
            <p style={{ lineHeight: "25px", fontWeight: 400 }}>
              Connect unlimited email accounts. We don't charge per inbox, so
              you can connect as many email accounts as you want.
            </p>
          </div>
          <div className="col-12 col-lg-4 mt-lg-0 mt-3">
            <img src={card3} alt="" className="img-fluid" />
            <h4 className="mt-1 fw-bold">Automation</h4>
            <p style={{ lineHeight: "25px", fontWeight: 400 }}>
              Upload and verify all your contacts, use our AI to setup watch all
              the responses flow to your inbox as mails are sent everyday on
              your behalf.
            </p>
          </div>
        </div>
        <button className="btn btn-primary py-3 px-5 rounded-pill fw-bold text-uppercase mt-4">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default AutomateEmails;
