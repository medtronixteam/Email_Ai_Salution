import React, { useState } from "react";
import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../config";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const baseUrl = config.baseUrl;

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Login successful!");

        login(data.token);

        navigate("/dashboard/setting");
      } else {
        const data = await response.json();
        if (data.message === "User does not exist") {
          toast.error("User does not exist. Please sign up first.");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login-container">
      {/* ToastContainer for notifications */}
      <ToastContainer />
      <div className="login-card">
        <div className="avatar">
          <FaUserAlt className="user-icon" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field-wrapper">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              className="input-field password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}></span>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
