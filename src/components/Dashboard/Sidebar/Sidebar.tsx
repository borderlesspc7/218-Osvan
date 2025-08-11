"use client";

import { NavLink } from "react-router-dom";
import { Building2, User, FileText, Clock, LogOut } from "lucide-react";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { useNavigation } from "../../../hooks/useNavigation";
import { PATHS } from "../../../routes/paths";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const { logout } = useAuthContext();
  const { navigateTo } = useNavigation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Painel do cliente",
      to: PATHS.DASHBOARD,
      icon: <User size={20} />,
    },
    {
      id: "certificates",
      label: "Consulta de certidões",
      to: PATHS.CERTIFICATES,
      icon: <FileText size={20} />,
    },
    {
      id: "negotiation",
      label: "Simulação e Negociação",
      to: PATHS.NEGOTIATION,
      icon: <Clock size={20} />,
    },
    // Comentando rotas que ainda não existem
    // {
    //   id: "business-rules",
    //   label: "Regras de negócio",
    //   to: "/regras-negocio",
    //   icon: <Files size={20} />,
    // },
    // {
    //   id: "history-export",
    //   label: "Histórico e Exportação",
    //   to: PATHS.HISTORY_EXPORT,
    //   icon: <Clock size={20} />,
    // },
    // {
    //   id: "payments",
    //   label: "Planos e pagamentos",
    //   to: PATHS.PAYMENTS,
    //   icon: <Package size={20} />,
    // },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <Building2 size={24} />
        <span className="sidebar__title">TaxManager</span>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
