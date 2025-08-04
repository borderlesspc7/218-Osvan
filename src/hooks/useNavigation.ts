import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Hook para navegação
export const useNavigation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navegar para uma página específica
  const navigateTo = (path: string) => {
    try {
      setIsLoading(true);
      setError(null);
      navigate(path);
    } catch {
      setError("Erro ao navegar para a página");
    } finally {
      setIsLoading(false);
    }
  };

  // Voltar uma página
  const goBack = () => {
    try {
      setIsLoading(true);
      setError(null);
      navigate(-1);
    } catch {
      setError("Erro ao voltar para a página anterior");
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Navegação com loading
  const navigateWithLoading = async (path: string, delay?: number) => {
    try {
      setIsLoading(true);
      setError(null);

      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      navigate(path);
    } catch {
      setError("Erro durante a navegação");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    navigateTo,
    goBack,
    navigateWithLoading,
    isLoading,
    error,
    clearError,
  };
};
