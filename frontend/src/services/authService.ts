const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type AuthResponse = {
  username: string;
  success: boolean;
};

/*
 * Helper functions for backend authentication API calls
 */
export const authService = {
  // Register a new user
  async register(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      return response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },

  // Login an existing user
  async login(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      return response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // Logout the current user
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      return response.json();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
};