"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { useAuthContext } from "../../contexts/useAuthContext";
import DashboardLayout from "../../components/Dashboard/DashboardLayout/DashboardLayout";
import UserProfile from "../../components/UserProfile/UserProfile";
import CNPJForm from "../../components/Dashboard/CNJPJForm/CNJPJForm";
import CNPJList from "../../components/Dashboard/CNPJList/CNPJList";
import Button from "../../components/ui/Button/Button";
import { cnpjService } from "../../services/cnpjService";
import { PLANS } from "../../types/plan";
import type { CNPJ, CNPJFormData } from "../../types/cnpj";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCNPJ, setEditingCNPJ] = useState<CNPJ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userPlan = PLANS.basic || {
    id: "basic",
    name: "Básico",
    maxCNPJs: 3,
    price: 99,
    features: ["Até 3 CNPJs", "Suporte por email", "Relatórios básicos"],
  };

  const loadCNPJs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const userCnpjs = await cnpjService.getCNPJsByUser(user.uid);
      setCnpjs(userCnpjs);
    } catch (err) {
      console.error("Erro ao carregar CNPJs:", err);
      setError("Erro ao carregar CNPJs. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCNPJs();
  }, [user]);

  const handleCreateCNPJ = async (formData: CNPJFormData) => {
    if (!user) return;

    try {
      const newCnpj = await cnpjService.createCNPJ(user.uid, formData);
      setCnpjs([...cnpjs, newCnpj]);
      setShowForm(false);
      setEditingCNPJ(null);
    } catch (err) {
      console.error("Erro ao criar CNPJ:", err);
      setError("Erro ao criar CNPJ. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCNPJ = async (formData: CNPJFormData) => {
    if (!editingCNPJ) return;

    try {
      await cnpjService.updateCNPJ(editingCNPJ.id, formData);
      setCnpjs((prev) =>
        prev.map((cnpj) =>
          cnpj.id === editingCNPJ.id
            ? { ...cnpj, ...formData, updatedAt: new Date().toISOString() }
            : cnpj
        )
      );
      setShowForm(false);
      setEditingCNPJ(null);
    } catch (err) {
      console.error("Erro ao atualizar CNPJ:", err);
      setError("Erro ao atualizar CNPJ. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCNPJ = async (cnpjId: string) => {
    if (!confirm("Tem certeza que deseja excluir este CNPJ?")) return;

    try {
      await cnpjService.deleteCNPJ(cnpjId);
      setCnpjs((prev) => prev.filter((cnpj) => cnpj.id !== cnpjId));
    } catch (err) {
      alert("Erro ao excluir CNPJ:" + err);
      console.log(err);
      setError("Erro ao excluir CNPJ. Por favor, tente novamente.");
    }
  };

  const handleEditCNPJ = (cnpj: CNPJ) => {
    setEditingCNPJ(cnpj);
    setShowForm(true);
  };

  const canAddMoreCNPJs = () => {
    if (userPlan.maxCNPJs === -1) return true;
    return cnpjs.length < userPlan.maxCNPJs;
  };

  const getRemainingCNPJs = () => {
    if (userPlan.maxCNPJs === -1) return "Ilimitado";
    return userPlan.maxCNPJs - cnpjs.length;
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
      <div className="dashboard-page">
        <div className="dashboard-sidebar">
          <UserProfile />

          <div className="plan-limits">
            <h4>Limite do Plano</h4>
            <div className="limit-info">
              <span className="limit-current">{cnpjs.length}</span>
              <span className="limit-separator">/</span>
              <span className="limit-max">
                {userPlan.maxCNPJs === -1 ? "∞" : userPlan.maxCNPJs}
              </span>
            </div>
            <p className="limit-text">
              {userPlan.maxCNPJs === -1
                ? "CNPJs ilimitados"
                : `${getRemainingCNPJs()} CNPJs restantes`}
            </p>

            {!canAddMoreCNPJs() && (
              <div className="limit-warning">
                <AlertTriangle size={16} />
                <span>Limite atingido</span>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-main-content">
          {error && (
            <div className="error-banner">
              <AlertTriangle size={20} />
              <span>{error}</span>
              <button onClick={loadCNPJs} className="retry-button">
                Tentar novamente
              </button>
            </div>
          )}

          {showForm ? (
            <CNPJForm
              onSuccess={async (formData: CNPJFormData) => {
                if (editingCNPJ) {
                  await handleUpdateCNPJ(formData);
                } else {
                  await handleCreateCNPJ(formData);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingCNPJ(null);
              }}
              initialData={
                editingCNPJ
                  ? {
                      cnpj: editingCNPJ.cnpj,
                      nomeFantasia: editingCNPJ.nomeFantasia || "",
                      statusFiscal: editingCNPJ.statusFiscal,
                      situacaoNegociacao: editingCNPJ.situacaoNegociacao,
                    }
                  : undefined
              }
              isEditing={!!editingCNPJ}
            />
          ) : (
            <>
              <div className="dashboard-header">
                <div className="header-info">
                  <h1>Meus CNPJs</h1>
                  <p>Gerencie suas empresas e negociações tributárias</p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={!canAddMoreCNPJs()}
                  className="add-cnpj-button"
                >
                  <Plus size={20} />
                  Adicionar CNPJ
                </Button>
              </div>

              <CNPJList
                cnpjs={cnpjs}
                onEdit={handleEditCNPJ}
                onDelete={handleDeleteCNPJ}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
