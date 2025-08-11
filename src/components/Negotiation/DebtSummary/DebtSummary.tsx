"use client";

import React from "react";
import { Scale, CalendarDays, Coins } from "lucide-react";
import "./DebtSummary.css";
import type { FiscalConsultaResult } from "../../../types/fiscal";
import { fiscalService } from "../../../services/fiscalService";

interface DebtSummaryProps {
  result: FiscalConsultaResult;
}

const DebtSummary: React.FC<DebtSummaryProps> = ({ result }) => {
  return (
    <div className="debt-summary-card">
      <div className="debt-header">
        <h3>Resumo da Dívida</h3>
      </div>
      <div className="debt-grid">
        <div className="debt-item">
          <span className="label">Valor Total</span>
          <div className="value with-icon danger">
            <Coins size={16} />
            {fiscalService.formatCurrencyBRL(result.valorTotalDivida)}
          </div>
        </div>
        <div className="debt-item">
          <span className="label">Tipo(s) de Dívida</span>
          <div className="tags">
            {result.tiposDivida.length === 0 ? (
              <span className="tag tag-muted">Sem dividas</span>
            ) : (
              result.tiposDivida.map((t) => (
                <span className="tag" key={t}>
                  <Scale size={16} />
                  {t}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="debt-item">
          <span className="label">Ultima atualização</span>
          <div className="value with-icon">
            <CalendarDays size={16} />
            {new Date(result.dataUltimaAtualizacao).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtSummary;
