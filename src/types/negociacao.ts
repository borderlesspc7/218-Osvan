export interface SimulacaoInput {
  cnpj: string;
  valorTotal: number;
  parcelas: number;
  descontoPercentual: number;
}

export interface SimulacaoResultado {
  valorTotalOriginal: number;
  descontoPercentual: number;
  descontoValor: number;
  valorComDesconto: number;
  parcelas: number;
  valorParcela: number;
}

export interface SimulacaoRegistro {
  id: string;
  userId: string;
  cnpj: string;
  dataSimulacao: string;
  status: "simulado" | "confirmado";
  resultado: SimulacaoResultado;
}
