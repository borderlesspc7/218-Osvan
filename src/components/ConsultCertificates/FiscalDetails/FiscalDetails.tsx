"use client";
import "./FiscalDetails.css";
import React from "react";
import {
  Building2,
  FileText,
  Scale,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";
import { fiscalService } from "../../../services/fiscalService";
import type { FiscalConsultaResult } from "../../../types/fiscal";
import { cnpjService } from "../../../services/cnpjService";

interface FiscalDetailsProps {
  result: FiscalConsultaResult;
}

const FiscalDetails: React.FC<FiscalDetailsProps> = ({ result }) => {
  return (
    <div className="fiscal-details-card">
      <div className="fiscal-details-header">
        <div className="details-title">
          <FileText size={20} />
          <h3>Detalhes da Certidão</h3>
        </div>
        <button
          className="export-button"
          type="button"
          onClick={() => fiscalService.exportToCsv(result)}
        >
          <FileSpreadsheet size={28} />
          Exportar (.csv)
        </button>
      </div>

      <div className="details-grid">
        <div className="details-item">
          <span className="details-label">CNPJ</span>
          <span className="details-value mono">
            {cnpjService.formatCNPJ(result.cnpj)}
          </span>
        </div>
        <div className="details-item">
          <span className="details-label">Tipo(s) de Divida</span>
          <div className="tags">
            {result.tiposDivida.length === 0 ? (
              <span className="tag tag--muted">Sem dívidas</span>
            ) : (
              result.tiposDivida.map((t) => (
                <span key={t} className="tag">
                  <Scale size={14} />
                  {t}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="details-item">
          <span className="details-label">Valor Total da Dívida</span>
          <span
            className={`details-value ${
              result.valorTotalDivida > 0 ? "danger" : ""
            }`}
          >
            {fiscalService.formatCurrencyBRL(result.valorTotalDivida)}
          </span>
        </div>
        <div className="details-item">
          <span className="details-label">Nº de Processos/Pendências</span>
          <span className="details-value">{result.numeroProcessos}</span>
        </div>
        <div className="details-item">
          <span className="details-label">Última Atualização</span>
          <span className="details-value with-icon">
            <CalendarDays size={14} />
            {new Date(result.dataUltimaAtualizacao).toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      {result.impedidoDeNegociar && (
        <div className="negociation-alert">
          <Building2 size={18} />
          <div>
            <strong>Impedido de negociar.</strong>{" "}
            <span>
              {result.impedimentoMotivo || "Verifique a situação cadastral."}
            </span>
          </div>
        </div>
      )}

      {result.situacaoFiscal === "regular" && (
        <div className="no-pendencias">
          <strong>Sem pendências.</strong> Este CNPJ está regular nas certidões
          fiscais consultadas.
        </div>
      )}
    </div>
  );
};

export default FiscalDetails;
