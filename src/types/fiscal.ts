export type SituacaoFiscal = "regular" | "irregular";
export type TipoDivida =
  | "INSS"
  | "IRPJ"
  | "ICMS"
  | "IPI"
  | "ISS"
  | "PIS/COFINS"
  | "Outros";

export interface FiscalConsultaResult {
  cnpj: string;
  razaoSocial: string;
  situacaoFiscal: SituacaoFiscal;
  dividasAtivas: boolean;
  negociavel: boolean;
  impedidoDeNegociar: boolean;
  impedimentoMotivo?: string;
  tiposDivida: TipoDivida[];
  valorTotalDivida: number;
  numeroProcessos: number;
  dataUltimaAtualizacao: string;
}
