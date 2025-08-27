import type { ReactNode } from "react";
interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
}

interface AuthState {
  user: User;
}

interface AuthContextType {
  auth: AuthState | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export type {User, AuthState, AuthContextType, AuthProviderProps}