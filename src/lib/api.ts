// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  withCredentials: true,
});

// Adjunta el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type MePayload = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};

export async function loginAPI(input: { email: string; password: string }) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/login",
    input
  );
  return data;
}
export async function registerAPI(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/register",
    input
  );
  return data;
}
export async function meAPI() {
  const { data } = await api.get<MePayload>("/auth/me");
  return data;
}
