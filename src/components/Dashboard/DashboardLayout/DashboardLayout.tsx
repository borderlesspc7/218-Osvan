"use client";

import type React from "react";
import { LogOut, Building2, User, Settings } from "lucide-react";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { useNavigation } from "../../../hooks/useNavigation";
import "./DashboardLayout.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthContext();
  const { navigateTo } = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header-layout">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Building2 size={24} />
              <span>TaxManager</span>
            </div>
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

            <button
              className="header-button logout-button"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
