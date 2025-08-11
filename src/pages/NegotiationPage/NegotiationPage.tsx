"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout/DashboardLayout";
import SelectCNPJ from "../../components/ConsultCertificates/SelectCNPJ/SelectCNPJ";
import NegotiationStatusCard from "../../components/Negotiation/StatusCard/StatusCard";
import DebtSummaryCard from "../../components/Negotiation/DebtSummary/DebtSummary";
import SimulationForm from "../../components/Negotiation/SimulationForm/SimulationForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import "./NegotiationPage.css";
import { useAuthContext } from "../../contexts/useAuthContext";
import { cnpjService } from "../../services/cnpjService";
import { fiscalService } from "../../services/fiscalService";
import type { CNPJ } from "../../types/cnpj";
import type { FiscalConsultaResult } from "../../types/fiscal";
import { negociacaoService } from "../../services/negociacaoService";

const NegotiationPage: React.FC = () => {
  const { user } = useAuthContext();
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingResumo, setLoadingResumo] = useState(false);
  const [resumo, setResumo] = useState<FiscalConsultaResult | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        setLoadingList(true);
        const list = await cnpjService.getCNPJsByUser(user.uid);
        setCnpjs(list);
      } catch {
        console.error("Erro ao carregar CNPJs");
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, [user]);

  const selectedDoc = useMemo(
    () => cnpjs.find((c) => c.id === selectedId),
    [cnpjs, selectedId]
  );

  useEffect(() => {
    const fetchResumo = async () => {
      if (!selectedDoc) {
        setResumo(null);
        return;
      }
      try {
        setLoadingResumo(true);
        const r = await fiscalService.consultarCertidao(selectedDoc);
        setResumo(r);
      } catch {
        console.error("Falha ao carregar resumo fiscal.");
        setResumo(null);
      } finally {
        setLoadingResumo(false);
      }
    };
    fetchResumo();
  }, [selectedDoc]);

  const impedido = useMemo(() => {
    if (!selectedDoc) return false;
    return (
      selectedDoc.statusFiscal === "baixado" ||
      selectedDoc.statusFiscal === "suspenso"
    );
  }, [selectedDoc]);

  // Por enquanto, vamos simplificar a lógica de castigo
  // já que essas propriedades não existem no tipo CNPJ atual
  const castigoInfo = useMemo(() => {
    // TODO: Implementar lógica de castigo quando adicionar essas propriedades ao tipo CNPJ
    return { emCastigo: false };
  }, [selectedDoc]);

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

  const handleSave = async (status: "simulado" | "confirmado") => {
    if (!user || !selectedDoc || !resumo) return;
    try {
      const input = {
        cnpj: resumo.cnpj,
        valorTotal: resumo.valorTotalDivida,
        parcelas: 12,
        descontoPercentual: 10,
      };
      await negociacaoService.salvarSimulacao(user.uid, input, status);
      alert(
        status === "confirmado"
          ? "Negociação confirmada e salva!"
          : "Simulação registrada."
      );
    } catch {
      alert("Erro ao salvar a simulação.");
    }
  };

  const disabledAll = Boolean(
    !selectedDoc ||
      impedido ||
      castigoInfo.emCastigo ||
      (resumo && resumo.valorTotalDivida <= 0)
  );

  return (
    <DashboardLayout>
      <div className="neg-page">
        <div className="neg-left">
          <div className="card">
            {loadingList ? (
              <div className="centered">
                <LoadingSpinner label="Carregando CNPJs..." />
              </div>
            ) : (
              <>
                <h1>Simulação e Negociação</h1>
                <p className="subtitle">
                  Selecione um CNPJ para iniciar a simulação
                </p>
                <SelectCNPJ
                  label="CNPJ da empresa"
                  options={selectOptions}
                  value={selectedId}
                  onChange={(v: string) => setSelectedId(v)}
                />
              </>
            )}
          </div>

          <NegotiationStatusCard
            isRegular={Boolean(resumo && resumo.situacaoFiscal === "regular")}
            impedido={!!impedido}
            emCastigo={!!castigoInfo.emCastigo}
            castigoDiasRestantes={undefined}
            motivoCastigo={undefined}
          />

          {loadingResumo ? (
            <div className="card centered">
              <LoadingSpinner label="Carregando resumo..." />
            </div>
          ) : resumo ? (
            <DebtSummaryCard result={resumo} />
          ) : (
            selectedId &&
            !loadingResumo && (
              <div className="card note">
                Não foi possível carregar o resumo fiscal deste CNPJ.
              </div>
            )
          )}

          {resumo && resumo.valorTotalDivida === 0 && (
            <div className="card success">
              Este CNPJ não possui pendências. Nada a negociar no momento.
            </div>
          )}

          {(impedido || castigoInfo.emCastigo) && (
            <div className="card warning">
              {impedido
                ? "CNPJ impedido — não é possível realizar novas simulações."
                : "Em castigo — aguarde o período de bloqueio terminar."}
            </div>
          )}
        </div>

        <div className="neg-right">
          <SimulationForm
            baseAmount={resumo?.valorTotalDivida || 0}
            cnpj={resumo?.cnpj || ""}
            disabled={disabledAll}
            onSaved={handleSave}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NegotiationPage;
