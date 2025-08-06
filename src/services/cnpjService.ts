import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../lib/firebaseConfig";
import type { CNPJ, CNPJFormData } from "../types/cnpj";

export const cnpjService = {
  async createCNPJ(userId: string, data: CNPJFormData): Promise<CNPJ> {
    try {
      const now = new Date().toISOString();
      const cnpjData = {
        ...data,
        userId,
        createdAt: now,
        updatedAt: now,
        dataAtualizacao: now,
      };

      const docRef = await addDoc(collection(db, "cnpjs"), cnpjData);

      return {
        id: docRef.id,
        ...cnpjData,
      };
    } catch (error) {
      console.error("Erro ao criar CNPJ:", error);
      throw error;
    }
  },

  async getCNPJsByUser(userId: string): Promise<CNPJ[]> {
    try {
      const q = query(
        collection(db, "cnpjs"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const cnjps: CNPJ[] = [];

      querySnapshot.forEach((doc) => {
        cnjps.push({
          id: doc.id,
          ...doc.data(),
        } as CNPJ);
      });

      return cnjps;
    } catch (error) {
      console.error("Erro ao buscar CNPJs:", error);
      throw new Error("Erro ao buscar CNPJs");
    }
  },

  async updateCNPJ(cnpjId: string, data: Partial<CNPJFormData>): Promise<void> {
    try {
      const cnpjRef = doc(db, "cnpjs", cnpjId);
      await updateDoc(cnpjRef, {
        ...data,
        updatedAt: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar CNPJ:", error);
      throw new Error("Erro ao atualizar CNPJ");
    }
  },

  async deleteCNPJ(cnpjId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "cnpjs", cnpjId));
    } catch (error) {
      console.error("Erro ao deletar CNPJ:", error);
      throw new Error("Erro ao deletar CNPJ");
    }
  },

  formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, "");
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  },

  validateCNPJ(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, "");

    if (cleaned.length !== 14) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;

    // Validação do dígito verificador
    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(cleaned[12]) !== digit) return false;

    sum = 0;
    weight = 6;

    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleaned[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cleaned[13]) === digit;
  },
};
