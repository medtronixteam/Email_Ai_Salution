import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Subscription.css";
import config from "../../config.js";
import { useAuth } from "../../contexts/AuthProvider.js";

const ToggleSwitch = ({ onToggle, defaultState }) => {
  const [isYearly, setIsYearly] = useState(defaultState === "year");

  const handleToggle = () => {
    const newState = isYearly ? "month" : "year";
    setIsYearly(!isYearly);
    onToggle(newState);
  };

  return (
    <div className="toggle-switch" onClick={handleToggle}>
      <div className={`switch ${isYearly ? "yearly" : "monthly"}`}>
        <span>{isYearly ? "Yearly" : "Monthly"}</span>
      </div>
    </div>
  );
};
const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState({
    Pro: "month",
    Premium: "month",
  });
  const [loading, setLoading] = useState(false);

  const baseUrl = config.baseUrl;
  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [baseUrl, token]);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/plans`,
        {
          id: plan.id,
          plan_name: plan.plan_name,
          plan_duration: plan.plan_duration,
          plan_price: plan.plan_price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setActivePlan(plan.id);
        alert("Subscription successful!");
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    }

    setLoading(false);
  };

  const renderPlanFeatures = (planName, duration) => {
    if (planName === "Free") {
      return (
        <>
          <li>Access basic features</li>
          <li>Community support</li>
          <li>Perfect for beginners</li>
        </>
      );
    }

    if (planName === "Pro") {
      if (duration === "month") {
        return (
          <>
            <li>Advanced features unlocked</li>
            <li>24/7 priority support</li>
            <li>Unlimited resource access</li>
          </>
        );
      } else {
        return (
          <>
            <li>All Pro features included</li>
            <li>Save 20% annually</li>
            <li>Exclusive discounts</li>
          </>
        );
      }
    }

    if (planName === "Premium") {
      if (duration === "month") {
        return (
          <>
            <li>All Pro features plus:</li>
            <li>Personalized support</li>
            <li>Monthly exclusive events</li>
          </>
        );
      } else {
        return (
          <>
            <li>All Premium features included</li>
            <li>Save 30% annually</li>
            <li>VIP community access</li>
          </>
        );
      }
    }
  };

  return (
    <div className="container mt-5 subscription-card">
      <h3 className="subscribe-heading">
        Choose Your Perfect Subscription Plan
      </h3>
      <div className="row">
        {plans
          .filter((plan) => plan.plan_name === "Free")
          .map((plan) => (
            <div
              className={`col-md-4 ${
                activePlan === plan.id ? "active-plan" : ""
              }`}
              key={plan.id}>
              <div className="card">
                <h3>{plan.plan_name} Plan</h3>
                <p>
                  <strong>Duration:</strong> Monthly
                </p>
                <p>
                  <strong>Price:</strong> ${plan.plan_price}
                </p>
                <ul className="features">{renderPlanFeatures("Free")}</ul>
                <button
                  className="Subscribe-button"
                  onClick={() => handleSubscribe(plan)}>
                  {activePlan === plan.id ? "Active" : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        {["Pro", "Premium"].map((planName) => {
          const duration = selectedDuration[planName];
          const plan = plans.find(
            (p) => p.plan_name === planName && p.plan_duration === duration
          );

          if (!plan) return null;

          return (
            <div
              className={`col-md-4 ${
                activePlan === plan.id ? "active-plan" : ""
              }`}
              key={planName}>
              <div className="card">
                <h3>{planName} Plan</h3>
                <p>
                  <strong>Duration:</strong>{" "}
                  {duration.charAt(0).toUpperCase() + duration.slice(1)}
                </p>
                <ToggleSwitch
                  defaultState={duration}
                  onToggle={(newDuration) => {
                    setSelectedDuration((prev) => ({
                      ...prev,
                      [planName]: newDuration,
                    }));
                  }}
                />
                <p>
                  <strong>Price:</strong> ${plan.plan_price}
                </p>
                <ul className="features">
                  {renderPlanFeatures(planName, duration)}
                </ul>
                <button
                  className="Subscribe-button"
                  onClick={() => handleSubscribe(plan)}>
                  {activePlan === plan.id ? "Active" : "Subscribe"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
