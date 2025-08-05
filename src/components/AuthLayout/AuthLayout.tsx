import "./AuthLayout.css";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">{children}</div>
    </div>
  );
};

export default AuthLayout;
