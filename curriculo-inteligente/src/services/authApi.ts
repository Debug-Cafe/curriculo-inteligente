import type { LoginData, RegisterData, User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface AuthResponse {
  user: User;
  token: string;
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro na requisição");
  }

  return response.json();
};

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async me(token: string): Promise<User> {
    return apiRequest("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
