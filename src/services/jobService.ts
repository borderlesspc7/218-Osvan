import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import type { Job, CreateJobData, JobStatus } from "../types/job";

export const jobService = {
  async createJob(userId: string, data: CreateJobData): Promise<Job> {
    try {
      // 1. Converter arquivo para Base64
      const certBase64 = await this.fileToBase64(data.certFile);

      // 2. Criar documento do job no Firestore
      const jobData = {
        cnpjId: data.cnpjId,
        cnpj: data.cnpj,
        task: data.task,
        status: "queued" as JobStatus,
        outputs: {},
        error: null,
        createdBy: userId,
        createdAt: Date.now(),
        certData: certBase64,
        certEnc: true,
        notifyEmails: data.notifyEmails || [],
      };

      const docRef = await addDoc(collection(db, "jobs"), jobData);

      return {
        id: docRef.id,
        ...jobData,
      };
    } catch (error) {
      console.error("Erro ao criar job:", error);
      throw new Error("Erro ao criar job");
    }
  },

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove o prefixo "data:application/x-pkcs12;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  },

  async getUserJobs(userId: string): Promise<Job[]> {
    try {
      const q = query(
        collection(db, "jobs"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const jobs: Job[] = [];

      querySnapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
        } as Job);
      });

      return jobs;
    } catch (error) {
      console.error("Erro ao buscar jobs:", error);
      throw new Error("Erro ao buscar jobs");
    }
  },

  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const docRef = doc(db, "jobs", jobId);
      const docSnap = await getDocs(query(collection(db, "jobs"), where("__name__", "==", jobId)));
      
      if (docSnap.empty) return null;
      
      const jobDoc = docSnap.docs[0];
      return {
        id: jobDoc.id,
        ...jobDoc.data(),
      } as Job;
    } catch (error) {
      console.error("Erro ao buscar job:", error);
      return null;
    }
  },

  subscribeToJobUpdates(jobId: string, callback: (job: Job | null) => void): Unsubscribe {
    const docRef = doc(db, "jobs", jobId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const job = {
          id: doc.id,
          ...doc.data(),
        } as Job;
        callback(job);
      } else {
        callback(null);
      }
    });
  },

  subscribeToUserJobs(userId: string, callback: (jobs: Job[]) => void): Unsubscribe {
    const q = query(
      collection(db, "jobs"),
      where("createdBy", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const jobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
        } as Job);
      });
      callback(jobs);
    });
  },

  async updateJobStatus(jobId: string, status: JobStatus, outputs?: any, error?: string): Promise<void> {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const updateData: any = { status };
      
      if (outputs) updateData.outputs = outputs;
      if (error) updateData.error = error;
      
      await updateDoc(jobRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar status do job:", error);
      throw new Error("Erro ao atualizar status do job");
    }
  },
};
