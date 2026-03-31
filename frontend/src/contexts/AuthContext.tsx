import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

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

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const checkAuth = async () => {
      try {
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

// Custom hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
