// Tipo de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "cliente" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
