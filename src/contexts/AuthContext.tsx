import { createContext } from "react";
import type { ReactNode } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";
import type { MePayload } from "../lib/api";

export interface AuthContextType {
  user: MePayload | null;
  loading: boolean;
  error: string | null;
  doRegister: (input: { name?: string; email: string; password: string }) => Promise<void>;
  doLogin: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
