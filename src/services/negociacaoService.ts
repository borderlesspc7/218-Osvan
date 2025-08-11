import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import type {
  SimulacaoInput,
  SimulacaoRegistro,
  SimulacaoResultado,
} from "../types/negociacao";

export const negociacaoService = {
  calcularSimulacao(input: SimulacaoInput): SimulacaoResultado {
    const valorTotalOriginal = Math.max(input.valorTotal);
    const descontoPercentual = Math.max(
      0,
      Math.min(90, input.descontoPercentual || 0)
    );
    const parcelas = Math.max(1, Math.min(60, input.parcelas || 1));

    const descontoValor = (valorTotalOriginal * descontoPercentual) / 100;
    const valorComDesconto = Math.max(0, valorTotalOriginal - descontoValor);
    const valorParcela =
      parcelas > 0 ? valorComDesconto / parcelas : valorComDesconto;

    return {
      valorTotalOriginal,
      descontoPercentual,
      descontoValor,
      valorComDesconto,
      parcelas,
      valorParcela,
    };
  },

  async salvarSimulacao(
    userId: string,
    input: SimulacaoInput,
    status: "simulado" | "confirmado"
  ) {
    const resultado = this.calcularSimulacao(input);
    const data = {
      userId,
      cnpj: input.cnpj,
      dataSimulacao: new Date().toISOString(),
      status,
      resultado,
    };

    const ref = await addDoc(collection(db, "simulacoes"), data);
    const registro: SimulacaoRegistro = { id: ref.id, ...data };
    return registro;
  },
};
