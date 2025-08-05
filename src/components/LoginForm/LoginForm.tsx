"use client";

import type React from "react";
import { useState } from "react";
import { Mail } from "lucide-react";
import Input from "../Input/Input";
import PasswordInput from "../PassowordInput/PassowordInput";
import Button from "../Button/Button";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./LoginForm.css";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onForgotPassword: () => void;
  isLoading: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
        placeholder="Digite sua senha"
        required
      />

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={isLoading}
        className="login-button"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <a
        href="#"
        className="forgot-password"
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword();
        }}
      >
        Esqueci minha senha
      </a>
    </form>
  );
};

export default LoginForm;
