// Definição de paths da aplicação
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
} as const;

// Tipo para os paths
export type AppPaths = (typeof PATHS)[keyof typeof PATHS];
