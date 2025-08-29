// Definição de paths da aplicação
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CERTIFICATES: "/certidoes",
  NEGOTIATION: "/negociacao",
  JOBS: "/execucoes",
  HISTORY_EXPORT: "/historico-exportacao",
  PAYMENTS: "/pagamentos",
} as const;

// Tipo para os paths
export type AppPaths = (typeof PATHS)[keyof typeof PATHS];
