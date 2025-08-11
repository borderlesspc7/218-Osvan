"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, Timer, Info } from "lucide-react";
import "./StatusCard.css";
import Tooltip from "../../../components/ui/Tooltip/Tooltip";

interface StatusCardProps {
  isRegular: boolean;
  impedido: boolean;
  emCastigo: boolean;
  castigoDiasRestantes?: number;
  motivoCastigo?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  isRegular,
  impedido,
  emCastigo,
  castigoDiasRestantes,
  motivoCastigo,
}) => {
  let badgeClass = "status-badge neutral";
  let title = "Status do CNPJ";
  let description = "Selecione um CNPJ para ver o status";

  if (impedido) {
    badgeClass = "status-badge danger";
    title = "Impedido de negociar";
    description = "Este CNPJ está impedido de realizar negociação.";
  } else if (emCastigo) {
    badgeClass = "status-badge warning";
    title = "Em castigo";
    description = `Aguardando término do período de bloqueio${
      castigoDiasRestantes !== undefined
        ? ` (${castigoDiasRestantes} dias restantes)`
        : ""
    }.`;
  } else {
    badgeClass = isRegular ? "status-badge success" : "status-badge warning";
    title = isRegular
      ? "Disponível para negociação"
      : "Irregular - pode haver restrições";
    description = isRegular
      ? "CNPJ apto para iniciar negociação."
      : "Situação irregular detectada.";
  }

  const Icon = impedido
    ? ShieldAlert
    : isRegular && !emCastigo
    ? ShieldCheck
    : Timer;

  return (
    <div className="neg-status-card">
      <div className="neg-status-header">
        <div className={badgeClass}>
          <Icon size={18} />
          <span>{title}</span>
        </div>
        {(emCastigo || impedido) && motivoCastigo && (
          <Tooltip content={motivoCastigo}>
            <span className="info-icon" aria-label="Maios informações">
              <Info size={16} />
            </span>
          </Tooltip>
        )}
      </div>
      <p className="neg-status-desc">{description}</p>
      {emCastigo && castigoDiasRestantes !== undefined && (
        <div className="countdown">
          <Timer size={16} />
          <span>{castigoDiasRestantes} dias para liberar nova negociação</span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
