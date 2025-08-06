"use client";

import React from "react";
import { User, Crown, Calendar } from "lucide-react";
import { useAuthContext } from "../../contexts/useAuthContext";
import { PLANS } from "../../types/plan";
import "./UserProfile.css";

const UserProfile: React.FC = () => {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  const userPlan = PLANS.basic;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={32} />
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-meta">
            <span className="profile-role">
              {user.role === "client" ? "Cliente" : user.role}
            </span>
            <span className="profile-date">
              <Calendar size={14} />
              Desde {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="plan-info">
        <div className="plan-header">
          <Crown size={20} />
          <span>Plano Atual</span>
        </div>
        <div className="plan-details">
          <h3>{userPlan.name}</h3>
          <p className="plan-price">R$ {userPlan.price}/mês</p>
          <div className="plan-features">
            {userPlan.features.map((feature, index) => (
              <span key={index} className="plan-feature">
                {feature}
              </span>
            ))}
          </div>
        </div>
        <button className="upgrade-button">
          <span>Atualizar Plano</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
