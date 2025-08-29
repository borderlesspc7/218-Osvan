import React, { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { jobService } from "../../../services/jobService";
import type { CreateJobData, JobTask } from "../../../types/job";
import type { CNPJ } from "../../../types/cnpj";
import "./CreateJobForm.css";

interface CreateJobFormProps {
  cnpjs: CNPJ[];
  onSuccess: (jobId: string) => void;
  onCancel: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({
  cnpjs,
  onSuccess,
  onCancel,
}) => {
  const [selectedCnpj, setSelectedCnpj] = useState<string>("");
  const [task, setTask] = useState<JobTask>("situacao_fiscal");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [notifyEmails, setNotifyEmails] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar se é um arquivo .p12
      if (!file.name.endsWith('.p12')) {
        setError("Por favor, selecione um arquivo .p12 válido");
        return;
      }
      setCertFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedCnpj || !certFile) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cnpjData = cnpjs.find(c => c.id === selectedCnpj);
      if (!cnpjData) {
        throw new Error("CNPJ não encontrado");
      }

      const createJobData: CreateJobData = {
        cnpjId: selectedCnpj,
        cnpj: cnpjData.cnpj,
        task,
        certFile,
        notifyEmails: notifyEmails ? notifyEmails.split(',').map(email => email.trim()) : [],
      };

      const job = await jobService.createJob(cnpjData.cnpjId, createJobData);
      onSuccess(job.id);
    } catch (err: any) {
      setError(err.message || "Erro ao criar job");
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskLabel = (taskType: JobTask) => {
    switch (taskType) {
      case "situacao_fiscal":
        return "Situação Fiscal";
      case "capag":
        return "CAPAG";
      case "ambos":
        return "Ambos";
      default:
        return taskType;
    }
  };

  return (
    <div className="create-job-form">
      <div className="form-header">
        <h2>Nova Execução</h2>
        <p>Faça upload do certificado A1 e configure a execução</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cnpj">CNPJ *</label>
          <select
            id="cnpj"
            value={selectedCnpj}
            onChange={(e) => setSelectedCnpj(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Selecione um CNPJ</option>
            {cnpjs.map((cnpj) => (
              <option key={cnpj.id} value={cnpj.id}>
                {cnpj.cnpj} - {cnpj.nomeFantasia || "Nome não informado"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task">Tipo de Execução *</label>
          <select
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value as JobTask)}
            required
            disabled={isLoading}
          >
            <option value="situacao_fiscal">Situação Fiscal</option>
            <option value="capag">CAPAG</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="certFile">Certificado A1 (.p12) *</label>
          <div className="file-upload-area">
            <input
              type="file"
              id="certFile"
              accept=".p12"
              onChange={handleFileChange}
              disabled={isLoading}
              className="file-input"
            />
            <div className="file-upload-content">
              {certFile ? (
                <div className="file-selected">
                  <CheckCircle size={20} />
                  <span>{certFile.name}</span>
                </div>
              ) : (
                <div className="file-placeholder">
                  <Upload size={24} />
                  <span>Clique para selecionar o certificado A1</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notifyEmails">E-mails para notificação (opcional)</label>
          <Input
            type="text"
            id="notifyEmails"
            value={notifyEmails}
            onChange={(e) => setNotifyEmails(e.target.value)}
            placeholder="email1@exemplo.com, email2@exemplo.com"
            disabled={isLoading}
          />
          <small>Separe múltiplos e-mails por vírgula</small>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="form-actions">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !selectedCnpj || !certFile}
            loading={isLoading}
          >
            {isLoading ? "Criando..." : "Criar Job"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;
