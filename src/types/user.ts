// Tipo de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "client" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
