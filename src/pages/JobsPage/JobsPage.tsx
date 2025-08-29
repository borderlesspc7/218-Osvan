import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuthContext } from "../../contexts/useAuthContext";
import DashboardLayout from "../../components/Dashboard/DashboardLayout/DashboardLayout";
import CreateJobForm from "../../components/Jobs/CreateJobForm/CreateJobForm";
import JobList from "../../components/Jobs/JobList/JobList";
import Button from "../../components/ui/Button/Button";
import { cnpjService } from "../../services/cnpjService";
import type { CNPJ } from "../../types/cnpj";
import type { Job } from "../../types/job";
import "./JobsPage.css";

const JobsPage: React.FC = () => {
  const { user } = useAuthContext();
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadCNPJs = async () => {
      if (!user) return;

      try {
        const userCnpjs = await cnpjService.getCNPJsByUser(user.uid);
        setCnpjs(userCnpjs);
      } catch (error) {
        console.error("Erro ao carregar CNPJs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCNPJs();
  }, [user]);

  const handleCreateSuccess = (jobId: string) => {
    setShowCreateForm(false);
    // O JobList vai atualizar automaticamente via real-time subscription
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="jobs-page">
        <div className="jobs-header">
          <div className="header-info">
            <h1>Execuções</h1>
            <p>Gerencie suas execuções de consultas fiscais</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            disabled={cnpjs.length === 0}
            className="create-job-button"
          >
            <Plus size={20} />
            Nova Execução
          </Button>
        </div>

        {cnpjs.length === 0 && !isLoading && (
          <div className="no-cnpjs-warning">
            <div className="warning-content">
              <h3>Nenhum CNPJ cadastrado</h3>
              <p>Você precisa cadastrar pelo menos um CNPJ antes de criar execuções.</p>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="secondary"
              >
                Ir para Dashboard
              </Button>
            </div>
          </div>
        )}

        {cnpjs.length > 0 && (
          <div className="jobs-content">
            {showCreateForm ? (
              <div className="create-job-overlay">
                <div className="create-job-modal">
                  <div className="modal-header">
                    <h2>Nova Execução</h2>
                    <button
                      className="close-button"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <CreateJobForm
                    cnpjs={cnpjs}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
              </div>
            ) : (
              <JobList
                userId={user.uid}
                onViewJob={handleViewJob}
              />
            )}
          </div>
        )}

        {selectedJob && (
          <div className="job-details-overlay">
            <div className="job-details-modal">
              <div className="modal-header">
                <h2>Detalhes da Execução</h2>
                <button
                  className="close-button"
                  onClick={handleCloseJobDetails}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="job-details-content">
                <div className="detail-row">
                  <span className="detail-label">CNPJ:</span>
                  <span className="detail-value">{selectedJob.cnpj}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">
                    {selectedJob.task === "situacao_fiscal" && "Situação Fiscal"}
                    {selectedJob.task === "capag" && "CAPAG"}
                    {selectedJob.task === "ambos" && "Ambos"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${selectedJob.status}`}>
                    {selectedJob.status === "queued" && "Na fila"}
                    {selectedJob.status === "running" && "Executando"}
                    {selectedJob.status === "done" && "Concluído"}
                    {selectedJob.status === "error" && "Erro"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Criado em:</span>
                  <span className="detail-value">
                    {new Date(selectedJob.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                {selectedJob.error && (
                  <div className="detail-row">
                    <span className="detail-label">Erro:</span>
                    <span className="detail-value error">{selectedJob.error}</span>
                  </div>
                )}
                {selectedJob.notifyEmails && selectedJob.notifyEmails.length > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">E-mails:</span>
                    <span className="detail-value">
                      {selectedJob.notifyEmails.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
