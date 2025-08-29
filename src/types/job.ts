export type JobTask = "situacao_fiscal" | "capag" | "ambos";
export type JobStatus = "queued" | "running" | "done" | "error";

export interface Job {
  id: string;
  cnpjId: string;
  cnpj: string;
  task: JobTask;
  status: JobStatus;
  outputs: {
    situacaoFiscalPdf?: string;
    capagPdf?: string;
  };
  error: string | null;
  createdBy: string;
  createdAt: number;
  certData: string; // Base64 do certificado
  certEnc: boolean;
  notifyEmails: string[];
}

export interface CreateJobData {
  cnpjId: string;
  cnpj: string;
  task: JobTask;
  certFile: File;
  notifyEmails?: string[];
}
