import { useState, useEffect } from "react";
import type { UserData } from "../types/auth";
import { authService } from "../services/authService";
import type { LoginData, RegisterData } from "../types/auth";

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para fazer login
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(data);
      setUser(response.user);
    } catch (err) {
      setError("Erro ao fazer login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para registrar
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(data);
      setUser(response.user);
    } catch (err) {
      setError("Erro ao registrar");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.logout();
      setUser(null);
    } catch (err) {
      setError("Erro ao fazer logout");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Verificar autenticação inicial
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };
};
