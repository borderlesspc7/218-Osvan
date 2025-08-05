"use client";

import type React from "react";
import { useState } from "react";
import { useAuthContext } from "../../contexts/useAuthContext";
import { useNavigation } from "../../hooks/useNavigation";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import AuthIllustration from "../../components/AuthIllustration/AuthIllustration";
import AuthCard from "../../components/AuthCard/AuthCard";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, error: authError, clearError } = useAuthContext();
  const { navigateTo } = useNavigation();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    clearError();
    setIsLoading(true);

    try {
      await register({
        ...data,
        role: "client", // Default role for new registrations
      });
      navigateTo("/dashboard");
    } catch (error) {
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigateTo("/login");
  };

  return (
    <AuthLayout>
      <AuthIllustration
        type="register"
        title="Junte-se a nós"
        subtitle="Transforme a gestão tributária da sua empresa"
      />
      <AuthCard
        title="Criar nova conta"
        subtitle="Preencha os dados para começar"
        showBackButton
        onBackClick={handleBackToLogin}
      >
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={authError}
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;
