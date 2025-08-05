"use client";

import type React from "react";
import { useState } from "react";
import { Mail, User } from "lucide-react";
import Input from "../Input/Input";
import PasswordInput from "../PassowordInput/PassowordInput";
import Button from "../Button/Button";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./RegisterForm.css";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterFormData, "confirmPassword">) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome completo é obrigatório";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitError(null); // Limpa erros anteriores
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await onSubmit({
        ...submitData,
        name: submitData.name.trim(),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro no cadastro:", error.message);
        setSubmitError(error.message);
      } else {
        console.error("Erro desconhecido no cadastro:", error);
        setSubmitError("Erro desconhecido ao criar conta");
      }
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Limpa erro de submit quando o usuário começa a digitar
    if (submitError) {
      setSubmitError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <Input
        label="Nome completo"
        type="text"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        error={errors.name}
        placeholder="Seu nome completo"
        icon={<User size={20} />}
        required
      />

      <Input
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        error={errors.email}
        placeholder="seu@email.com"
        icon={<Mail size={20} />}
        required
      />

      <PasswordInput
        label="Senha"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        error={errors.password}
        placeholder="Crie uma senha segura"
        required
      />

      <PasswordInput
        label="Confirmar senha"
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange("confirmPassword", value)}
        error={errors.confirmPassword}
        placeholder="Confirme sua senha"
        required
      />

      {error && <ErrorMessage message={error} />}
      {submitError && <ErrorMessage message={submitError} />}

      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={isLoading}
        className="register-button"
      >
        {isLoading ? "Criando conta..." : "Cadastrar"}
      </Button>

      <div className="register-footer">
        <p className="terms-text">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="terms-link">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="terms-link">
            Política de Privacidade
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
