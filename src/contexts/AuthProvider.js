import React, { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (authToken) => {
    setIsAuthenticated(true);
    setToken(authToken);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
