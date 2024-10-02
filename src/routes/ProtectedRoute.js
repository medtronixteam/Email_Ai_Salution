import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/dashboard/setting" />;
};

export default ProtectedRoute;
