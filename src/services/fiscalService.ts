import type { CNPJ } from "../types/cnpj";
import type { FiscalConsultaResult, TipoDivida } from "../types/fiscal";
import { cnpjService } from "./cnpjService";

// Utilitário simples para pseudo-aleatoriedade determinística com base no CNPJ
function seededRandom(seed: string, min = 0, max = 1) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const x = Math.abs(h % 1000) / 1000;
  return min + x * (max - min);
}

const ALL_TIPOS: TipoDivida[] = [
  "INSS",
  "IRPJ",
  "ICMS",
  "IPI",
  "ISS",
  "PIS/COFINS",
  "Outros",
];

export const fiscalService = {
  // Simula uma consulta de certidão fiscal para um CNPJ específico
  async consultarCertidao(cnpjDoc: CNPJ): Promise<FiscalConsultaResult> {
    // Simula latência de rede
    await new Promise((r) => setTimeout(r, 900));

    // Regras derivadas dos dados existentes do CNPJ para deixar a simulação “plausível”
    const baseSeed = cnpjDoc.cnpj;
    const isRegular = cnpjDoc.statusFiscal === "regular";
    const isBaixado = cnpjDoc.statusFiscal === "baixado";
    const isSuspenso = cnpjDoc.statusFiscal === "suspenso";
    const negociacaoCancelada = cnpjDoc.situacaoNegociacao === "cancelada";

    const impedidoDeNegociar = isBaixado || negociacaoCancelada;
    const negociavel = !impedidoDeNegociar && !isSuspenso;

    // Valor de dívidas e processos seguem padrão coerente com status
    let valorTotalDivida = 0;
    let numeroProcessos = 0;
    let dividasAtivas = false;
    let tiposDivida: TipoDivida[] = [];

    if (!isRegular) {
      dividasAtivas = true;
      valorTotalDivida = Math.round(seededRandom(baseSeed, 10_000, 250_000));
      numeroProcessos = Math.floor(seededRandom(baseSeed + "p", 1, 8));
      const count = Math.max(1, Math.floor(seededRandom(baseSeed + "t", 1, 4)));
      const pool = [...ALL_TIPOS];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(seededRandom(baseSeed + i, 0, pool.length));
        const picked = pool.splice(idx, 1)[0];
        tiposDivida.push(picked);
      }
    } else {
      dividasAtivas = false;
      valorTotalDivida = 0;
      numeroProcessos = 0;
      tiposDivida = [];
    }

    const razaoSocial =
      cnpjDoc.nomeFantasia && cnpjDoc.nomeFantasia.trim().length > 0
        ? cnpjDoc.nomeFantasia
        : "Razão Social não informada";

    return {
      cnpj: cnpjDoc.cnpj,
      razaoSocial,
      situacaoFiscal: isRegular ? "regular" : "irregular",
      dividasAtivas,
      negociavel,
      impedidoDeNegociar,
      impedimentoMotivo: impedidoDeNegociar
        ? isBaixado
          ? "Empresa baixada - negociação indisponível."
          : "Negociação cancelada - contate o suporte."
        : undefined,
      tiposDivida,
      valorTotalDivida,
      numeroProcessos,
      dataUltimaAtualizacao: new Date().toISOString(),
    };
  },

  formatCurrencyBRL(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },

  exportToCsv(result: FiscalConsultaResult) {
    const headers = [
      "CNPJ",
      "Razão Social",
      "Situação Fiscal",
      "Dívidas Ativas",
      "Negociável",
      "Tipos de Dívida",
      "Valor Total da Dívida",
      "Número de Processos",
      "Data da Última Atualização",
    ];
    const row = [
      cnpjService.formatCNPJ(result.cnpj),
      result.razaoSocial,
      result.situacaoFiscal === "regular" ? "Regular" : "Irregular",
      result.dividasAtivas ? "Sim" : "Não",
      result.negociavel ? "Sim" : "Não",
      result.tiposDivida.join(" | "),
      this.formatCurrencyBRL(result.valorTotalDivida),
      String(result.numeroProcessos),
      new Date(result.dataUltimaAtualizacao).toLocaleString("pt-BR"),
    ];

    const csv = [
      headers.join(","),
      row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `certidao_${result.cnpj}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
