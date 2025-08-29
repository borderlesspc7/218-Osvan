import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, AlertCircle, Play, Download, Eye } from "lucide-react";
import { jobService } from "../../../services/jobService";
import type { Job } from "../../../types/job";
import "./JobList.css";

interface JobListProps {
  userId: string;
  onViewJob: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ userId, onViewJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = jobService.subscribeToUserJobs(userId, (jobs) => {
      setJobs(jobs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getStatusIcon = (status: Job["status"]) => {
    switch (status) {
      case "queued":
        return <Clock size={16} className="status-icon queued" />;
      case "running":
        return <Play size={16} className="status-icon running" />;
      case "done":
        return <CheckCircle size={16} className="status-icon done" />;
      case "error":
        return <AlertCircle size={16} className="status-icon error" />;
      default:
        return <Clock size={16} className="status-icon queued" />;
    }
  };

  const getStatusLabel = (status: Job["status"]) => {
    switch (status) {
      case "queued":
        return "Na fila";
      case "running":
        return "Executando";
      case "done":
        return "Concluído";
      case "error":
        return "Erro";
      default:
        return status;
    }
  };

  const getTaskLabel = (task: Job["task"]) => {
    switch (task) {
      case "situacao_fiscal":
        return "Situação Fiscal";
      case "capag":
        return "CAPAG";
      case "ambos":
        return "Ambos";
      default:
        return task;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="job-list-loading">
        <div className="loading-spinner"></div>
        <p>Carregando jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <div className="empty-icon">
          <Clock size={48} />
        </div>
        <h3>Nenhum job encontrado</h3>
        <p>Crie seu primeiro job para começar</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h3>Execuções Recentes</h3>
        <span className="job-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="job-items">
        {jobs.map((job) => (
          <div key={job.id} className="job-item">
            <div className="job-header">
              <div className="job-info">
                <div className="job-cnpj">{job.cnpj}</div>
                <div className="job-task">{getTaskLabel(job.task)}</div>
              </div>
              <div className="job-status">
                {getStatusIcon(job.status)}
                <span className="status-label">{getStatusLabel(job.status)}</span>
              </div>
            </div>

            <div className="job-details">
              <div className="job-date">
                Criado em {formatDate(job.createdAt)}
              </div>
              
              {job.error && (
                <div className="job-error">
                  <AlertCircle size={14} />
                  <span>{job.error}</span>
                </div>
              )}

              {job.status === "done" && job.outputs && (
                <div className="job-outputs">
                  {job.outputs.situacaoFiscalPdf && (
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(
                        job.outputs.situacaoFiscalPdf!,
                        `situacao_fiscal_${job.cnpj}.pdf`
                      )}
                    >
                      <Download size={14} />
                      Situação Fiscal
                    </button>
                  )}
                  {job.outputs.capagPdf && (
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(
                        job.outputs.capagPdf!,
                        `capag_${job.cnpj}.pdf`
                      )}
                    >
                      <Download size={14} />
                      CAPAG
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="job-actions">
              <button
                className="view-btn"
                onClick={() => onViewJob(job)}
              >
                <Eye size={14} />
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
