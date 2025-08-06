"use client";

import type React from "react";
import { useState } from "react";
import { Building, FileText } from "lucide-react";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { cnpjService } from "../../../services/cnpjService";
import type { CNPJFormData } from "../../../types/cnpj";
import "./CNJPJForm.css";

interface CNPJFormProps {
  onSuccess: (formData: CNPJFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: CNPJFormData;
  isEditing?: boolean;
}

const CNPJForm: React.FC<CNPJFormProps> = ({
  onSuccess,
  onCancel,
  isLoading = false,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CNPJFormData>(
    initialData || {
      cnpj: "",
      nomeFantasia: "",
      statusFiscal: "regular",
      situacaoNegociacao: "pendente",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnpj) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!cnpjService.validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      onSuccess(formData);
    } catch (error) {
      console.error("Erro ao criar CNPJ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CNPJFormData, value: string) => {
    if (field === "cnpj") {
      const CNPJ = cnpjService.formatCNPJ(value);
      setFormData((prev) => ({ ...prev, [field]: CNPJ }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="cnpj-form-container">
      <div className="cnpj-form-header">
        <h3>{isEditing ? "Editar CNPJ" : "Cadastrar Novo CNPJ"}</h3>
        <p>
          {isEditing
            ? "Atualize os dados da empresa"
            : "Preencha os dados da empresa"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cnpj-form">
        <Input
          label="CNPJ"
          type="text"
          value={formData.cnpj}
          onChange={(value) => handleInputChange("cnpj", value)}
          error={errors.cnpj}
          placeholder="00.000.000/0000-00"
          icon={<Building size={20} />}
          required
        />

        <Input
          label="Nome Fantasia"
          type="text"
          value={formData.nomeFantasia || ""}
          onChange={(value) => handleInputChange("nomeFantasia", value)}
          placeholder="Nome da empresa (opcional)"
          icon={<FileText size={20} />}
        />

        <div className="form-row">
          <div className="form-field">
            <label className="input-label">
              Status Fiscal <span className="input-required">*</span>
            </label>
            <select
              value={formData.statusFiscal}
              onChange={(e) =>
                handleInputChange(
                  "statusFiscal",
                  e.target.value as
                    | "regular"
                    | "irregular"
                    | "suspenso"
                    | "baixado"
                )
              }
              className="select-field"
            >
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
              <option value="suspenso">Suspenso</option>
              <option value="baixado">Baixado</option>
            </select>
          </div>

          <div className="form-field">
            <label className="input-label">
              Situação de Negociação <span className="input-required">*</span>
            </label>
            <select
              value={formData.situacaoNegociacao}
              onChange={(e) =>
                handleInputChange(
                  "situacaoNegociacao",
                  e.target.value as
                    | "pendente"
                    | "em_andamento"
                    | "concluida"
                    | "cancelada"
                )
              }
              className="select-field"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <ErrorMessage message="Por favor, corrija os erros acima" />
        )}

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting
              ? isEditing
                ? "Atualizando..."
                : "Cadastrando..."
              : isEditing
              ? "Atualizar CNPJ"
              : "Cadastrar CNPJ"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CNPJForm;
export { type CNPJFormData };
