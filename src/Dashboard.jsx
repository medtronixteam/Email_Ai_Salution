import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Dashboard/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import { useAuth } from "./contexts/AuthProvider";
import campaign from "./image/campaign.png";
import People from "./image/people.png";
import time from "./image/time.png";
import contact from "./image/contacts.png";
import completed from "./image/completed.png";
import start from "./image/start.png";
import failed from "./image/failed.png";
import config from "./config";

const Dashboard = () => {
  const { token } = useAuth();
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/dashboard";

  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        setCampaignData(result);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false); // Stop loading once API call is complete
      }
    };

    fetchCampaignData();
  }, [token]);

  return (
    <div className="dashboard-container">
      <Navbar />
      <ToastContainer />

      {loading ? ( // Show loader while loading is true
        <div className="loader"></div>
      ) : (
        isDashboardRoute &&
        campaignData && (
          <>
            <div className="cards-container">
              <div className="card">
                <img
                  src={campaign}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Total Campaigns"
                />
                <h6>Total Campaigns</h6>
                <p className="count">{campaignData.total_campaigns}</p>
              </div>
              <div className="card">
                <img
                  src={People}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Total Groups"
                />
                <h6>Total Groups</h6>
                <p className="count">{campaignData.total_groups}</p>
              </div>
              <div className="card">
                <img
                  src={contact}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Total Contacts"
                />
                <h6>Total Contacts</h6>
                <p className="count">{campaignData.total_contacts}</p>
              </div>
              <div className="card">
                <img
                  src={completed}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Completed"
                />
                <h6>Completed Campaigns</h6>
                <p className="count">{campaignData.completed_campaigns}</p>
              </div>
              <div className="card">
                <img
                  src={time}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Pending"
                />
                <h6>Pending Campaigns</h6>
                <p className="count">{campaignData.pending_campaigns}</p>
              </div>
              <div className="card">
                <img
                  src={failed}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Failed"
                />
                <h6>Failed Campaigns</h6>
                <p className="count">{campaignData.failed_campaigns || 0}</p>
              </div>
              <div className="card">
                <img
                  src={start}
                  style={{ width: "110px", margin: "0 auto" }}
                  alt="Started"
                />
                <h6>Started Campaigns</h6>
                <p className="count">{campaignData.started_campaigns}</p>
              </div>
            </div>
            <div className="table-container">
              {/* Additional table or content can go here */}
            </div>
          </>
        )
      )}
      <Outlet />
    </div>
  );
};

export default Dashboard;
