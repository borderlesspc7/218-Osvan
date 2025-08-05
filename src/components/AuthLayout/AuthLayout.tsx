import "./AuthLayout.css";
import React from "react";
import { Footer } from "borderless";
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="auth-page">
        <div className="auth-container">{children}</div>
      </div>
      <div className="footer">
        <Footer backgroundColor="transparent" />
      </div>
    </>
  );
};

export default AuthLayout;
