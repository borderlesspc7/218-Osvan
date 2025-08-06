"use client";

import React, { useState } from "react";
import { useAuthContext } from "../../contexts/useAuthContext";
import { useNavigation } from "../../hooks/useNavigation";
import AuthLayout from "../../components/auth/AuthLayout/AuthLayout";
import AuthIllustration from "../../components/auth/AuthIllustration/AuthIllustration";
import AuthCard from "../../components/auth/AuthCard/AuthCard";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: authError, clearError } = useAuthContext();
  const { navigateTo } = useNavigation();

  const handleLogin = async (data: { email: string; password: string }) => {
    clearError();
    setIsLoading(true);

    try {
      await login(data);
      navigateTo("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Funcionalidade em desenvolvimento");
  };

  return (
    <AuthLayout>
      <AuthIllustration
        type="login"
        title="Renegociação Tributária"
        subtitle="Simplifique a gestão fiscal da sua empresa"
      />
      <AuthCard
        title="Bem-vindo de volta"
        subtitle="Entre na sua conta para continuar"
      >
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          error={authError}
        />
        <div className="login-footer">
          <p>
            Não tem uma conta?{" "}
            <button
              type="button"
              className="create-account-link"
              onClick={() => navigateTo("/register")}
            >
              Criar conta
            </button>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
