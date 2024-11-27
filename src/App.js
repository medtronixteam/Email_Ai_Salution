import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/signUp/SignUp.jsx";
import CardRow from "./components/Dashboard/Card/CardRow.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./LandingPage/LandingPage.jsx";
import Dashboard from "./Dashboard.jsx";
import AddGroups from "./components/AddGroups/AddGroups.jsx";
import LinkEmailAccounts from "./components/LinkEmailAccounts/LinkEmailAccounts.jsx";
import "./App.css";
import AuthOptions from "./components/AuthOptions/AuthOptions.jsx";
import BusinessEmailForm from "./components/BusinessEmailForm/BusinessEmailForm.jsx";
import Campaign from "./components/Dashboard/Campaign/Campaign.jsx";
import config from "./config";
import ProfileSetting from "./components/ProfileSetting/ProfileSetting.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import EmailTemplates from "./components/Template/EmailTemplates.jsx";
import CustomerSupport from "./components/CustomerSupportChat/CustomerSupportChat.jsx";
import Subscription from "./components/Subscrption/Subscription.jsx";
import SignupPage from "./components/SignupPage/SignupPage.js";
const App = () => {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${config.baseUrl}/api/groups`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGroups(data.data || []);
        } else {
          console.error("Failed to fetch groups:", response.statusText);
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    fetchGroups();
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}>
          <Route
            path="create-campaign"
            element={<CardRow groups={groups} setGroups={setGroups} />}
          />
          <Route path="customer-support" element={<CustomerSupport />} />{" "}
          <Route path="subscription" element={<Subscription />} />
          <Route path="Profilesetting" element={<ProfileSetting />} />
          <Route
            path="groups"
            element={
              <AddGroups groups={groups} token={token} setGroups={setGroups} />
            }
          />
          <Route path="campaign" element={<Campaign />} />
          <Route path="setting" element={<LinkEmailAccounts />} />
          <Route path="AuthOptions" element={<AuthOptions />} />
          <Route path="BusinessEmailForm" element={<BusinessEmailForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
