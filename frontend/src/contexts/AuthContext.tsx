import { createContext, useState, useEffect, useCallback } from "react";
import { authService, AUTH_TOKEN_EXPIRED_EVENT } from "../services/authService";

type User = {
  username: string; // Add other user properties as needed
};

type AuthContextType = {
  user: User | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleTokenExpired = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleTokenExpired);
    return () => {
      window.removeEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleTokenExpired);
    };
  }, [handleTokenExpired]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged / authenticated
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser({ username: response.username });
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Function to register a new user
  const register = async (username: string, password: string) => {
    const response = await authService.register(username, password);
    if (response.success) {
      setUser({ username: response.username });
    } else {
      throw new Error("Registration failed");
    }
  };

  // Function to login an existing user
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response.success) {
      setUser({ username: response.username });
    } else {
      throw new Error("Login failed");
    }
  };

  // Function to logout the current user
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    register,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
