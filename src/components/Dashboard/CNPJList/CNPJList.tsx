"use client";

import React from "react";
import { Building, Calendar, Edit, Trash2 } from "lucide-react";
import type { CNPJ } from "../../../types/cnpj";
import { cnpjService } from "../../../services/cnpjService";
import "./CNPJList.css";

interface CNPJListProps {
  cnpjs: CNPJ[];
  onEdit: (cnpj: CNPJ) => void;
  onDelete: (cnpjId: string) => void;
  isLoading?: boolean;
}

const CNPJList: React.FC<CNPJListProps> = ({
  cnpjs,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      regular: "status-regular",
      irregular: "status-irregular",
      suspenso: "status-suspenso",
      baixado: "status-baixado",
    };
    return colors[status as keyof typeof colors] || "status-regular";
  };

  const getSituacaoColor = (situacao: string) => {
    const colors = {
      pendente: "situacao-pendente",
      em_andamento: "situacao-andamento",
      concluida: "situacao-concluida",
      cancelada: "situacao-cancelada",
    };
    return colors[situacao as keyof typeof colors] || "situacao-pendente";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      regular: "Regular",
      irregular: "Irregular",
      suspenso: "Suspenso",
      baixado: "Baixado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getSituacaoLabel = (situacao: string) => {
    const labels = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
      cancelada: "Cancelada",
    };
    return labels[situacao as keyof typeof labels] || situacao;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return (
      <div className="cnpj-list-container">
        <div className="cnpj-list-header">
          <h3>CNPJs Cadastrados</h3>
        </div>
        <div className="loading-state">
          <p>Carregando CNPJs...</p>
        </div>
      </div>
    );
  }

  if (cnpjs.length === 0) {
    return (
      <div className="cnpj-list-container">
        <div className="cnpj-list-header">
          <h3>CNPJs Cadastrados</h3>
        </div>
        <div className="empty-state">
          <Building size={48} />
          <h4>Nenhum CNPJ cadastrado</h4>
          <p>
            Cadastre seu primeiro CNPJ para comecar a gerenciar suas negociações
            tributarias
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cnpj-list-container">
      <div className="cnpj-list-header">
        <h3>CNPJs Cadastrados</h3>
        <span className="cnpj-count">
          {cnpjs.length} {cnpjs.length === 1 ? "CNPJ" : "CNPJs"}
        </span>
      </div>

      <div className="cnpj-grid">
        {cnpjs.map((cnpj) => (
          <div key={cnpj.id} className="cnpj-card">
            <div className="cnpj-card-header">
              <div className="cnpj-info">
                <h4>{cnpj.nomeFantasia || "Empresa"}</h4>
                <p className="cnpj-number">
                  {cnpjService.formatCNPJ(cnpj.cnpj)}
                </p>
              </div>
              <div className="cnpj-actions">
                {onEdit && (
                  <button
                    className="action-button edit-button"
                    onClick={() => onEdit(cnpj)}
                    title="Editar CNPJ"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="action-button delete-button"
                    onClick={() => onDelete(cnpj.id)}
                    title="Excluir CNPJ"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="cnpj-card-body">
              <div className="status-row">
                <div className="status-item">
                  <span className="status-label">Status Fiscal:</span>
                  <span
                    className={`status-badge ${getStatusColor(
                      cnpj.statusFiscal
                    )}`}
                  >
                    {getStatusLabel(cnpj.statusFiscal)}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Negociação:</span>
                  <span
                    className={`status-badge ${getSituacaoColor(
                      cnpj.situacaoNegociacao
                    )}`}
                  >
                    {getSituacaoLabel(cnpj.situacaoNegociacao)}
                  </span>
                </div>
              </div>

              <div className="cnpj-card-footer">
                <div className="update-info">
                  <Calendar size={14} />
                  <span>Atualizado em {formatDate(cnpj.dataAtualizacao)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CNPJList;
