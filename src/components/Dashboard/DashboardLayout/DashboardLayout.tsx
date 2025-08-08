"use client";

import type React from "react";
import { User, Settings } from "lucide-react";
import { useAuthContext } from "../../../contexts/useAuthContext";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuthContext();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="header-right">
              <div className="user-info">
                <User size={20} />
                <span>{user?.name}</span>
              </div>

              <button
                className="header-button"
                onClick={() => alert("Configurações em desenvolvimento")}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
