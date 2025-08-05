export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "user" | "client" | "admin";
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: "user" | "client" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}
