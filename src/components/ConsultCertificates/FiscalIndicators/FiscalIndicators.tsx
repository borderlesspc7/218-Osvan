"use client";

import "./FiscalIndicators.css";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import React from "react";

interface FiscalIndicatorsProps {
  situacaoRegular: boolean;
  dividasAtivas: boolean;
  negociavel: boolean;
}

const FiscalIndicators: React.FC<FiscalIndicatorsProps> = ({
  situacaoRegular,
  dividasAtivas,
  negociavel,
}) => {
  return (
    <div className="fiscal-indicators">
      <StatusIndicator
        title="Situação Fiscal"
        value={situacaoRegular ? "Regular" : "Irregular"}
        variant={situacaoRegular ? "success" : "danger"}
        tooltip={
          situacaoRegular
            ? "Sem pendencias nas certidoes fiscais"
            : "Pendencias encontradas nas certidoes fiscais"
        }
      />
      <StatusIndicator
        title="Dívidas Ativas"
        value={dividasAtivas ? "Sim" : "Não"}
        variant={dividasAtivas ? "success" : "danger"}
        tooltip={
          dividasAtivas
            ? "Existem débitos inscritos em dívida ativa."
            : "Nenhuma dívida ativa localizada."
        }
      />
      <StatusIndicator
        title="Possibilidade de Negociacao"
        value={negociavel ? "Sim" : "Não"}
        variant={negociavel ? "success" : "danger"}
        tooltip={
          negociavel
            ? "Este CNPJ pode iniciar uma negociação tributária."
            : "Negociação pode estar limitada por status fiscal ou restrições."
        }
      />
    </div>
  );
};

export default FiscalIndicators;
