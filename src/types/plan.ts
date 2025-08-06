export interface Plan {
  id: string;
  name: string;
  maxCNPJs: number;
  price: number;
  features: string[];
}

export const PLANS: Record<string, Plan> = {
  basic: {
    id: "basic",
    name: "Básico",
    maxCNPJs: 3,
    price: 99,
    features: ["Até 3 CNPJs", "Suporte por email", "Relatórios básicos"],
  },
  professional: {
    id: "professional",
    name: "Profissional",
    maxCNPJs: 10,
    price: 199,
    features: [
      "Até 10 CNPJs",
      "Suporte prioritário",
      "Relatórios avançados",
      "API access",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Empresarial",
    maxCNPJs: -1, // Ilimitado
    price: 399,
    features: [
      "CNPJs ilimitados",
      "Suporte 24/7",
      "Relatórios personalizados",
      "API completa",
      "Gerente dedicado",
    ],
  },
};
