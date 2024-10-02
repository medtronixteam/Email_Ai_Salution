import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUserEdit,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

const AllInclusive = () => {
  return (
    <section className="all-inclusive p-lg-5 p-2">
      <div className="container text-center">
        <h1>
          All-Inclusive for a <br />
          Single Fixed Price
        </h1>
        <p className="para">
          With <span className="span"> everything included</span>, you'll never
          need to go anywhere else for your email outreach. Seriously.
        </p>
        <div className="row mt-5 mb-5">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="custom-card p-lg-4 p-2">
              <FontAwesomeIcon icon={faUserCheck} className="custom-icon" />
              <h5>Email Verification</h5>
              <p>
                Maximize deliverability and engagement with real-time email
                verification.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mt-md-0 mt-3">
            <div className="custom-card p-lg-4 p-2">
              <FontAwesomeIcon icon={faUserEdit} className="custom-icon" />
              <h5>Unlimited Accounts</h5>
              <p>
                Scale effortlessly with the flexibility to connect endless email
                accounts.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mt-lg-0 mt-3">
            <div className="custom-card p-lg-4 p-2">
              <FontAwesomeIcon icon={faDatabase} className="custom-icon" />
              <h5>Unlimited Total Contacts</h5>
              <p>
                Upload your entire database of leads for endless opportunities
                to connect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllInclusive;
