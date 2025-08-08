"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { FileSearch, Building } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout/DashboardLayout";
import SelectCNPJ from "../../components/ConsultCertificates/SelectCNPJ/SelectCNPJ";
import FiscalIndicators from "../../components/ConsultCertificates/FiscalIndicators/FiscalIndicators";
import FiscalDetails from "../../components/ConsultCertificates/FiscalDetails/FiscalDetails";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import Button from "../../components/ui/Button/Button";
import { useAuthContext } from "../../contexts/useAuthContext";
import { cnpjService } from "../../services/cnpjService";
import type { CNPJ } from "../../types/cnpj";
import { fiscalService } from "../../services/fiscalService";
import type { FiscalConsultaResult } from "../../types/fiscal";
import "./FiscalConsultPage.css";

const FiscalConsultPage: React.FC = () => {
  const { user } = useAuthContext();
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoadingCNPJs, setIsLoadingCNPJs] = useState(true);
  const [isConsulting, setIsConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FiscalConsultaResult | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        setIsLoadingCNPJs(true);
        setError(null);
        const list = await cnpjService.getCNPJsByUser(user.uid);
        setCnpjs(list);
      } catch (e) {
        setError("Não foi possível carregar seus CNPJs." + e);
      } finally {
        setIsLoadingCNPJs(false);
      }
    };
    load();
  }, [user]);

  const selectOptions = useMemo(
    () =>
      cnpjs.map((c) => ({
        value: c.id,
        label:
          c.nomeFantasia && c.nomeFantasia.trim() ? c.nomeFantasia : "Empresa",
        sublabel: cnpjService.formatCNPJ(c.cnpj),
      })),
    [cnpjs]
  );

  const selectedDoc = useMemo(
    () => cnpjs.find((c) => c.id === selectedId),
    [cnpjs, selectedId]
  );

  const handleConsult = async () => {
    if (!selectedDoc) return;
    try {
      setIsConsulting(true);
      setError(null);
      const r = await fiscalService.consultarCertidao(selectedDoc);
      setResult(r);
    } catch (e) {
      setError("Falha na consulta. Tente novamente em instantes." + e);
      setResult(null);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="fiscal-consult">
        <div className="consult-card">
          <div className="consult-header">
            <div className="title-group">
              <FileSearch size={20} />
              <h1>Consulta de Certidões</h1>
            </div>
            <p className="subtitle">
              Selecione um CNPJ para verificar a situação fiscal e certidões
            </p>
          </div>

          {isLoadingCNPJs ? (
            <div className="centered">
              <LoadingSpinner label="Carregando seus CNPJs..." />
            </div>
          ) : cnpjs.length === 0 ? (
            <div className="empty-state">
              <Building size={48} />
              <h3>Você ainda não cadastrou CNPJs</h3>
              <p>Cadastre seus CNPJs no painel para iniciar consultas.</p>
            </div>
          ) : (
            <>
              <div className="consult-form">
                <SelectCNPJ
                  label="CNPJ da empresa"
                  options={selectOptions}
                  value={selectedId}
                  onChange={(v) => setSelectedId(v)}
                />
                <Button
                  variant="primary"
                  onClick={handleConsult}
                  disabled={!selectedId || isConsulting}
                  className="consult-button"
                >
                  {isConsulting ? "Consultando..." : "Consultar Certidão"}
                </Button>
              </div>

              {error && <div className="error-banner">{error}</div>}

              {result && (
                <>
                  <div className="indicators-wrapper">
                    <FiscalIndicators
                      situacaoRegular={result.situacaoFiscal === "regular"}
                      dividasAtivas={result.dividasAtivas}
                      negociavel={result.negociavel}
                    />
                  </div>
                  <FiscalDetails result={result} />
                </>
              )}
            </>
          )}
        </div>

        <div className="illustration-side" aria-hidden="true">
          <div className="illustration-content">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H15L21 9V21H3V3Z"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 3V9H21"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13H17"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7 17H13"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h4>Certidões Fiscais</h4>
            <p>Visualize rapidamente a situação fiscal de cada empresa.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FiscalConsultPage;
