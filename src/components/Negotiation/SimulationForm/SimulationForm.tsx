"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import "./SimulationForm.css";
import Button from "../../../components/ui/Button/Button";
import { negociacaoService } from "../../../services/negociacaoService";
import type { SimulacaoResultado } from "../../../types/negociacao";
import Tooltip from "../../../components/ui/Tooltip/Tooltip";
import { Percent, Calculator } from "lucide-react";

interface SimulationFormProps {
  baseAmount: number;
  cnpj: string;
  disabled?: boolean;
  onSaved?: (status: "simulado" | "confirmado", parcelas: number, desconto: number) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  baseAmount,
  cnpj,
  disabled,
  onSaved,
}) => {
  const [parcelas, setParcelas] = useState(12);
  const [descontoPercentual, setDescontoPercentual] = useState(10);
  const [statusSaving, setStatusSaving] = useState<"idle" | "saving">("idle");

  const resultado: SimulacaoResultado = useMemo(
    () =>
      negociacaoService.calcularSimulacao({
        cnpj,
        valorTotal: baseAmount,
        parcelas,
        descontoPercentual,
      }),
    [baseAmount, cnpj, parcelas, descontoPercentual]
  );

  useEffect(() => {
    // Mantém faixas válidas
    if (parcelas < 1) setParcelas(1);
    if (parcelas > 60) setParcelas(60);
    if (descontoPercentual < 0) setDescontoPercentual(0);
    if (descontoPercentual > 90) setDescontoPercentual(90);
  }, [parcelas, descontoPercentual]);

  const salvar = async (status: "simulado" | "confirmado") => {
    if (disabled) return;
    try {
      setStatusSaving("saving");
      // onSaved do container fará a chamada com userId (para manter responsabilidades separadas)
      onSaved?.(status, parcelas, descontoPercentual);
    } finally {
      setStatusSaving("idle");
    }
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <h3>Simulação de Negociação</h3>
      </div>

      <div className="sim-grid">
        <div className="sim-field">
          <label>Quantidade de parcelas</label>
          <input
            type="number"
            min={1}
            max={60}
            value={parcelas}
            onChange={(e) =>
              setParcelas(Number.parseInt(e.target.value || "1", 10))
            }
            disabled={disabled}
          />
          <small>Máx. 60 parcelas</small>
        </div>

        <div className="sim-field">
          <label>
            Desconto aplicado (%)
            <Tooltip content="Descontos acima de 90% não são permitidos.">
              <span className="icon-inline" aria-hidden="true">
                <Percent size={14} />
              </span>
            </Tooltip>
          </label>
          <input
            type="number"
            min={0}
            max={90}
            step={1}
            value={descontoPercentual}
            onChange={(e) =>
              setDescontoPercentual(Number.parseInt(e.target.value || "0", 10))
            }
            disabled={disabled}
          />
          <small>0% a 90%</small>
        </div>
      </div>

      <div className="sim-results">
        <div className="result-row">
          <span>Valor original</span>
          <strong>
            {resultado.valorTotalOriginal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
        <div className="result-row">
          <span>Desconto</span>
          <strong>
            {resultado.descontoPercentual}% (
            {resultado.descontoValor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            )
          </strong>
        </div>
        <div className="result-row">
          <span>Total com desconto</span>
          <strong>
            {resultado.valorComDesconto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
        <div className="result-row">
          <span>Valor de cada parcela ({resultado.parcelas}x)</span>
          <strong>
            {resultado.valorParcela.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
      </div>

      <div className="sim-actions">
        <Button
          variant="secondary"
          onClick={() => salvar("simulado")}
          disabled={disabled || statusSaving === "saving"}
        >
          <Calculator size={16} />
          Simular
        </Button>
        <Button
          variant="primary"
          onClick={() => salvar("confirmado")}
          disabled={disabled || statusSaving === "saving"}
        >
          Prosseguir para negociação
        </Button>
        <Button
          variant="danger"
          onClick={() => onSaved?.("simulado")}
          disabled={statusSaving === "saving"}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default SimulationForm;
