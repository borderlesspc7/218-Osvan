export interface CNPJ {
  id: string;
  cnpj: string;
  nomeFantasia?: string;
  statusFiscal: "regular" | "irregular" | "suspenso" | "baixado";
  situacaoNegociacao: "pendente" | "em_andamento" | "concluida" | "cancelada";
  dataAtualizacao: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CNPJFormData {
  cnpj: string;
  nomeFantasia?: string;
  statusFiscal: "regular" | "irregular" | "suspenso" | "baixado";
  situacaoNegociacao: "pendente" | "em_andamento" | "concluida" | "cancelada";
}
