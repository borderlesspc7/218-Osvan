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
  getDoc,
} from "firebase/firestore";

import { db } from "../lib/firebaseConfig";
import type { CNPJ, CNPJFormData } from "../types/cnpj";

export const cnpjService = {
  async createCNPJ(userId: string, data: CNPJFormData): Promise<CNPJ> {
    try {
      // Verificar se o CNPJ já existe para este usuário
      const hasCnpj = await this.userHasCnpj(userId, data.cnpj);
      if (hasCnpj) {
        throw new Error("Este CNPJ já está cadastrado para este usuário");
      }

      const now = new Date().toISOString();
      const cnpjData = {
        ...data,
        userId,
        createdAt: now,
        updatedAt: now,
        dataAtualizacao: now,
      };

      const docRef = await addDoc(collection(db, "cnpjs"), cnpjData);

      // Atualizar o array de CNPJs do usuário
      await this.addCnpjToUser(userId, data.cnpj);

      return {
        id: docRef.id,
        ...cnpjData,
      };
    } catch (error) {
      console.error("Erro ao criar CNPJ:", error);
      throw error;
    }
  },

  async addCnpjToUser(userId: string, cnpj: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = userDoc.data();
      const currentCnpjs = userData.cnpjs || [];

      // Verificar se o CNPJ já existe no array
      if (!currentCnpjs.includes(cnpj)) {
        await updateDoc(userRef, {
          cnpjs: [...currentCnpjs, cnpj],
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar CNPJ ao usuário:", error);
      throw error;
    }
  },

  async removeCnpjFromUser(userId: string, cnpj: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = userDoc.data();
      const currentCnpjs = userData.cnpjs || [];

      // Remover o CNPJ do array
      const updatedCnpjs = currentCnpjs.filter((c: string) => c !== cnpj);

      await updateDoc(userRef, {
        cnpjs: updatedCnpjs,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao remover CNPJ do usuário:", error);
      throw error;
    }
  },

  async getUserCnpjs(userId: string): Promise<string[]> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return [];
      }

      const userData = userDoc.data();
      return userData.cnpjs || [];
    } catch (error) {
      console.error("Erro ao buscar CNPJs do usuário:", error);
      return [];
    }
  },

  async getUserCnpjCount(userId: string): Promise<number> {
    try {
      const cnpjs = await this.getUserCnpjs(userId);
      return cnpjs.length;
    } catch (error) {
      console.error("Erro ao contar CNPJs do usuário:", error);
      return 0;
    }
  },

  async userHasCnpj(userId: string, cnpj: string): Promise<boolean> {
    try {
      const userCnpjs = await this.getUserCnpjs(userId);
      return userCnpjs.includes(cnpj);
    } catch (error) {
      console.error("Erro ao verificar CNPJ do usuário:", error);
      return false;
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
      // Primeiro, buscar o CNPJ para obter o userId e cnpj
      const cnpjRef = doc(db, "cnpjs", cnpjId);
      const cnpjDoc = await getDoc(cnpjRef);

      if (!cnpjDoc.exists()) {
        throw new Error("CNPJ não encontrado");
      }

      const cnpjData = cnpjDoc.data();
      const userId = cnpjData.userId;
      const cnpj = cnpjData.cnpj;

      // Deletar o documento do CNPJ
      await deleteDoc(cnpjRef);

      // Remover do array do usuário
      await this.removeCnpjFromUser(userId, cnpj);
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

  async getUserCnpjStats(userId: string): Promise<{
    cnpjCount: number;
    cnpjs: string[];
    userCnpjs: CNPJ[];
  }> {
    try {
      const [cnpjs, userCnpjs] = await Promise.all([
        this.getUserCnpjs(userId),
        this.getCNPJsByUser(userId),
      ]);

      return {
        cnpjCount: cnpjs.length,
        cnpjs,
        userCnpjs,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
      return {
        cnpjCount: 0,
        cnpjs: [],
        userCnpjs: [],
      };
    }
  },
};
