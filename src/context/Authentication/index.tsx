import { createContext, useState, useEffect, useContext } from 'react';
import * as user from "../../types/user"

const AuthContext = createContext<user.AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: user.AuthProviderProps) => {
  const [auth, setAuth] = useState<user.AuthState | null>(() => {
    try {
      const storedAuth = sessionStorage.getItem("authentication");
      return storedAuth ? JSON.parse(storedAuth) as user.AuthState : null;
    } catch (error) {
      console.error("Failed to parse auth data", error);
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("authentication", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("authentication");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider , AuthContext };